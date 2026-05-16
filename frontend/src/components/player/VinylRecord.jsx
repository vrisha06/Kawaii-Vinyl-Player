import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VinylRecord = ({ isPlaying, cover }) => {
  return (
    <div className="relative flex items-center justify-center w-full max-w-[220px] aspect-square mx-auto my-2">

      {/* Turntable Base */}
      <div className="absolute inset-[-15%_-10%_-10%_-10%] bg-[#F3D1D9] border-4 border-kawaii-mauve rounded-2xl shadow-pixel">

        {/* Turntable Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <div className="w-4 h-4 bg-kawaii-accent border-2 border-kawaii-mauve rounded-sm" />

          <div className="w-8 h-4 bg-kawaii-cream border-2 border-kawaii-mauve rounded-sm flex items-center justify-center">
            <div className="w-4 h-1 bg-kawaii-mauve/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* VINYL TRANSITION SYSTEM */}
      <AnimatePresence mode="wait">

        <motion.div
          key={cover}

          /* COMING FROM SHELF */
          initial={{
            x: 260,
            y: -120,
            rotate: 180,
            scale: 0.5,
            opacity: 0,
          }}

          /* ON TURNTABLE */
          animate={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
          }}

          /* LEAVING TO SHELF */
          exit={{
            x: -240,
            y: -120,
            rotate: -180,
            scale: 0.5,
            opacity: 0,
          }}

          transition={{
            type: 'spring',
            stiffness: 55,
            damping: 16,
            mass: 1,
          }}

          className="absolute w-full h-full flex items-center justify-center z-10"
        >

          {/* ACTUAL SPINNING VINYL */}
          <motion.div
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}

            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}

            className="vinyl-pixel w-full h-full relative"
          >
            {/* Vinyl Grooves */}
            <div className="vinyl-grooves-pixel" />

            {/* Vinyl Shine */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

            {/* CENTER LABEL */}
            <div className="absolute inset-[30%] rounded-full overflow-hidden border-4 border-kawaii-mauve bg-kawaii-cream">

              {/* Album Art */}
              <motion.img
                src={cover}
                alt="Album Art"

                initial={{
                  scale: 1.15,
                  opacity: 0,
                }}

                animate={{
                  scale: 1,
                  opacity: 1,
                }}

                transition={{
                  duration: 0.45,
                }}

                className="w-full h-full object-cover"

                style={{
                  imageRendering: 'pixelated',
                }}
              />

              {/* Vinyl Center Hole */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-kawaii-mauve rounded-full shadow-inner" />
              </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(255,192,203,0.22)] pointer-events-none" />
          </motion.div>
        </motion.div>

      </AnimatePresence>
    </div>
  );
};

export default VinylRecord;