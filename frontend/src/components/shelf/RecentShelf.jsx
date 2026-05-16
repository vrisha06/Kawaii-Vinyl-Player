import { motion } from 'framer-motion';

import usePlayerStore from '../../store/usePlayerStore';

function RecentShelf() {
  const recentTracks = usePlayerStore(
    (state) => state.recentTracks
  );

  const setCurrentTrack = usePlayerStore(
    (state) => state.setCurrentTrack
  );

  return (
    <div className="absolute top-[59px] right-[100px] flex items-end z-30">
      
      {recentTracks
        .slice(0, 6)
        .map((track, index) => {

          /* NATURAL VINYL TILTS */
          const rotations = [
            -12,
            7,
            -9,
            8,
            -8,
          ];

          return (
            <motion.div
              key={track.id}

              initial={{
                opacity: 0,
                y: -30,
                rotate:
                  rotations[index],
              }}

              animate={{
                opacity: 1,
                y: 0,
                rotate:
                  rotations[index],
              }}

              whileHover={{
                y: -12,
                scale: 1.08,
                rotate:
                  rotations[index] *
                  0.5,
                zIndex: 100,
              }}

              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 14,
              }}

              onClick={() =>
                setCurrentTrack(track)
              }

              className="relative cursor-pointer"
              style={{
                marginLeft:
                  index === 0
                    ? 0
                    : '-18px',
              }}
            >

              {/* VINYL */}
              <div className="w-[72px] h-[72px] rounded-full bg-black border-[3px] border-[#222] shadow-[0_8px_18px_rgba(0,0,0,0.45)] relative overflow-hidden">

                {/* GROOVES */}
                <div className="absolute inset-[8%] rounded-full border border-white/10" />

                <div className="absolute inset-[18%] rounded-full border border-white/10" />

                <div className="absolute inset-[28%] rounded-full border border-white/10" />

                {/* LABEL */}
                <img
                  src={
                    track.cover ||
                    track.image
                  }

                  alt={track.title}

                  className="absolute inset-[28%] w-[44%] h-[44%] rounded-full object-cover border border-white/20"

                  style={{
                    imageRendering:
                      'pixelated',
                  }}
                />

                {/* CENTER HOLE */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#f7d5df]" />
                </div>

                {/* SHINE */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
    </div>
  );
}

export default RecentShelf;