import { create } from 'zustand'

const usePlayerStore = create((set) => ({
  currentTrack: null,
  isPlaying: false,
  recentTracks: [],
  searchOpen: false,
  searchResults: [],

  setCurrentTrack: (track) =>
    set({ currentTrack: track }),

  setIsPlaying: (value) =>
    set({ isPlaying: value }),

  setSearchOpen: (value) =>
    set({ searchOpen: value }),

  setSearchResults: (results) =>
    set({ searchResults: results }),

  addRecentTrack: (track) =>
    set((state) => ({
      recentTracks: [
        track,
        ...state.recentTracks.filter(
          (t) => t.id !== track.id
        ),
      ].slice(0, 8),
    })),
}))

export default usePlayerStore