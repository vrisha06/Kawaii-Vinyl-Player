import React from 'react';

import {
  Minus,
  Square,
  X,
  Heart,
  Music,
  Disc,
  Search,
} from 'lucide-react';

import usePlayerStore from '../../store/usePlayerStore';

const WindowHeader = ({
  title = 'NOW_PLAYING: ???',
  currentView,
  onViewChange,
}) => {

  const setSearchOpen =
    usePlayerStore(
      (state) =>
        state.setSearchOpen
    );

  return (
    <div className="bg-kawaii-pink flex flex-col select-none relative border-b-4 border-kawaii-mauve pt-6">

      {/* TOP BOW */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">

        <div className="relative flex flex-col items-center">

          <div className="w-12 h-6 bg-rose-400 rounded-full border-2 border-kawaii-mauve relative">

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-kawaii-mauve rounded-full" />
            </div>

            <div className="absolute -left-2 top-0 w-6 h-6 bg-rose-300 rounded-full border-2 border-kawaii-mauve -z-10" />

            <div className="absolute -right-2 top-0 w-6 h-6 bg-rose-300 rounded-full border-2 border-kawaii-mauve -z-10" />
          </div>

          <div className="flex gap-4 -mt-1">

            <div className="w-1 h-4 bg-rose-400 border-x border-kawaii-mauve rotate-12" />

            <div className="w-1 h-4 bg-rose-400 border-x border-kawaii-mauve -rotate-12" />
          </div>
        </div>
      </div>

      {/* HEADER CONTENT */}
      <div className="flex items-center justify-between px-4 py-2">

        {/* TITLE */}
        <div className="flex items-center gap-2 overflow-hidden">

          <div className="text-kawaii-mauve shrink-0">
            <Heart
              size={14}
              fill="currentColor"
            />
          </div>

          <span className="font-tiny-pixel text-[8px] text-kawaii-mauve tracking-tight uppercase truncate">
            {title}
          </span>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">

          {/* NAVIGATION */}
          <div className="flex items-center gap-2 mr-2 pr-3 border-r-2 border-kawaii-mauve/20">

            {/* HOME */}
            <button
              onClick={() =>
                onViewChange('home')
              }

              className={`transition-all hover:scale-110 ${
                currentView === 'home'
                  ? 'text-kawaii-accent'
                  : 'text-kawaii-mauve/40'
              }`}
            >
              <Music size={15} />
            </button>

            {/* PLAYER */}
            <button
              onClick={() =>
                onViewChange(
                  'player'
                )
              }

              className={`transition-all hover:scale-110 ${
                currentView ===
                'player'
                  ? 'text-kawaii-accent'
                  : 'text-kawaii-mauve/40'
              }`}
            >
              <Disc size={15} />
            </button>

            {/* SEARCH */}
            <button
              onClick={() =>
                setSearchOpen(true)
              }

              className="text-kawaii-mauve hover:text-kawaii-accent transition-all hover:scale-110"
            >
              <Search size={15} />
            </button>
          </div>

          {/* WINDOW BUTTONS */}
          <button className="text-kawaii-mauve hover:scale-110 transition-transform">
            <Minus
              size={14}
              strokeWidth={3}
            />
          </button>

          <button className="text-kawaii-mauve hover:scale-110 transition-transform">
            <Square
              size={12}
              strokeWidth={3}
            />
          </button>

          <button className="text-kawaii-mauve hover:text-red-400 hover:scale-110 transition-all">
            <X
              size={14}
              strokeWidth={3}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WindowHeader;