import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudSnow, Clock, Sparkles, Thermometer, Info } from 'lucide-react';

interface StageInfo {
  stage: number;
  name: string;
  badge: string;
  windowTitle: string;
  description: string;
  biology: string;
  dominantColorHex: string;
  leafColorClass: string;
  chillHoursReq: string;
  sugarMapleStatus: string;
  quakingAspenStatus: string;
  redOakStatus: string;
}

const PHENOLOGY_STAGES: StageInfo[] = [
  {
    stage: 25,
    name: "Summer Chlorophyll Baseline",
    badge: "0% - 40% Transition",
    windowTitle: "Active Photosynthesis",
    description: "Leaves remain deep emerald green as abundant chlorophyll absorbs sunlight and masks all underlying accessory pigments.",
    biology: "Chlorophyll synthesis outpaces degradation. High solar irradiance and warm nighttime temperatures maintain active sugar synthesis.",
    dominantColorHex: "#2E6E56",
    leafColorClass: "from-forest-700 to-forest-500",
    chillHoursReq: "< 150 hrs below 7°C",
    sugarMapleStatus: "Solid emerald canopy",
    quakingAspenStatus: "Lush olive green",
    redOakStatus: "Deep dark green"
  },
  {
    stage: 65,
    name: "Early Turning & Carotenoid Flare",
    badge: "40% - 75% Transition",
    windowTitle: "Abscission Layer Forming",
    description: "Shorter daylight hours and nighttime cooling trigger corky cell development at the leaf stem, stopping chlorophyll production and unveiling warm carotenoids.",
    biology: "Carotenoids (xanthophylls and carotenes) that were hidden all summer emerge as golden birch ochres and sunny aspen yellows.",
    dominantColorHex: "#D4B832",
    leafColorClass: "from-ochre-500 to-amber-500",
    chillHoursReq: "200 - 320 hrs below 7°C",
    sugarMapleStatus: "Yellow margins with pale gold tips",
    quakingAspenStatus: "Canary gold canopy edges",
    redOakStatus: "Bronzing olive"
  },
  {
    stage: 95,
    name: "The 72-Hour Peak Vibrancy Window",
    badge: "75% - 105% Peak Vibrant",
    windowTitle: "TabPFN Target Horizon",
    description: "The magic 72-hour window when trapped sugars react under bright sunlight and cool crisp nights to synthesize brilliant anthocyanin pigments.",
    biology: "Anthocyanins produce brilliant scarlet, fiery cinnabar, and flame orange. The entire valley reflects incandescent color. This is the exact window TabPFN models predict.",
    dominantColorHex: "#C2410C",
    leafColorClass: "from-terracotta-600 via-amber-600 to-terracotta-700",
    chillHoursReq: "320 - 450 hrs below 7°C",
    sugarMapleStatus: "Fiery incandescent red & orange",
    quakingAspenStatus: "Shimmering canary gold",
    redOakStatus: "Deep rich burgundy crimson"
  },
  {
    stage: 115,
    name: "Past Peak & Russet Tannins",
    badge: "> 105% Forest Floor",
    windowTitle: "Nutrient Cycling",
    description: "Anthocyanins degrade, leaving durable brown tannins. Breezy autumn cold fronts send leaves drifting onto the trail to nourish the soil.",
    biology: "Complete leaf detachment. Sunlight penetrates directly to the forest floor, preparing the biome for winter dormancy.",
    dominantColorHex: "#78350F",
    leafColorClass: "from-amber-900 to-bark-800",
    chillHoursReq: "> 480 hrs below 7°C",
    sugarMapleStatus: "Fallen golden-orange carpet",
    quakingAspenStatus: "Bare chalk-white branches",
    redOakStatus: "Holding hardy russet leaves"
  }
];

export const FoliageProgressStory: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(2); // Default to 72h Peak
  const current = PHENOLOGY_STAGES[selectedIndex];

  return (
    <section id="journey" className="py-16 md:py-24 bg-parchment-200/50 border-y border-parchment-300/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-terracotta-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Phenology Science</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-bark-900 tracking-tight">
            The Biochemistry of the 72-Hour Peak
          </h2>
          <p className="font-sans text-base sm:text-lg text-bark-600 mt-2">
            Why do forests burst into color in mere days? Wander tracks the biochemical decay of chlorophyll across elevation gradients to calculate peak vibrancy.
          </p>
        </div>

        {/* Interactive Scrubber Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
          {PHENOLOGY_STAGES.map((stage, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={stage.name}
                onClick={() => setSelectedIndex(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-200 pressable ${
                  isSelected
                    ? 'bg-parchment-50 border-bark-900 shadow-sm ring-1 ring-bark-900'
                    : 'bg-parchment-100/80 border-parchment-300 hover:bg-parchment-50 text-bark-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-bark-500 font-medium">{stage.badge}</span>
                  <span
                    className="w-3 h-3 rounded-full border border-parchment-300"
                    style={{ backgroundColor: stage.dominantColorHex }}
                  />
                </div>
                <div className="font-serif font-bold text-sm text-bark-900 truncate">{stage.name}</div>
                <div className="text-[11px] text-bark-600 truncate">{stage.windowTitle}</div>
              </button>
            );
          })}
        </div>

        {/* Stage Deep Dive Display Card */}
        <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-6 md:p-8 shadow-tactile relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Leaf & Color Progression Display */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-parchment-100/70 rounded-xl border border-parchment-300/80 text-center">
              <motion.div
                key={current.name}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="relative mb-6"
              >
                {/* Simulated Sugar Maple Leaf */}
                <div
                  className={`w-36 h-36 rounded-full shadow-inner flex items-center justify-center bg-gradient-to-br ${current.leafColorClass} transition-colors duration-500 p-4`}
                >
                  <svg viewBox="0 0 100 100" className="w-24 h-24 text-parchment-100 fill-current opacity-90 drop-shadow">
                    <path d="M50 8 C52 24 64 26 68 22 C72 28 85 30 84 38 C75 42 76 54 86 64 C76 68 70 66 65 74 C60 68 56 66 52 72 L50 92 L48 72 C44 66 40 68 35 74 C30 66 24 68 14 64 C24 54 25 42 16 38 C15 30 28 28 32 22 C36 26 48 24 50 8 Z" />
                  </svg>
                </div>
              </motion.div>

              <div className="font-mono text-xs text-bark-500 uppercase tracking-widest mb-1">
                Progression Gauge: {current.stage}%
              </div>
              <h3 className="font-serif font-bold text-xl text-bark-900">{current.name}</h3>

              <div className="w-full bg-parchment-200 h-2.5 rounded-full mt-4 overflow-hidden border border-parchment-300">
                <motion.div
                  className="h-full bg-gradient-to-r from-forest-600 via-amber-500 to-terracotta-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, current.stage)}%` }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
            </div>

            {/* Science & Species Telemetry Breakdown */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-block bg-terracotta-100 text-terracotta-900 border border-terracotta-300 text-[11px] font-mono px-2 py-0.5 rounded font-medium mb-2">
                  {current.windowTitle}
                </span>
                <p className="text-base text-bark-800 leading-relaxed font-sans">{current.description}</p>
                <p className="text-sm text-bark-600 leading-relaxed mt-2 italic font-serif">
                  <strong>Biochemical trigger:</strong> {current.biology}
                </p>
              </div>

              {/* Environmental Sensor Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-parchment-100 p-3 rounded-lg border border-parchment-300/80">
                  <div className="flex items-center space-x-2 text-xs font-mono text-bark-600 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-terracotta-700" />
                    <span>Cumulative Chill Hours</span>
                  </div>
                  <p className="font-mono font-semibold text-bark-900 text-sm">{current.chillHoursReq}</p>
                </div>

                <div className="bg-parchment-100 p-3 rounded-lg border border-parchment-300/80">
                  <div className="flex items-center space-x-2 text-xs font-mono text-bark-600 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Peak Stability</span>
                  </div>
                  <p className="font-mono font-semibold text-bark-900 text-sm">72 Hours Window Max</p>
                </div>
              </div>

              {/* Species Canopy Behavior */}
              <div className="border-t border-parchment-300/80 pt-4">
                <div className="text-xs font-mono uppercase text-bark-500 mb-2">Dominant Forest Biome Response:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-parchment-100 p-2 rounded border border-parchment-300">
                    <strong className="block text-bark-900 mb-0.5">Sugar Maple</strong>
                    <span className="text-bark-700">{current.sugarMapleStatus}</span>
                  </div>
                  <div className="bg-parchment-100 p-2 rounded border border-parchment-300">
                    <strong className="block text-bark-900 mb-0.5">Quaking Aspen</strong>
                    <span className="text-bark-700">{current.quakingAspenStatus}</span>
                  </div>
                  <div className="bg-parchment-100 p-2 rounded border border-parchment-300">
                    <strong className="block text-bark-900 mb-0.5">Red Oak</strong>
                    <span className="text-bark-700">{current.redOakStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
