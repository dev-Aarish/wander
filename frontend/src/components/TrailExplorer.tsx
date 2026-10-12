import React, { useState, useEffect } from 'react';
import { Trail } from '../types';
import { TrailCard } from './TrailCard';
import { Search, Sparkles, Filter, SlidersHorizontal, RefreshCw, Trees } from 'lucide-react';
import { hybridSearch, fetchTrails } from '../services/api';

interface TrailExplorerProps {
  onSelectTrail: (trail: Trail) => void;
  onPlayAudio: (trail: Trail) => void;
  onGenerateCard: (trail: Trail) => void;
}

export const TrailExplorer: React.FC<TrailExplorerProps> = ({
  onSelectTrail,
  onPlayAudio,
  onGenerateCard,
}) => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [peakOnly, setPeakOnly] = useState(false);
  const [searchMode, setSearchMode] = useState<string>('pgvector_hybrid');

  const loadInitialTrails = async () => {
    setLoading(true);
    try {
      const data = await fetchTrails();
      setTrails(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialTrails();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (searchQuery.trim().length > 0) {
        const result = await hybridSearch(searchQuery, selectedDifficulty);
        setTrails(result.trails);
        setSearchMode(result.search_mode);
      } else {
        const data = await fetchTrails({
          difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        });
        setTrails(data);
        setSearchMode('pgvector_hybrid');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTrails = trails.filter(trail => {
    if (selectedDifficulty !== 'All' && trail.difficulty !== selectedDifficulty) return false;
    if (peakOnly && !(trail.foliage_stage_pct && trail.foliage_stage_pct >= 85 && trail.foliage_stage_pct <= 105)) return false;
    return true;
  });

  const sampleQueries = [
    "golden aspen lake reflections",
    "fiery sugar maple alpine ridge",
    "crimson oak sunset vistas",
    "old growth maple lake of the clouds"
  ];

  return (
    <section id="trails" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-forest-800 mb-2 font-semibold">
            <Trees className="w-3.5 h-3.5 text-forest-700" />
            <span>Tiger Data Vector Exploration</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-bark-900 tracking-tight">
            Foliage Trail Directory &amp; 72h Windows
          </h2>
          <p className="font-sans text-sm sm:text-base text-bark-600 mt-1 max-w-xl">
            Hybrid semantic natural language search powered by PostgreSQL + <span className="font-mono text-xs bg-parchment-200 px-1 py-0.5 rounded text-bark-800">pgvector</span>.
          </p>
        </div>

        {/* Mode telemetry badge */}
        <div className="flex items-center space-x-2 text-xs font-mono bg-parchment-50 border border-parchment-300 px-3 py-1.5 rounded-lg text-bark-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
          <span>Live Database: <strong>Tiger Data</strong> (cutie-pie • us-east-1)</span>
        </div>
      </div>

      {/* Natural Language Search Bar */}
      <div className="bg-parchment-50 rounded-2xl border border-parchment-300/90 p-4 sm:p-5 shadow-tactile mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-bark-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything: e.g. 'golden aspen groves near mountain lakes' or 'fiery red maple ridge walk'..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-parchment-100/90 border border-parchment-300 text-bark-900 placeholder:text-bark-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800/40 focus:bg-parchment-50 transition-all"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center space-x-2 bg-forest-800 hover:bg-forest-900 text-parchment-50 px-6 py-3 rounded-xl text-sm font-medium shadow-tactile pressable transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Search Biomes</span>
          </button>
        </form>

        {/* Semantic Query Suggestions */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-parchment-200 text-xs">
          <span className="font-mono text-bark-500 text-[11px] uppercase">Try:</span>
          {sampleQueries.map((q) => (
            <button
              key={q}
              onClick={() => {
                setSearchQuery(q);
                hybridSearch(q, selectedDifficulty).then(res => setTrails(res.trails));
              }}
              className="bg-parchment-100 hover:bg-parchment-200/80 text-bark-700 border border-parchment-300/80 px-2.5 py-1 rounded-md transition-colors pressable"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Difficulty Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-bark-500 uppercase mr-1">Difficulty:</span>
          {['All', 'Easy', 'Moderate', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors pressable ${
                selectedDifficulty === diff
                  ? 'bg-forest-800 text-parchment-50 border-forest-900 font-semibold'
                  : 'bg-parchment-50 text-bark-700 border-parchment-300 hover:bg-parchment-200/60'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Peak Vibrancy Toggle */}
        <button
          onClick={() => setPeakOnly(!peakOnly)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors pressable ${
            peakOnly
              ? 'bg-terracotta-700 text-parchment-50 border-terracotta-800 font-semibold'
              : 'bg-parchment-50 text-bark-700 border-parchment-300 hover:bg-parchment-200/60'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${peakOnly ? 'bg-amber-300' : 'bg-terracotta-600'}`} />
          <span>72h Peak Vibrant Only</span>
        </button>
      </div>

      {/* Trail Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-parchment-50 rounded-2xl border border-parchment-300 p-6 animate-pulse h-96">
              <div className="h-4 bg-parchment-200 rounded w-1/3 mb-4" />
              <div className="h-6 bg-parchment-200 rounded w-3/4 mb-4" />
              <div className="h-16 bg-parchment-200 rounded mb-4" />
              <div className="h-24 bg-parchment-200 rounded mb-4" />
            </div>
          ))}
        </div>
      ) : filteredTrails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onSelectTrail={onSelectTrail}
              onPlayAudio={onPlayAudio}
              onGenerateCard={onGenerateCard}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-parchment-50 rounded-2xl border border-parchment-300/80 p-8">
          <p className="font-serif text-xl font-bold text-bark-900 mb-2">No trails matched your filter criteria.</p>
          <p className="text-sm text-bark-600 mb-4">Try clearing the natural language search or resetting the difficulty filter.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
              setPeakOnly(false);
              loadInitialTrails();
            }}
            className="inline-flex items-center space-x-2 bg-parchment-200 hover:bg-parchment-300 text-bark-900 px-4 py-2 rounded-lg text-sm font-medium pressable"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};
