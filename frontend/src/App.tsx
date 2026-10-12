import React, { useState } from 'react';
import { AmbientCanvas } from './components/AmbientCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FoliageProgressStory } from './components/FoliageProgressStory';
import { TrailExplorer } from './components/TrailExplorer';
import { TabPFNSimulator } from './components/TabPFNSimulator';
import { ZeroScreenToolkit } from './components/ZeroScreenToolkit';
import { Footer } from './components/Footer';
import { AudioBriefingModal } from './components/AudioBriefingModal';
import { PocketCardModal } from './components/PocketCardModal';
import { TrailDetailModal } from './components/TrailDetailModal';
import { Trail } from './types';
import { INITIAL_TRAILS } from './services/mockData';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [audioTrail, setAudioTrail] = useState<Trail | null>(null);
  const [cardTrail, setCardTrail] = useState<Trail | null>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-parchment-100 text-bark-900 font-sans relative selection:bg-amber-200 selection:text-bark-950">
      {/* Liquid / Organic Autumn Wind & Leaves Canvas */}
      <AmbientCanvas />

      {/* Navigation */}
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero
          onExploreClick={() => scrollToSection('trails')}
          onAudioDemoClick={() => setAudioTrail(INITIAL_TRAILS[0])}
          onCardDemoClick={() => setCardTrail(INITIAL_TRAILS[1])}
          onTabPFNClick={() => scrollToSection('tabpfn')}
        />

        <FoliageProgressStory />

        <TrailExplorer
          onSelectTrail={(t) => setSelectedTrail(t)}
          onPlayAudio={(t) => setAudioTrail(t)}
          onGenerateCard={(t) => setCardTrail(t)}
        />

        <TabPFNSimulator />

        <ZeroScreenToolkit
          onSampleAudio={() => setAudioTrail(INITIAL_TRAILS[0])}
          onSampleCard={() => setCardTrail(INITIAL_TRAILS[1])}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <AudioBriefingModal
        trail={audioTrail}
        onClose={() => setAudioTrail(null)}
      />

      <PocketCardModal
        trail={cardTrail}
        onClose={() => setCardTrail(null)}
      />

      <TrailDetailModal
        trail={selectedTrail}
        onClose={() => setSelectedTrail(null)}
        onPlayAudio={(t) => {
          setSelectedTrail(null);
          setAudioTrail(t);
        }}
        onGenerateCard={(t) => {
          setSelectedTrail(null);
          setCardTrail(t);
        }}
      />
    </div>
  );
}

export default App;
