import { useState } from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Search,
  X,
  Music2,
} from 'lucide-react';

import spotifyApi from '../../services/spotify';

import usePlayerStore from '../../store/usePlayerStore';

function SearchModal() {
  const [query, setQuery] = useState('');

  const searchOpen = usePlayerStore(
    (state) => state.searchOpen
  );

  const setSearchOpen = usePlayerStore(
    (state) => state.setSearchOpen
  );

  const searchResults = usePlayerStore(
    (state) => state.searchResults
  );

  const setSearchResults = usePlayerStore(
    (state) => state.setSearchResults
  );

  const setCurrentTrack = usePlayerStore(
    (state) => state.setCurrentTrack
  );

  const addRecentTrack = usePlayerStore(
    (state) => state.addRecentTrack
  );

  const searchSongs = async (value) => {
    setQuery(value);

    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const res =
        await spotifyApi.searchTracks(value);

      const tracks =
        res.tracks.items.map((track) => ({
          id: track.id,
          title: track.name,
          artist: track.artists[0].name,
          cover:
            track.album.images[0]?.url,
          uri: track.uri,
        }));

      setSearchResults(tracks);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[100]"
        >
          {/* Modal */}
          <motion.div
            initial={{
              scale: 0.8,
              opacity: 0,
              y: 40,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: 40,
            }}
            transition={{
              duration: 0.35,
            }}
            className="w-[500px] max-w-[90vw] h-[650px] bg-kawaii-cream border-4 border-kawaii-mauve rounded-3xl shadow-pixel overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-kawaii-mauve bg-kawaii-pink">
              
              <div className="flex items-center gap-3">
                <Music2
                  className="text-kawaii-mauve"
                  size={24}
                />

                <h1 className="font-pixel text-xl text-kawaii-text">
                  SEARCH_TRACKS
                </h1>
              </div>

              <button
                onClick={() =>
                  setSearchOpen(false)
                }
                className="text-kawaii-mauve hover:scale-110 transition-transform"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-5">
              <div className="relative">
                
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-kawaii-mauve/60"
                />

                <input
                  value={query}
                  onChange={(e) =>
                    searchSongs(
                      e.target.value
                    )
                  }
                  placeholder="search for a song..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-4 border-kawaii-mauve bg-white text-kawaii-text font-mono-pixel outline-none focus:scale-[1.01] transition-transform"
                />
              </div>
            </div>

            {/* Results */}
            <div className="px-5 pb-5 overflow-y-auto h-[500px]">
              
              <div className="flex flex-col gap-4">
                {searchResults.map(
                  (track) => (
                    <motion.div
                      key={track.id}

                      whileHover={{
                        scale: 1.02,
                        y: -2,
                      }}

                      whileTap={{
                        scale: 0.98,
                      }}

                      onClick={() => {
                        setCurrentTrack(track);

                        addRecentTrack(
                          track
                        );

                        setSearchOpen(
                          false
                        );
                      }}

                      className="flex items-center gap-4 bg-white border-4 border-kawaii-mauve rounded-2xl p-3 cursor-pointer shadow-pixel hover:bg-kawaii-pink/40 transition-colors"
                    >
                      {/* Album */}
                      <img
                        src={track.cover}
                        alt="album"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-kawaii-mauve"
                        style={{
                          imageRendering:
                            'pixelated',
                        }}
                      />

                      {/* Info */}
                      <div className="overflow-hidden">
                        <h2 className="font-pixel text-lg text-kawaii-text truncate">
                          {track.title}
                        </h2>

                        <p className="font-mono-pixel text-sm text-kawaii-accent uppercase truncate">
                          {track.artist}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;