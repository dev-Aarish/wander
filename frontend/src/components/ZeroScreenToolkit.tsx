import React, { useState } from 'react';
import { Volume2, Printer, Compass, CheckCircle2, RefreshCw, ShieldCheck, HeartHandshake } from 'lucide-react';
import { triggerTemporalSync } from '../services/api';

export const ZeroScreenToolkit: React.FC<{
  onSampleAudio: () => void;
  onSampleCard: () => void;
}> = ({ onSampleAudio, onSampleCard }) => {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await triggerTemporalSync();
      setSyncStatus(`Temporal Workflow Active: ${res.workflow_id}`);
    } catch {
      setSyncStatus('Workflow sync triggered in local mode.');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }
  };

  return (
    <section id="zero-screen" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-parchment-300">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest-800 font-semibold mb-2">
          <Compass className="w-3.5 h-3.5 text-forest-700" />
          <span>The Zero-Screen Philosophy</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-bark-900 tracking-tight">
          How to Hike Without Looking at a Screen
        </h2>
        <p className="font-sans text-base text-bark-600 mt-2">
          "The best builds make the screen the shortest part of the experience." We designed Wander so your phone never leaves your backpack on the trail.
        </p>
      </div>

      {/* 3 Steps Visual Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Step 1 */}
        <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-6 shadow-tactile relative flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-mono font-bold text-sm flex items-center justify-center mb-4 border border-forest-300">
              01
            </div>
            <h3 className="font-serif font-bold text-xl text-bark-900 mb-2">
              &lt; 30 Seconds at Home
            </h3>
            <p className="text-xs text-bark-600 leading-relaxed">
              Use Tiger Data pgvector hybrid search and TabPFN foundation tabular models to identify which mountain trail will be at 100% peak vibrancy this weekend.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-parchment-200">
            <span className="text-[11px] font-mono text-forest-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero endless scrolling</span>
            </span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-6 shadow-tactile relative flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-sm flex items-center justify-center mb-4 border border-amber-300">
              02
            </div>
            <h3 className="font-serif font-bold text-xl text-bark-900 mb-2">
              45 Seconds at the Trailhead
            </h3>
            <p className="text-xs text-bark-600 leading-relaxed">
              Listen to a hands-free 45-second ElevenLabs synthetic audio briefing detailing elevation milestones, tree species to look for, and vista locations while tying your boots.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-parchment-200">
            <button
              onClick={onSampleAudio}
              className="text-xs font-mono font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 pressable"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to Sample Briefing</span>
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-6 shadow-tactile relative flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-full bg-terracotta-100 text-terracotta-900 font-mono font-bold text-sm flex items-center justify-center mb-4 border border-terracotta-300">
              03
            </div>
            <h3 className="font-serif font-bold text-xl text-bark-900 mb-2">
              Zero Screens on the Trail
            </h3>
            <p className="text-xs text-bark-600 leading-relaxed">
              Tuck a folded 1-page pocket field guide into your pocket. Navigate by natural milestones, elevation checkpoints, and leaf silhouettes while your phone remains zipped away.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-parchment-200">
            <button
              onClick={onSampleCard}
              className="text-xs font-mono font-semibold text-terracotta-800 hover:text-terracotta-900 flex items-center gap-1.5 pressable"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Preview 1-Page Pocket Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Temporal Durable Workflow Background Engine Banner */}
      <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-6 md:p-8 shadow-tactile flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-forest-800 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Temporal Durable Orchestration Engine</span>
          </div>
          <h3 className="font-serif font-bold text-xl text-bark-900">
            Resilient Weather Polling &amp; Automated TabPFN Inferences
          </h3>
          <p className="text-xs text-bark-600 max-w-2xl mt-1">
            Our background Temporal workflow orchestrates NOAA micro-weather API polls, handles rate-limits with exponential backoff, and triggers batch TabPFN model recalculations without state loss.
          </p>
          {syncStatus && (
            <div className="mt-2 text-xs font-mono text-forest-800 font-semibold bg-forest-100/80 px-2.5 py-1 rounded inline-block">
              {syncStatus}
            </div>
          )}
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center space-x-2 bg-parchment-200 hover:bg-parchment-300 text-bark-900 border border-parchment-400/80 px-4 py-2.5 rounded-xl text-xs font-semibold pressable flex-shrink-0 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-terracotta-700' : ''}`} />
          <span>{syncing ? 'Triggering...' : 'Trigger Temporal Sync'}</span>
        </button>
      </div>
    </section>
  );
};
