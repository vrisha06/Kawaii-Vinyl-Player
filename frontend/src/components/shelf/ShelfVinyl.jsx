import { motion } from 'framer-motion'
import usePlayerStore from '../../store/usePlayerStore'

function ShelfVinyl({ track }) {
  const setCurrentTrack = usePlayerStore(
    (state) => state.setCurrentTrack
  )

  const addRecentTrack = usePlayerStore(
    (state) => state.addRecentTrack
  )

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.05,
      }}
      onClick={() => {
        setCurrentTrack(track)
        addRecentTrack(track)
      }}
      className="relative cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full bg-black border-[3px] border-zinc-800 shadow-2xl flex items-center justify-center">
        <img
          src={track.image}
          alt="album"
          className="w-6 h-6 rounded-full"
        />
      </div>
    </motion.div>
  )
}

export default ShelfVinyl