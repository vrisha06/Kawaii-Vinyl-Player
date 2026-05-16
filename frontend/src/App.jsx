import React, { useState } from 'react';
import { AudioPlayerProvider, useAudioPlayer } from './context/AudioPlayerContext';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import { Library, Disc, Music, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppContent = () => {
  const [view, setView] = useState('player');
  const { status } = useAudioPlayer();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-20 scale-100"
        style={{
          backgroundImage: `url('/bg2.png')`,
          filter: 'brightness(0.6)'
        }}
      />

      {/* CRT Overlay effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 2px, 3px 100%'
      }} />

      {/* Connection Heart Indicator */}
      <div className="fixed top-6 left-6 z-[60] flex items-center gap-3">
        <motion.div
          animate={status.includes('PREMIUM') || status.startsWith('PLAYING') ?
            { scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.3 }
          }
          transition={{ duration: 2, repeat: Infinity }}
          className={`${status.includes('PREMIUM') ? 'text-kawaii-accent' : status.startsWith('ERROR') ? 'text-red-400' : 'text-kawaii-mauve'}`}
        >
          <Music size={24} fill="currentColor" />
        </motion.div>
        <span className="font-tiny-pixel text-[8px] text-white/40 tracking-widest uppercase">
          {status.includes('PREMIUM') ? 'PREMIUM_CONNECTED' : 'CONNECTING...'}
        </span>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <HomePage currentView={view} onViewChange={setView} />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <PlayerPage currentView={view} onViewChange={setView} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AudioPlayerProvider>
      <AppContent />
    </AudioPlayerProvider>
  );
}

export default App;
