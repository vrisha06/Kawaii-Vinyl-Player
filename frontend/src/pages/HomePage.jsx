import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { motion } from 'framer-motion';
import { Music, Play, LogIn, Disc } from 'lucide-react';
import WindowHeader from '../components/layout/WindowHeader';

const HomePage = ({ currentView, onViewChange }) => {
  const { playTrack, currentTrack, spotifyToken, spotifyTracks, loginWithSpotify } = useAudioPlayer();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-kawaii-cream border-4 border-kawaii-mauve shadow-pixel rounded-3xl relative overflow-hidden flex flex-col"
      >
        <WindowHeader
          title="SPOTIFY_LIBRARY.EXE"
          currentView={currentView}
          onViewChange={onViewChange}
        />

        <div className="p-8 flex-1 overflow-hidden min-h-[500px] flex flex-col">
          {!spotifyToken ? (
            <div className="flex flex-col items-center justify-center h-full space-y-8 pt-12">
              <div className="relative">
                <Disc size={120} className="text-kawaii-mauve animate-spin-slow opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music size={48} className="text-kawaii-accent" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className="font-pixel text-2xl text-kawaii-text">WELCOME TO YOUR ROOM</h2>
                <p className="font-mono-pixel text-lg text-kawaii-mauve/60">Login with Spotify to browse your top tracks!</p>
              </div>
              <button
                onClick={loginWithSpotify}
                className="pixel-button scale-125 gap-3"
              >
                <LogIn size={20} />
                <span className="font-tiny-pixel text-[10px]">CONNECT_SPOTIFY</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b-2 border-kawaii-mauve/10 pb-4">
                <h2 className="font-pixel text-xl text-kawaii-text">YOUR TOP TRACKS</h2>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => useAudioPlayer().fixSound()}
                      className="font-tiny-pixel text-[6px] bg-kawaii-mauve/10 hover:bg-kawaii-mauve/20 text-kawaii-mauve px-2 py-1 rounded border border-kawaii-mauve/20 transition-all"
                    >
                      FIX_AUDIO
                    </button>
                    <span className="font-tiny-pixel text-[8px] text-kawaii-accent">{spotifyTracks.length} TRACKS LOADED</span>
                  </div>
                  <span className="font-tiny-pixel text-[6px] text-kawaii-mauve/40 uppercase">{useAudioPlayer().status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                {spotifyTracks.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => playTrack(song)}
                    className={`group relative pixel-border p-4 cursor-pointer transition-all hover:translate-y-[-2px] ${currentTrack?.id === song.id ? 'bg-kawaii-accent/20 border-kawaii-accent' : 'bg-kawaii-cream'
                      }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-kawaii-mauve shrink-0">
                        <img src={song.cover} alt="" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <h3 className="font-mono-pixel text-lg text-kawaii-text truncate leading-tight">
                          {song.title}
                        </h3>
                        <p className="font-tiny-pixel text-[8px] text-kawaii-accent uppercase">
                          {song.artist}
                        </p>
                      </div>
                      {!song.audio && (
                        <div className="text-kawaii-mauve/30" title="No preview available">
                          <Music size={14} className="opacity-50" />
                        </div>
                      )}
                    </div>

                    {currentTrack?.id === song.id && (
                      <div className="absolute -top-2 -right-2 text-kawaii-accent animate-bounce">
                        <Music size={16} fill="currentColor" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
