import React, { useEffect } from 'react';

import VinylRecord from '../components/player/VinylRecord';
import Needle from '../components/player/Needle';
import PlaybackControls from '../components/player/PlaybackControls';
import WindowHeader from '../components/layout/WindowHeader';

import RecentShelf from '../components/shelf/RecentShelf';
import SearchModal from '../components/search/SearchModal';

import { useAudioPlayer } from '../context/AudioPlayerContext';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import usePlayerStore from '../store/usePlayerStore';

const PlayerPage = ({ currentView, onViewChange }) => {
  const { isPlaying, currentTrack } = useAudioPlayer();

  const addRecentTrack = usePlayerStore(
    (state) => state.addRecentTrack
  );

  useEffect(() => {
    if (!currentTrack) return;

    addRecentTrack({
      id: currentTrack.id || currentTrack.title,
      title: currentTrack.title,
      artist: currentTrack.artist,
      image: currentTrack.cover,
      uri: currentTrack.uri,
    });
  }, [currentTrack]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/bg2.png')",
      }}
    >
      {/* Recently Played Shelf */}
      <RecentShelf />

      {/* Window Wrapper */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-[340px] bg-kawaii-cream border-4 border-kawaii-mauve shadow-pixel rounded-3xl relative overflow-visible mt-2 z-20"
      >
        <WindowHeader
          title={`NOW_PLAYING: ${currentTrack?.title || '???'}`}
          currentView={currentView}
          onViewChange={onViewChange}
        />

        {/* Corner Hearts */}
        <div className="absolute top-14 left-4 text-rose-300 z-50">
          <Heart size={16} fill="currentColor" />
        </div>

        <div className="absolute top-14 right-4 text-rose-300 z-50">
          <Heart size={16} fill="currentColor" />
        </div>

        <div className="absolute bottom-4 left-4 text-rose-300 z-50">
          <Heart size={16} fill="currentColor" />
        </div>

        <div className="absolute bottom-4 right-4 text-rose-300 z-50">
          <Heart size={16} fill="currentColor" />
        </div>

        <div className="p-3 space-y-3">
          {/* Vinyl Section */}
          <div className="relative border-4 border-kawaii-mauve rounded-2xl bg-[#EBC0CF]/30 overflow-visible p-4 min-h-[240px] flex items-center justify-center">
            
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#5a3946 2px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Needle */}
            <Needle isPlaying={isPlaying} />

            {/* Vinyl */}
            <VinylRecord
              isPlaying={isPlaying}
              cover={currentTrack?.cover}
            />
          </div>

          {/* Controls */}
          <PlaybackControls />
        </div>

        {/* Bottom Ribbon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-rose-300 z-50">
          <Heart
            size={40}
            fill="currentColor"
            stroke="#5A3946"
            strokeWidth={2}
          />
        </div>
      </motion.div>

      {/* Search Modal */}
      <SearchModal />
    </div>
  );
};

export default PlayerPage;