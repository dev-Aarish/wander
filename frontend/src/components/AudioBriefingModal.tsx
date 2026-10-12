import React, { useState, useEffect, useRef } from 'react';
import { Trail, AudioBriefingResponse } from '../types';
import { fetchAudioBriefing } from '../services/api';
import { Volume2, Play, Pause, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface AudioBriefingModalProps {
  trail: Trail | null;
  onClose: () => void;
}

export const AudioBriefingModal: React.FC<AudioBriefingModalProps> = ({ trail, onClose }) => {
  const [hikerName, setHikerName] = useState('Adventurer');
  const [briefing, setBriefing] = useState<AudioBriefingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trail) return;
    setLoading(true);
    setIsPlaying(false);
    setProgress(0);

    fetchAudioBriefing(trail.id, hikerName)
      .then((res) => {
        setBriefing(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      stopPlayback();
    };
  }, [trail, hikerName]);

  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const handleTogglePlay = () => {
    if (!briefing) return;

    if (isPlaying) {
      stopPlayback();
    } else {
      setIsPlaying(true);

      // Check if we have audio_base64 from ElevenLabs
      if (briefing.audio_base64) {
        try {
          const audio = new Audio(`data:${briefing.audio_mime_type};base64,${briefing.audio_base64}`);
          audioRef.current = audio;
          audio.play().catch(() => {
            // Fallback to Web Speech API
            playWithSpeechSynthesis(briefing.transcript);
          });
          audio.onended = () => {
            setIsPlaying(false);
            setProgress(100);
          };
        } catch {
          playWithSpeechSynthesis(briefing.transcript);
        }
      } else {
        playWithSpeechSynthesis(briefing.transcript);
      }

      // Smooth progress bar simulation
      const startTime = Date.now();
      const totalDurationMs = (briefing.duration_seconds || 45) * 1000;
      progressTimerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(100, (elapsed / totalDurationMs) * 100);
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          stopPlayback();
        }
      }, 250);
    }
  };

  const playWithSpeechSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.95;
      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
      };
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!trail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bark-950/60 backdrop-blur-sm">
      <div className="bg-parchment-50 rounded-2xl border border-parchment-300 shadow-2xl max-w-xl w-full p-6 md:p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            stopPlayback();
            onClose();
          }}
          className="absolute top-5 right-5 text-bark-400 hover:text-bark-900 p-1.5 rounded-lg hover:bg-parchment-200/60 transition-colors pressable"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 text-xs font-mono uppercase tracking-wider text-amber-800 mb-2">
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>ElevenLabs Trailhead Audio Briefing</span>
        </div>

        <h3 className="font-serif font-bold text-2xl text-bark-900 leading-tight mb-1">
          {trail.name}
        </h3>
        <p className="text-xs text-bark-600 font-sans mb-6">
          Zero-Screen Philosophy: Listen at the trailhead, tuck your phone away into your pack, and touch grass.
        </p>

        {/* Name personalization input */}
        <div className="flex items-center space-x-3 mb-6 bg-parchment-100 p-3 rounded-xl border border-parchment-300/80">
          <label htmlFor="hiker-name" className="text-xs font-mono text-bark-600 flex-shrink-0">
            Hiker Name:
          </label>
          <input
            id="hiker-name"
            type="text"
            value={hikerName}
            onChange={(e) => setHikerName(e.target.value)}
            placeholder="Your name"
            className="flex-1 bg-parchment-50 border border-parchment-300 rounded-lg px-2.5 py-1 text-xs text-bark-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>

        {/* Animated Waveform Visualizer & Audio Player */}
        <div className="bg-bark-900 text-parchment-100 rounded-xl p-5 mb-6 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-ping' : 'bg-parchment-400'}`} />
              {isPlaying ? 'Broadcasting 45s Briefing' : 'Trailhead Audio Ready'}
            </span>
            <span className="text-[11px] font-mono text-parchment-400">
              {briefing?.duration_seconds || 45}s Duration
            </span>
          </div>

          {/* Simulated Waveform Bars */}
          <div className="h-12 flex items-center justify-between gap-1 mb-5">
            {Array.from({ length: 28 }).map((_, i) => {
              const height = isPlaying
                ? 20 + Math.sin(i * 0.5 + progress * 0.1) * 15 + Math.random() * 20
                : 10 + (i % 3) * 6;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-amber-400' : 'bg-parchment-700'
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-parchment-800 h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-amber-400 h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Play / Pause Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleTogglePlay}
              disabled={loading}
              className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-bark-950 flex items-center justify-center shadow-lg transition-transform pressable"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            <button
              onClick={stopPlayback}
              title="Reset audio"
              className="p-2 text-parchment-400 hover:text-parchment-100 transition-colors pressable"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="bg-parchment-100/90 rounded-xl p-4 border border-parchment-300/80 mb-6 max-h-36 overflow-y-auto">
          <span className="block text-[10px] font-mono uppercase text-bark-500 mb-1">Trailhead Transcript:</span>
          <p className="font-serif text-xs leading-relaxed text-bark-800 italic">
            "{briefing?.transcript || 'Loading briefing transcript...'}"
          </p>
        </div>

        {/* Sign-off badge */}
        <div className="flex items-center justify-between text-xs text-bark-600 font-mono pt-2 border-t border-parchment-200">
          <span>Engine: ElevenLabs Turbo v2.5</span>
          <span className="text-terracotta-700 font-semibold">Touch Grass Certified 🥾</span>
        </div>
      </div>
    </div>
  );
};
