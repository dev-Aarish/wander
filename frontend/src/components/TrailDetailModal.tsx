import React from 'react';
import { Trail } from '../types';
import { X, Volume2, Printer, MapPin, Wind, Thermometer, Sun, Compass, Trees, Calendar, ArrowRight } from 'lucide-react';

interface TrailDetailModalProps {
  trail: Trail | null;
  onClose: () => void;
  onPlayAudio: (trail: Trail) => void;
  onGenerateCard: (trail: Trail) => void;
}

export const TrailDetailModal: React.FC<TrailDetailModalProps> = ({
  trail,
  onClose,
  onPlayAudio,
  onGenerateCard,
}) => {
  if (!trail) return null;

  const stage = trail.foliage_stage_pct ?? 80;

  // Canopy species entries sorted
  const speciesList = Object.entries(trail.canopy_composition)
    .filter(([_, val]) => val > 0)
    .sort(([_, a], [__, b]) => b - a);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bark-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-parchment-50 rounded-2xl border border-parchment-300 shadow-2xl max-w-3xl w-full p-6 md:p-8 relative my-8 modal">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-bark-400 hover:text-bark-900 p-1.5 rounded-lg hover:bg-parchment-200/60 transition-colors pressable"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Region & Header */}
        <div className="flex items-center space-x-2 text-xs font-mono text-forest-800 uppercase tracking-wider mb-2 font-semibold">
          <MapPin className="w-4 h-4 text-forest-700" />
          <span>{trail.region}</span>
        </div>

        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-bark-900 mb-3 leading-tight">
          {trail.name}
        </h2>

        <p className="font-sans text-base text-bark-700 leading-relaxed mb-6">
          {trail.summary}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-parchment-100 p-3.5 rounded-xl border border-parchment-300/80">
            <span className="text-[11px] font-mono text-bark-500 uppercase block mb-1">Peak Elevation</span>
            <span className="font-serif font-bold text-xl text-bark-900">{trail.elevation_m} m</span>
            <span className="text-[11px] text-bark-600 block mt-0.5">~{Math.round(trail.elevation_m * 3.28)} ft</span>
          </div>

          <div className="bg-parchment-100 p-3.5 rounded-xl border border-parchment-300/80">
            <span className="text-[11px] font-mono text-bark-500 uppercase block mb-1">Trail Distance</span>
            <span className="font-serif font-bold text-xl text-bark-900">{trail.length_km} km</span>
            <span className="text-[11px] text-bark-600 block mt-0.5">~{(trail.length_km * 0.621).toFixed(1)} miles</span>
          </div>

          <div className="bg-parchment-100 p-3.5 rounded-xl border border-parchment-300/80">
            <span className="text-[11px] font-mono text-bark-500 uppercase block mb-1">Route Grade</span>
            <span className="font-serif font-bold text-xl text-terracotta-700">{trail.difficulty}</span>
            <span className="text-[11px] text-bark-600 block mt-0.5">Mountain terrain</span>
          </div>

          <div className="bg-parchment-100 p-3.5 rounded-xl border border-parchment-300/80">
            <span className="text-[11px] font-mono text-bark-500 uppercase block mb-1">Foliage Stage</span>
            <span className="font-serif font-bold text-xl text-forest-800">{stage.toFixed(1)}%</span>
            <span className="text-[11px] text-bark-600 block mt-0.5">{trail.peak_status}</span>
          </div>
        </div>

        {/* TabPFN 72h Peak Prediction Box */}
        <div className="bg-gradient-to-r from-amber-50 to-parchment-100 p-4 rounded-xl border border-amber-300/70 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-terracotta-700" />
              <span className="font-serif font-bold text-sm text-bark-900">
                TabPFN 72-Hour Peak Foliage Window:
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-terracotta-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              {trail.peak_window_start} to {trail.peak_window_end}
            </span>
          </div>

          <div className="w-full bg-parchment-200 h-2.5 rounded-full overflow-hidden border border-parchment-300 mb-2">
            <div
              className="h-full bg-gradient-to-r from-forest-600 via-amber-500 to-terracotta-600 transition-all duration-300"
              style={{ width: `${Math.min(100, stage)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-bark-600">
            <span>Chill Hours: {trail.current_weather.chill_hours_cumulative} hrs</span>
            <span>Solar: {trail.current_weather.solar_radiation_mj} MJ/m²</span>
            <span>Drought Deficit: {trail.current_weather.drought_stress_index}</span>
          </div>
        </div>

        {/* Canopy Composition */}
        <div className="mb-6">
          <span className="text-xs font-mono uppercase text-bark-600 font-semibold block mb-2 flex items-center gap-1.5">
            <Trees className="w-3.5 h-3.5 text-forest-700" />
            <span>Forest Canopy Breakdown (Tiger Data Indexed):</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {speciesList.map(([species, pct]) => {
              const name = species.replace('_pct', '').replace(/_/g, ' ');
              return (
                <div key={species} className="bg-parchment-100 p-2.5 rounded-lg border border-parchment-300 flex justify-between items-center text-xs">
                  <span className="capitalize text-bark-800 font-medium truncate mr-1">{name}</span>
                  <span className="font-mono font-bold text-bark-900">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viewpoints */}
        <div className="mb-8">
          <span className="text-xs font-mono uppercase text-bark-600 font-semibold block mb-2">
            Key Vista Checkpoints:
          </span>
          <div className="space-y-2">
            {trail.viewpoints.map((vp, idx) => (
              <div key={idx} className="bg-parchment-100/80 p-3 rounded-lg border border-parchment-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div>
                  <span className="font-semibold text-bark-900 mr-2">{vp.name}</span>
                  <span className="text-bark-600 italic">({vp.species_focus})</span>
                </div>
                <div className="font-mono text-bark-500 text-[11px] flex-shrink-0">
                  {vp.distance_km} km • {vp.elevation_m} m
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Zero-Screen Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-parchment-300">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onPlayAudio(trail);
              }}
              className="inline-flex items-center space-x-2 bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 text-bark-900 px-4 py-2.5 rounded-xl text-xs font-medium pressable"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Listen 45s Briefing</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onGenerateCard(trail);
              }}
              className="inline-flex items-center space-x-2 bg-parchment-100 hover:bg-parchment-200 border border-parchment-300 text-bark-900 px-4 py-2.5 rounded-xl text-xs font-medium pressable"
            >
              <Printer className="w-4 h-4 text-terracotta-700" />
              <span>Generate Pocket Guide</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono text-bark-600 hover:text-bark-900 pressable"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
