import React from 'react';

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Star,
} from 'lucide-react';

import { motion } from 'framer-motion';

import { useAudioPlayer } from '../../context/AudioPlayerContext';

const PlaybackControls = () => {

  const {
    isPlaying,
    togglePlay,
    progress,
    seek,
    currentTrack,
    duration,
  } = useAudioPlayer();

  const formatTime = (
    seconds
  ) => {

    if (!seconds) return '0:00';

    const mins =
      Math.floor(seconds / 60);

    const secs =
      Math.floor(seconds % 60);

    return `${mins}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 w-full p-2">

      {/* SONG INFO */}
      <div className="flex gap-6 items-start">

        {/* COVER */}
        <motion.div
          whileHover={{
            scale: 1.03,
          }}

          className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-kawaii-mauve shadow-pixel shrink-0"
        >
          <img
            src={currentTrack?.cover}
            alt="album"

            className="w-full h-full object-cover"

            style={{
              imageRendering:
                'pixelated',
            }}
          />
        </motion.div>

        {/* TRACK INFO */}
        <div className="overflow-hidden">

          <p className="font-mono-pixel text-[12px] text-kawaii-mauve/60 mb-1">
            now playing...
          </p>

          <h2 className="font-pixel text-2xl text-kawaii-text leading-tight mb-1">
            {currentTrack?.title ||
              'SELECT_TRACK'}
          </h2>

          <p className="font-mono-pixel text-lg text-kawaii-accent uppercase">
            by{' '}
            {currentTrack?.artist ||
              'Unknown'}
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-center gap-4">

        {/* PREVIOUS */}
        <motion.button
          whileTap={{
            scale: 0.95,
          }}

          className="w-20 h-16 bg-kawaii-cream border-4 border-kawaii-mauve rounded-2xl shadow-pixel flex items-center justify-center text-kawaii-mauve hover:bg-kawaii-pink transition-colors"
        >
          <SkipBack
            size={28}
            fill="currentColor"
          />
        </motion.button>

        {/* PLAY / PAUSE */}
        <motion.button
          whileTap={{
            scale: 0.95,
          }}

          onClick={togglePlay}

          className="w-24 h-16 bg-kawaii-cream border-4 border-kawaii-mauve rounded-2xl shadow-pixel flex items-center justify-center text-kawaii-mauve hover:bg-kawaii-pink transition-colors"
        >
          {isPlaying ? (
            <Pause
              size={32}
              fill="currentColor"
            />
          ) : (
            <Play
              size={32}
              fill="currentColor"
              className="ml-1"
            />
          )}
        </motion.button>

        {/* NEXT */}
        <motion.button
          whileTap={{
            scale: 0.95,
          }}

          className="w-20 h-16 bg-kawaii-cream border-4 border-kawaii-mauve rounded-2xl shadow-pixel flex items-center justify-center text-kawaii-mauve hover:bg-kawaii-pink transition-colors"
        >
          <SkipForward
            size={28}
            fill="currentColor"
          />
        </motion.button>
      </div>

      {/* PROGRESS */}
      <div className="space-y-2 px-2">

        <div
          className="relative w-full h-2 flex items-center cursor-pointer"

          onClick={(e) => {

            const rect =
              e.currentTarget.getBoundingClientRect();

            const x =
              e.clientX -
              rect.left;

            seek(
              (x / rect.width) *
                100
            );
          }}
        >

          {/* TRACK */}
          <div className="absolute inset-0 border-b-4 border-dashed border-kawaii-mauve/30" />

          {/* ACTIVE */}
          <div
            className="absolute top-0 left-0 h-full border-b-4 border-kawaii-accent"

            style={{
              width: `${progress}%`,
            }}
          />

          {/* STAR */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}

            transition={{
              repeat: Infinity,
              duration: 2,
            }}

            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[#FDFD96] drop-shadow-[0_0_5px_rgba(0,0,0,0.2)]"

            style={{
              left: `${progress}%`,
            }}
          >
            <Star
              size={32}
              fill="currentColor"
              stroke="#5A3946"
              strokeWidth={2}
            />
          </motion.div>
        </div>

        {/* TIME */}
        <div className="flex justify-between font-mono-pixel text-sm text-kawaii-mauve/60">

          <span>
            {formatTime(
              (progress / 100) *
                duration
            )}
          </span>

          <span>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;