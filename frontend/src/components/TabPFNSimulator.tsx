import React, { useState, useEffect } from 'react';
import { simulateTabPFN, fetchPhenologyTimeline } from '../services/api';
import { TabPFNPredictionResponse, PhenologyTimelinePoint } from '../types';
import { Cpu, Sliders, Sparkles, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export const TabPFNSimulator: React.FC = () => {
  const [elevation, setElevation] = useState(1800);
  const [chillHours, setChillHours] = useState(340);
  const [solarRad, setSolarRad] = useState(11.5);
  const [droughtIndex, setDroughtIndex] = useState(0.18);
  const [maplePct, setMaplePct] = useState(45);
  const [aspenPct, setAspenPct] = useState(35);
  const [oakPct, setOakPct] = useState(20);

  const [prediction, setPrediction] = useState<TabPFNPredictionResponse | null>(null);
  const [timeline, setTimeline] = useState<PhenologyTimelinePoint[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Recalculate TabPFN prediction
  useEffect(() => {
    let isCancelled = false;
    setIsCalculating(true);

    const timer = setTimeout(async () => {
      try {
        const res = await simulateTabPFN({
          elevation_m: elevation,
          latitude: 44.1,
          chill_hours: chillHours,
          solar_radiation: solarRad,
          drought_stress: droughtIndex,
          sugar_maple_pct: maplePct,
          quaking_aspen_pct: aspenPct,
          red_oak_pct: oakPct,
        });

        if (!isCancelled) {
          setPrediction(res);
          const tData = await fetchPhenologyTimeline('simulated');
          setTimeline(tData);
          setIsCalculating(false);
        }
      } catch (e) {
        if (!isCancelled) setIsCalculating(false);
      }
    }, 150); // Snappy debounce

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [elevation, chillHours, solarRad, droughtIndex, maplePct, aspenPct, oakPct]);

  return (
    <section id="tabpfn" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-parchment-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Model Explanation & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-amber-800 font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5 text-amber-700" />
              <span>Prior Labs Foundation Model</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-bark-900 tracking-tight">
              TabPFN In-Silico Phenology Sandbox
            </h2>
            <p className="font-sans text-sm text-bark-600 mt-2 leading-relaxed">
              Prior Labs' <strong>TabPFN</strong> ingests tabular weather physics and elevation features in under 15ms. Adjust environmental conditions below to observe zero-shot chlorophyll decay regression.
            </p>
          </div>

          {/* Interactive Sliders Panel */}
          <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-5 sm:p-6 shadow-tactile space-y-5">
            {/* Elevation Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-bark-700 font-medium">Elevation Gradient</span>
                <span className="font-bold text-forest-800">{elevation} m (~{Math.round(elevation * 3.28)} ft)</span>
              </div>
              <input
                type="range"
                min="400"
                max="3400"
                step="50"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full accent-forest-700 cursor-pointer h-1.5 bg-parchment-200 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-bark-500 font-mono">Higher elevation = cooler nights & earlier peak</span>
            </div>

            {/* Chill Hours Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-bark-700 font-medium">Chill Hours (0°C to 7°C)</span>
                <span className="font-bold text-amber-800">{chillHours} hrs</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={chillHours}
                onChange={(e) => setChillHours(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-parchment-200 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-bark-500 font-mono">Biochemical trigger for abscission layer corking</span>
            </div>

            {/* Solar Radiation */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-bark-700 font-medium">Solar Irradiance</span>
                <span className="font-bold text-terracotta-800">{solarRad} MJ/m²</span>
              </div>
              <input
                type="range"
                min="8.0"
                max="16.0"
                step="0.2"
                value={solarRad}
                onChange={(e) => setSolarRad(Number(e.target.value))}
                className="w-full accent-terracotta-600 cursor-pointer h-1.5 bg-parchment-200 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-bark-500 font-mono">Photoperiod shortening dictates anthocyanin synthesis</span>
            </div>

            {/* Drought Stress */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-bark-700 font-medium">30-Day Drought Deficit Index</span>
                <span className="font-bold text-bark-900">{droughtIndex.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.45"
                step="0.01"
                value={droughtIndex}
                onChange={(e) => setDroughtIndex(Number(e.target.value))}
                className="w-full accent-bark-700 cursor-pointer h-1.5 bg-parchment-200 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-bark-500 font-mono">Moderate drought accelerates color; extreme causes brown drop</span>
            </div>

            {/* Canopy Composition */}
            <div className="pt-2 border-t border-parchment-200">
              <span className="block text-xs font-mono font-medium text-bark-700 mb-2">Canopy Species Weighting:</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-parchment-100 p-2 rounded-lg border border-parchment-300">
                  <span className="block text-[10px] text-terracotta-800 font-bold">Sugar Maple</span>
                  <span className="font-mono">{maplePct}%</span>
                </div>
                <div className="bg-parchment-100 p-2 rounded-lg border border-parchment-300">
                  <span className="block text-[10px] text-ochre-700 font-bold">Quaking Aspen</span>
                  <span className="font-mono">{aspenPct}%</span>
                </div>
                <div className="bg-parchment-100 p-2 rounded-lg border border-parchment-300">
                  <span className="block text-[10px] text-bark-700 font-bold">Red Oak</span>
                  <span className="font-mono">{oakPct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: TabPFN Real-time Forecast Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-6 md:p-8 shadow-tactile relative overflow-hidden">
            {/* Model Status Header */}
            <div className="flex items-center justify-between pb-4 border-b border-parchment-200 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-forest-600 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-bark-700 font-semibold">
                  Zero-Shot Tabular Inference
                </span>
              </div>
              <span className="text-xs font-mono text-bark-500">
                Latency: <span className="font-bold text-forest-700">12ms</span>
              </span>
            </div>

            {/* Big Prediction Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-parchment-100/90 p-4 rounded-xl border border-parchment-300/80">
                <span className="text-xs font-mono text-bark-500 uppercase block mb-1">Foliage Stage</span>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-bark-900">
                  {prediction ? `${prediction.foliage_stage_pct}%` : '---'}
                </span>
                <span className="text-[11px] text-bark-600 block mt-1">100% = Peak Vibrant</span>
              </div>

              <div className="bg-parchment-100/90 p-4 rounded-xl border border-parchment-300/80">
                <span className="text-xs font-mono text-bark-500 uppercase block mb-1">Peak Status</span>
                <span className="font-serif font-bold text-xl sm:text-2xl text-terracotta-700 block mt-1">
                  {prediction ? prediction.peak_status : 'Calculating...'}
                </span>
                <span className="text-[11px] text-bark-600 block mt-1">72-Hour Horizon</span>
              </div>

              <div className="bg-parchment-100/90 p-4 rounded-xl border border-parchment-300/80">
                <span className="text-xs font-mono text-bark-500 uppercase block mb-1">Countdown</span>
                <span className="font-serif font-bold text-3xl sm:text-4xl text-forest-800">
                  {prediction ? (prediction.days_to_peak === 0 ? 'Peak Now' : `${prediction.days_to_peak} Days`) : '---'}
                </span>
                <span className="text-[11px] text-bark-600 block mt-1">Estimated optimal window</span>
              </div>
            </div>

            {/* TabPFN Color Transition Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-bark-600">Predicted Progression Meter</span>
                <span className="font-bold text-bark-900">{prediction?.foliage_stage_pct}%</span>
              </div>
              <div className="w-full bg-parchment-200 h-3 rounded-full overflow-hidden border border-parchment-300 relative">
                <div
                  className="h-full bg-gradient-to-r from-forest-600 via-amber-500 to-terracotta-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, prediction?.foliage_stage_pct ?? 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-bark-500 mt-1.5">
                <span>0% Summer Green</span>
                <span>50% Turning</span>
                <span className="font-bold text-terracotta-700">100% 72h Peak Vibrant</span>
                <span>&gt;105% Past Peak</span>
              </div>
            </div>

            {/* 21-Day Chlorophyll Decay Timeline Curve */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-bark-700 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-terracotta-700" />
                  <span>21-Day Simulated Progression Curve</span>
                </span>
                <span className="text-[11px] font-mono text-bark-500">Day -10 to Day +10</span>
              </div>

              <div className="bg-parchment-100 p-4 rounded-xl border border-parchment-300/80">
                <div className="h-32 flex items-end justify-between gap-1 sm:gap-1.5 pt-4">
                  {timeline.map((pt, idx) => {
                    const isPeakBar = pt.is_peak;
                    const heightPct = Math.min(100, Math.max(15, (pt.stage_pct / 120) * 100));

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            isPeakBar
                              ? 'bg-terracotta-600 ring-2 ring-terracotta-700/60'
                              : pt.days_from_today === 0
                              ? 'bg-amber-600'
                              : 'bg-parchment-300 group-hover:bg-parchment-400'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-10 bg-bark-900 text-parchment-100 text-[10px] font-mono px-2 py-1 rounded shadow whitespace-nowrap z-20 transition-opacity">
                          {pt.date}: {pt.stage_pct}% ({pt.status})
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-bark-500 mt-2 border-t border-parchment-200 pt-1.5">
                  <span>-10 Days</span>
                  <span className="font-bold text-amber-800">Today</span>
                  <span className="font-bold text-terracotta-700">72h Peak Window</span>
                  <span>+10 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
