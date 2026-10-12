import React from 'react';
import { Trail } from '../types';
import { Volume2, Printer, MapPin, Mountain, ArrowUpRight, CloudSun, Calendar } from 'lucide-react';

interface TrailCardProps {
  trail: Trail;
  onSelectTrail: (trail: Trail) => void;
  onPlayAudio: (trail: Trail) => void;
  onGenerateCard: (trail: Trail) => void;
}

export const TrailCard: React.FC<TrailCardProps> = ({
  trail,
  onSelectTrail,
  onPlayAudio,
  onGenerateCard,
}) => {
  const stage = trail.foliage_stage_pct ?? 70;
  const isPeak = stage >= 85 && stage <= 105;
  const isApproaching = stage >= 60 && stage < 85;

  // Determine primary species for the card
  const dominantSpecies = Object.entries(trail.canopy_composition)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, val]) => val > 0)
    .slice(0, 2)
    .map(([key, val]) => {
      const cleanName = key.replace('_pct', '').replace(/_/g, ' ');
      return `${Math.round(val)}% ${cleanName}`;
    })
    .join(', ');

  const statusBadgeColor = isPeak
    ? 'bg-terracotta-100 text-terracotta-900 border-terracotta-300'
    : isApproaching
    ? 'bg-amber-100 text-amber-900 border-amber-300'
    : 'bg-forest-100 text-forest-900 border-forest-300';

  return (
    <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 shadow-tactile interactive-card flex flex-col justify-between overflow-hidden">
      {/* Top Header & Peak Status */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className="text-xs font-mono font-medium text-bark-500 uppercase tracking-wider flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
            <span className="truncate">{trail.region}</span>
          </span>
          <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${statusBadgeColor}`}>
            {trail.peak_status || (isPeak ? '72h Peak Vibrant' : 'Turning')}
          </span>
        </div>

        <h3
          onClick={() => onSelectTrail(trail)}
          className="font-serif font-bold text-xl text-bark-900 hover:text-terracotta-700 cursor-pointer transition-colors leading-tight mb-2"
        >
          {trail.name}
        </h3>

        <p className="text-xs text-bark-600 line-clamp-2 leading-relaxed mb-4">
          {trail.summary}
        </p>

        {/* Foliage Stage Meter (TabPFN predicted) */}
        <div className="bg-parchment-100 rounded-xl p-3 border border-parchment-300/80 mb-4">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-bark-600">TabPFN Progress</span>
            <span className="font-bold text-bark-900">{stage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-parchment-200 h-2 rounded-full overflow-hidden border border-parchment-300">
            <div
              className="h-full bg-gradient-to-r from-forest-600 via-amber-500 to-terracotta-600 transition-all duration-300"
              style={{ width: `${Math.min(100, stage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-bark-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-terracotta-700" />
              {trail.peak_window_start && trail.peak_window_end ? `${trail.peak_window_start} - ${trail.peak_window_end}` : 'Peak this week'}
            </span>
            <span className="font-medium text-terracotta-800">
              {trail.days_to_peak === 0
                ? 'Peak Now'
                : (trail.days_to_peak ?? 0) < 0
                ? `${Math.abs(trail.days_to_peak!)}d past peak`
                : `${trail.days_to_peak}d to peak`}
            </span>
          </div>
        </div>

        {/* Trail Specs (Elevation, Distance, Weather) */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-parchment-200">
          <div>
            <span className="block text-[10px] font-mono text-bark-500 uppercase">Elevation</span>
            <span className="font-mono font-semibold text-bark-900">{trail.elevation_m}m</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono text-bark-500 uppercase">Distance</span>
            <span className="font-mono font-semibold text-bark-900">{trail.length_km}km</span>
          </div>
          <div>
            <span className="block text-[10px] font-mono text-bark-500 uppercase">Difficulty</span>
            <span className={`font-mono font-semibold ${
              trail.difficulty === 'Easy' ? 'text-forest-700' :
              trail.difficulty === 'Moderate' ? 'text-amber-700' : 'text-terracotta-700'
            }`}>
              {trail.difficulty}
            </span>
          </div>
        </div>

        {/* Dominant Species */}
        <div className="mt-3 text-[11px] text-bark-600 flex items-center justify-between">
          <span className="font-mono text-bark-500 text-[10px] uppercase">Canopy:</span>
          <span className="font-medium text-bark-800 truncate text-right ml-2">{dominantSpecies}</span>
        </div>
      </div>

      {/* Zero-Screen Action Toolbar */}
      <div className="bg-parchment-100/90 border-t border-parchment-300/80 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onPlayAudio(trail)}
            title="Listen to 45s ElevenLabs Trailhead Audio Briefing"
            className="inline-flex items-center space-x-1.5 bg-parchment-50 hover:bg-parchment-200 text-bark-800 border border-parchment-300 px-2.5 py-1.5 rounded-lg text-xs font-medium pressable"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>45s Audio</span>
          </button>

          <button
            onClick={() => onGenerateCard(trail)}
            title="Generate Printable 1-Page Pocket Guide"
            className="inline-flex items-center space-x-1.5 bg-parchment-50 hover:bg-parchment-200 text-bark-800 border border-parchment-300 px-2.5 py-1.5 rounded-lg text-xs font-medium pressable"
          >
            <Printer className="w-3.5 h-3.5 text-terracotta-700" />
            <span>Pocket Card</span>
          </button>
        </div>

        <button
          onClick={() => onSelectTrail(trail)}
          className="text-bark-900 hover:text-terracotta-800 text-xs font-semibold flex items-center gap-1 pressable"
        >
          <span>Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
