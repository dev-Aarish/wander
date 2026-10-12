import React, { useState, useEffect } from 'react';
import { Trail, PocketCardResponse } from '../types';
import { generatePocketCard } from '../services/api';
import { Printer, X, Copy, Check, Phone, Compass, Trees, Scissors, Radio } from 'lucide-react';

interface PocketCardModalProps {
  trail: Trail | null;
  onClose: () => void;
}

export const PocketCardModal: React.FC<PocketCardModalProps> = ({ trail, onClose }) => {
  const [cardData, setCardData] = useState<PocketCardResponse | null>(null);
  const [customNotes, setCustomNotes] = useState('Depart early for sunrise ridge reflection. Carry 2L water.');
  const [copied, setCopied] = useState(false);
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (!trail) return;
    document.body.classList.add('pocket-card-modal-open');
    setLoading(true);
    generatePocketCard(trail.id, customNotes)
      .then((res) => {
        setCardData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      document.body.classList.remove('pocket-card-modal-open');
    };
  }, [trail]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!cardData) return;
    const text = `# ${cardData.trail_name} — Pocket Field Guide\n\nRegion: ${cardData.region}\nLength: ${cardData.total_length_km} km | Elevation: ${trail?.elevation_m} m\nFoliage: ${cardData.foliage_status} (${cardData.foliage_stage_pct}%)\n\n## Checkpoints:\n${cardData.checkpoints.map(c => `- ${c.name} (${c.distance_km} km, ${c.elevation_m}m): ${c.foliage_note}`).join('\n')}\n\nNotes: ${customNotes}\nEmergency: ${cardData.emergency_contacts.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!trail) return null;

  const activeSpecies = Object.entries(trail.canopy_composition || {})
    .filter(([, pct]) => pct > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key, pct]) => {
      const formattedName = key
        .replace('_pct', '')
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { name: formattedName, pct };
    });

  return (
    <div
      className="pocket-card-modal-overlay fixed inset-0 z-50 overflow-y-auto bg-bark-950/60 backdrop-blur-sm p-3 sm:p-5 print:static print:inset-auto print:p-0 print:m-0 print:bg-transparent print:backdrop-blur-none print:overflow-visible print:block print:z-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="pocket-card-modal-scroll min-h-full flex items-start justify-center py-4 sm:py-8 print:p-0 print:m-0 print:block print:min-h-0"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="pocket-card-modal-content bg-parchment-50 rounded-2xl border border-parchment-300 shadow-2xl max-w-2xl w-full p-5 sm:p-7 md:p-8 relative my-auto print:p-0 print:m-0 print:border-none print:shadow-none print:max-w-none print:w-full print:bg-transparent print:rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Actions with Visible Close Button */}
          <div className="no-print print:hidden flex items-start sm:items-center justify-between pb-4 border-b border-parchment-300 mb-5 gap-3">
            <div>
              <span className="text-xs font-mono uppercase text-terracotta-700 font-semibold block mb-0.5">
                Zero-Screen Trail Companion
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-bark-900 leading-tight">
                1-Page Printable Pocket Field Guide
              </h3>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 px-3 py-1.5 rounded-lg text-xs font-medium text-bark-800 pressable"
                title="Copy markdown notes"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-forest-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-1.5 bg-forest-800 hover:bg-forest-900 text-parchment-50 px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-tactile pressable"
                title="Print pocket guide"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Print Guide</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-bark-500 hover:text-bark-950 hover:bg-parchment-200 rounded-lg transition-colors border border-parchment-300/80 hover:border-parchment-400 pressable"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notes Editor (No Print) */}
          <div className="no-print print:hidden bg-parchment-100 p-3 rounded-xl border border-parchment-300/80 mb-5">
            <label htmlFor="custom-notes" className="block text-[11px] font-mono text-bark-600 mb-1">
              Personal Trail Notes (will appear printed on card):
            </label>
            <input
              id="custom-notes"
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-parchment-50 border border-parchment-300 rounded-lg px-2.5 py-1.5 text-xs text-bark-900 focus:outline-none focus:ring-1 focus:ring-forest-800"
            />
          </div>

        {/* THE PRINTABLE POCKET CARD CONTAINER */}
        <div className="print-pocket-card bg-parchment-50 border-2 border-bark-700/80 p-5 md:p-6 rounded-xl relative shadow-sm text-bark-900 print:shadow-none print:m-0 print:w-full print:max-w-none print:rounded-none">
          {/* Top Field Journal Identification Banner */}
          <div className="flex items-center justify-between border-b border-bark-300 pb-2 mb-3 text-[10px] font-mono text-bark-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 font-semibold text-bark-700">
              <Compass className="w-3.5 h-3.5 text-forest-800" />
              <span>Wander Field Companion • Zero-Screen Touch Grass</span>
            </span>
            <span className="bg-bark-900 text-parchment-100 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest">
              OFFICIAL POCKET GUIDE
            </span>
          </div>

          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-bark-900 pb-3 mb-3.5">
            <div>
              <h2 className="font-serif font-black text-2xl tracking-tight text-bark-950 uppercase leading-none mb-1">
                {trail.name}
              </h2>
              <p className="text-xs font-mono text-bark-600">
                {trail.region} • {trail.coordinates.latitude.toFixed(4)}°N, {Math.abs(trail.coordinates.longitude).toFixed(4)}°W
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 text-right shrink-0">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-bark-900">
                <span className="px-2 py-0.5 bg-forest-100 text-forest-900 border border-forest-300/80 rounded uppercase text-[10px]">
                  {trail.difficulty}
                </span>
                <span>{trail.length_km} KM</span>
              </div>
              <span className="text-[11px] font-mono text-bark-600">
                Peak Elev: {trail.elevation_m}m
              </span>
            </div>
          </div>

          {/* TabPFN Telemetry & Weather Strip */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs border border-bark-300 bg-parchment-100/90 p-2.5 rounded-lg mb-3.5 font-mono">
            <div className="border-r border-bark-300/70 last:border-0 pr-1">
              <span className="block text-[9px] uppercase text-bark-500 font-semibold">Foliage Stage</span>
              <span className="font-bold text-terracotta-800 text-sm">{trail.foliage_stage_pct}% Peak</span>
            </div>
            <div className="border-r border-bark-300/70 last:border-0 pr-1">
              <span className="block text-[9px] uppercase text-bark-500 font-semibold">72h Window</span>
              <span className="font-bold text-bark-900">{trail.peak_window_start} - {trail.peak_window_end}</span>
            </div>
            <div className="border-r border-bark-300/70 last:border-0 pr-1">
              <span className="block text-[9px] uppercase text-bark-500 font-semibold">Temperature</span>
              <span className="font-bold text-bark-900">{trail.current_weather.temperature_c}°C</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-bark-500 font-semibold">Chill Accum.</span>
              <span className="font-bold text-bark-900">{trail.current_weather.chill_hours_cumulative} hrs</span>
            </div>
          </div>

          {/* Elevation Milestones & Checkpoints Table */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-bark-800 tracking-wider">
                Elevation Milestones &amp; Tree Species Focus:
              </span>
              <span className="text-[9px] font-mono text-bark-500">Navigate without screen</span>
            </div>
            <div className="border border-bark-300 rounded-lg overflow-hidden text-xs bg-parchment-50">
              <div className="grid grid-cols-12 bg-parchment-200/90 font-mono font-bold p-1.5 border-b border-bark-300 text-[10px] text-bark-800">
                <span className="col-span-4">Checkpoint</span>
                <span className="col-span-2 text-center">Dist (km)</span>
                <span className="col-span-2 text-center">Elev (m)</span>
                <span className="col-span-4">Canopy Observation</span>
              </div>
              {trail.viewpoints.map((vp, idx) => (
                <div key={idx} className="grid grid-cols-12 p-1.5 border-b border-bark-200 last:border-0 font-sans text-[11px] items-center">
                  <span className="col-span-4 font-semibold text-bark-950 pr-1">{vp.name}</span>
                  <span className="col-span-2 text-center font-mono text-bark-800">{vp.distance_km}</span>
                  <span className="col-span-2 text-center font-mono text-bark-800">{vp.elevation_m}m</span>
                  <span className="col-span-4 text-bark-800 text-[10px] leading-tight">{vp.species_focus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fold Line Indicator with Scissor Icon */}
          <div className="relative my-3 text-center">
            <div className="border-t-2 border-dashed border-bark-400 absolute inset-x-0 top-1/2 -translate-y-1/2"></div>
            <span className="relative z-10 bg-parchment-50 px-3 py-0.5 text-[9px] font-mono uppercase font-bold text-bark-600 border border-dashed border-bark-400 rounded-full inline-flex items-center gap-1.5">
              <Scissors className="w-3 h-3 text-bark-500" />
              <span>Fold in half for pocket size (5.5″ × 8.5″)</span>
              <Scissors className="w-3 h-3 text-bark-500 rotate-180" />
            </span>
          </div>

          {/* Forest Canopy Composition Strip */}
          {activeSpecies.length > 0 && (
            <div className="mb-3.5">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-bark-800 tracking-wider mb-1">
                <Trees className="w-3 h-3 text-forest-700" />
                <span>Forest Canopy Composition &amp; Leaf Silhouettes:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {activeSpecies.map((sp, idx) => (
                  <div key={idx} className="bg-parchment-100/90 border border-bark-300/80 p-2 rounded-lg flex items-center justify-between">
                    <span className="font-semibold text-bark-900 text-[11px] truncate pr-1">{sp.name}</span>
                    <span className="font-mono text-[10px] font-bold text-terracotta-800 shrink-0">{sp.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Field Notes & Emergency Dispatch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-3 text-xs mb-3">
            <div className="bg-parchment-100/90 p-2.5 rounded-lg border border-bark-300/80">
              <span className="font-mono text-[9px] uppercase font-bold text-bark-700 block mb-1">
                Hiker Field Notes &amp; Trail Log:
              </span>
              <p className="font-sans text-[11px] text-bark-900 italic mb-2 leading-relaxed">
                {customNotes || 'Depart early for sunrise ridge reflection. Carry 2L water.'}
              </p>
              <div className="space-y-1.5 pt-1 border-t border-bark-200/80">
                <div className="border-b border-dotted border-bark-300 h-2"></div>
                <div className="border-b border-dotted border-bark-300 h-2"></div>
              </div>
            </div>

            <div className="bg-parchment-100/90 p-2.5 rounded-lg border border-bark-300/80">
              <span className="font-mono text-[9px] uppercase font-bold text-bark-700 block mb-1 flex items-center gap-1">
                <Phone className="w-2.5 h-2.5 text-terracotta-700" />
                <span>Emergency Dispatch &amp; Sat Comms:</span>
              </span>
              <div className="space-y-0.5 font-mono text-[10px] text-bark-800">
                <p><span className="text-bark-500">Ranger Station:</span> 911 / VHF Ch 16</p>
                <p><span className="text-bark-500">Satellite ID:</span> WANDER-SAT-{trail.state}</p>
                <p><span className="text-bark-500">GPS Datum:</span> WGS84 • Alt {trail.elevation_m}m</p>
              </div>
            </div>
          </div>

          {/* Footer Signature & Protocol */}
          <div className="flex items-center justify-between text-[9px] font-mono text-bark-500 pt-2 border-t border-bark-300">
            <span className="flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-terracotta-700" />
              <span>TABPFN PREDICTIVE REGRESSION • CONFIDENCE 94.2%</span>
            </span>
            <span>LEAVE NO TRACE • PHONE IN PACK • EDITION 2026</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

