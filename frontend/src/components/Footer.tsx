import { Compass, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bark-900 text-parchment-200 py-12 md:py-16 border-t border-bark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-bark-800">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-parchment-100 flex items-center justify-center">
                <Compass className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-serif font-bold text-2xl text-parchment-100">Wander</span>
            </div>
            <p className="text-xs text-parchment-400 font-sans leading-relaxed max-w-sm">
              Open phenology, fall peak foliage forecaster, and zero-screen trail companion built for the <strong>DEV Hacktoberfest 2026 Challenge: Week 1 — Touch Grass</strong>.
            </p>
            <div className="text-[11px] font-mono text-parchment-500 pt-1">
              "The best builds make the screen the shortest part of the experience."
            </div>
          </div>

          {/* Hackathon Partners Col */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase text-amber-400 font-semibold block mb-2">
              Integrated Partner Ecosystem:
            </span>
            <ul className="space-y-1.5 text-xs text-parchment-300">
              <li className="flex items-center justify-between py-1 border-b border-bark-800/60">
                <span className="font-medium text-parchment-100">TabPFN (Prior Labs)</span>
                <span className="text-[11px] text-parchment-400 font-mono">Tabular Chlorophyll Regressor</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-bark-800/60">
                <span className="font-medium text-parchment-100">Tiger Data</span>
                <span className="text-[11px] text-parchment-400 font-mono">PostgreSQL + pgvector</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-bark-800/60">
                <span className="font-medium text-parchment-100">Temporal</span>
                <span className="text-[11px] text-parchment-400 font-mono">Durable Weather Workflows</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-bark-800/60">
                <span className="font-medium text-parchment-100">ElevenLabs</span>
                <span className="text-[11px] text-parchment-400 font-mono">45s Voice Synthesis</span>
              </li>
            </ul>
          </div>

          {/* Open Innovation & Science */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-mono text-xs uppercase text-amber-400 font-semibold block mb-2">
              Why Open Science:
            </span>
            <p className="text-xs text-parchment-400 leading-relaxed">
              Proprietary tourism maps are static and commercialized. Wander computes hyper-local foliage physics directly from NOAA meteorology and USFS forestry datasets. Zero user tracking.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-parchment-500">
          <div>
            MIT Licensed • Open Source Phenology Project
          </div>
          <div className="flex items-center space-x-2">
            <span>Built with care for outdoor wanderers</span>
            <span>🍂</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
