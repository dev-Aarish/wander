import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { MapPin, Volume2, Printer, Sparkles, ArrowRight, ShieldCheck, Cpu, Trees } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onAudioDemoClick: () => void;
  onCardDemoClick: () => void;
  onTabPFNClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onAudioDemoClick,
  onCardDemoClick,
  onTabPFNClick,
}) => {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Landing animation sequence: subtle, responsive, under Emil Kowalski duration bar
      gsap.from(headlineRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.65,
        ease: 'power3.out',
      });

      gsap.from(statsRef.current?.children ? Array.from(statsRef.current.children) : [], {
        opacity: 0,
        y: 14,
        stagger: 0.06,
        duration: 0.45,
        delay: 0.15,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-bark-900 leading-[1.08] mb-6"
          >
            Predict the exact <span className="italic text-terracotta-700 underline decoration-amber-400/60 decoration-wavy decoration-2">72-hour peak</span> foliage window.
          </h1>

          <p className="font-sans text-lg sm:text-xl text-bark-700 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Powered by <strong>TabPFN</strong> tabular chlorophyll regression &amp; <strong>Tiger Data pgvector</strong>. Listen to a 45-second <strong>ElevenLabs</strong> trailhead briefing, grab a 1-page printable pocket guide, and put your phone away on the trail.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center space-x-2.5 bg-forest-800 hover:bg-forest-900 text-parchment-50 px-6 py-3.5 rounded-xl font-medium text-base shadow-tactile hover:shadow-tactile-hover pressable transition-all"
            >
              <Trees className="w-5 h-5 text-amber-300" />
              <span>Explore Foliage Trails</span>
              <ArrowRight className="w-4 h-4 text-parchment-300" />
            </button>

            <button
              onClick={onAudioDemoClick}
              className="inline-flex items-center space-x-2 bg-parchment-50 hover:bg-parchment-200/60 text-bark-900 border border-parchment-300 px-5 py-3.5 rounded-xl font-medium text-base shadow-sm pressable transition-all"
            >
              <Volume2 className="w-5 h-5 text-amber-600" />
              <span>Sample Trailhead Audio</span>
            </button>

            <button
              onClick={onCardDemoClick}
              className="inline-flex items-center space-x-2 bg-parchment-50 hover:bg-parchment-200/60 text-bark-900 border border-parchment-300 px-5 py-3.5 rounded-xl font-medium text-base shadow-sm pressable transition-all"
            >
              <Printer className="w-5 h-5 text-terracotta-600" />
              <span>Pocket Field Card</span>
            </button>
          </div>

          {/* Partners & Tech Telemetry Badges */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-parchment-50/80 backdrop-blur-sm border border-parchment-300/80 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase text-bark-500">Foundation ML</span>
                <Cpu className="w-4 h-4 text-amber-600" />
              </div>
              <p className="font-serif font-bold text-base text-bark-900">TabPFN v2</p>
              <p className="text-[11px] text-bark-600">Zero-shot chlorophyll decay regression</p>
            </div>

            <div className="bg-parchment-50/80 backdrop-blur-sm border border-parchment-300/80 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase text-bark-500">Vector Store</span>
                <MapPin className="w-4 h-4 text-forest-700" />
              </div>
              <p className="font-serif font-bold text-base text-bark-900">Tiger Data</p>
              <p className="text-[11px] text-bark-600">PostgreSQL + pgvector hybrid search</p>
            </div>

            <div className="bg-parchment-50/80 backdrop-blur-sm border border-parchment-300/80 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase text-bark-500">Durable Workflows</span>
                <ShieldCheck className="w-4 h-4 text-terracotta-700" />
              </div>
              <p className="font-serif font-bold text-base text-bark-900">Temporal</p>
              <p className="text-[11px] text-bark-600">Resilient NOAA weather sync cron</p>
            </div>

            <div className="bg-parchment-50/80 backdrop-blur-sm border border-parchment-300/80 rounded-xl p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase text-bark-500">Trailhead Briefing</span>
                <Volume2 className="w-4 h-4 text-amber-700" />
              </div>
              <p className="font-serif font-bold text-base text-bark-900">ElevenLabs</p>
              <p className="text-[11px] text-bark-600">45s zero-screen voice synthesis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
