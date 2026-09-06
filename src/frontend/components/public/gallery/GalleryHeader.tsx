"use client";

import { motion } from "motion/react";

interface GalleryHeaderProps {
  totalCount?: number;
}

export default function GalleryHeader({ totalCount }: GalleryHeaderProps) {
  return (
    <header className="relative w-full mb-8 sm:mb-12">
      {/* Top accent dash matching portfolio style */}
      {/* <div className="flex items-center justify-between mb-4 sm:mb-6 select-none">
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-sans tracking-[0.28em] text-stone-500">
          <span className="font-semibold text-[#c2654d] text-xs sm:text-sm tracking-[0.24em]">
            03
          </span>
          <div className="w-12 sm:w-16 h-[1px] bg-stone-300" />
          <span className="font-medium text-[10px] sm:text-xs text-stone-400 tracking-[0.28em] uppercase">
            ARCHIVE & PORTFOLIO
          </span>
        </div>

        {totalCount !== undefined && totalCount > 0 && (
          <span className="text-[11px] font-sans font-medium tracking-[0.22em] text-stone-400 uppercase hidden sm:inline-block">
            {totalCount} {totalCount === 1 ? "WORK" : "WORKS"}
          </span>
        )}
      </div> */}

      {/* Main Title - Serif Editorial */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal text-stone-900 tracking-[-0.02em] leading-[1.05]"
      >
        Gallery
      </motion.h1>

      {/* Subtitle - clean, spaced, editorial */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 sm:mt-4 text-stone-600 font-sans text-sm sm:text-base md:text-[17px] font-normal leading-relaxed "
      >
        An evolving collection of photographs, places, people and quiet moments gathered through the years.
      </motion.p>
    </header>
  );
}
