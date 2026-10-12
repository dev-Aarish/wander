import React from 'react';
import { Compass, Sparkles, Printer, Volume2, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-parchment-100/90 border-b border-parchment-300/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center space-x-3 cursor-pointer group pressable"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-parchment-100 flex items-center justify-center shadow-md group-hover:bg-forest-700 transition-colors">
            <Compass className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-xl tracking-tight text-bark-900">Wander</span>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300/60 font-medium">
                TabPFN 72h
              </span>
            </div>
            <p className="text-[11px] text-bark-500 font-sans tracking-tight">Open Phenology & Zero-Screen Companion</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onNavigate('trails')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors pressable ${
              activeSection === 'trails'
                ? 'bg-parchment-300 text-bark-900 font-semibold'
                : 'text-bark-600 hover:text-bark-900 hover:bg-parchment-200/70'
            }`}
          >
            Foliage Forecaster
          </button>
          <button
            onClick={() => onNavigate('journey')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors pressable ${
              activeSection === 'journey'
                ? 'bg-parchment-300 text-bark-900 font-semibold'
                : 'text-bark-600 hover:text-bark-900 hover:bg-parchment-200/70'
            }`}
          >
            Phenology Science
          </button>
          <button
            onClick={() => onNavigate('tabpfn')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors pressable ${
              activeSection === 'tabpfn'
                ? 'bg-parchment-300 text-bark-900 font-semibold'
                : 'text-bark-600 hover:text-bark-900 hover:bg-parchment-200/70'
            }`}
          >
            TabPFN Simulator
          </button>
          <button
            onClick={() => onNavigate('zero-screen')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors pressable ${
              activeSection === 'zero-screen'
                ? 'bg-parchment-300 text-bark-900 font-semibold'
                : 'text-bark-600 hover:text-bark-900 hover:bg-parchment-200/70'
            }`}
          >
            Zero-Screen Toolkit
          </button>
        </nav>

        {/* CTA */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('trails')}
            className="flex items-center space-x-2 bg-forest-800 hover:bg-forest-900 text-parchment-50 px-4 py-2 rounded-xl text-sm font-medium shadow-tactile pressable"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Find 72h Peak</span>
          </button>
        </div>
      </div>
    </header>
  );
};
