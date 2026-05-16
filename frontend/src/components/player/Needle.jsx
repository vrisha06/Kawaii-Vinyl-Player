import React from 'react';
import { motion } from 'framer-motion';

const Needle = ({ isPlaying }) => {
  return (
    <div className="absolute top-2 right-2 w-24 h-36 pointer-events-none z-20 origin-top-right">
      {/* Tonearm Base */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-kawaii-mauve border-4 border-white/20 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 bg-kawaii-pink rounded-full" />
      </div>

      {/* Tonearm Arm */}
      <motion.div
        initial={false}
        animate={{
          rotate: isPlaying ? -20 : 20,
          y: isPlaying ? 2 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 12,
          delay: isPlaying ? 0.3 : 0
        }}
        className="absolute top-4 right-4 w-32 h-2.5 bg-kawaii-mauve origin-right rounded-full"
        style={{ right: '15px', top: '15px' }}
      >
        {/* Head */}
        <div className="absolute -left-2 -top-1.5 w-6 h-4 bg-kawaii-mauve border-2 border-white/20 rounded-sm">
          <div className="absolute left-0.5 top-0.5 w-1 h-2 bg-kawaii-accent rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default Needle;
