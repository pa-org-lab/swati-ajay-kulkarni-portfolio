"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { HeroSlideItem } from "./HeroThumbnail";

type Props = {
  activeItem: HeroSlideItem;
  activeIndex: number;
  totalSlides: number;
  onSelectIndex: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function HeroCarousel({
  activeItem,
  activeIndex,
  totalSlides,
  onSelectIndex,
  onPrev,
  onNext,
}: Props) {
  const currentNumStr = (activeIndex + 1).toString().padStart(2, "0");
  const totalNumStr = totalSlides.toString().padStart(2, "0");

  return (
    <div className="relative h-full w-full overflow-hidden select-none bg-stone-900">
      {/* Background Image Crossfade with smooth scale */}
      <AnimatePresence initial={false}>
        <motion.div
          key={activeItem.id}
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          <Image
            src={activeItem.src}
            alt={activeItem.alt || activeItem.title}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Top subtle vignette for header contrast */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />

      {/* Bottom ambient gradient for text contrast */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Left/Right Desktop Navigation Buttons */}
      {onPrev && onNext && (
        <div className="absolute inset-y-0 inset-x-0 hidden sm:flex items-center justify-between px-4 pointer-events-none z-20">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous slide"
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-80 focus:opacity-100 cursor-pointer"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="Next slide"
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 hover:opacity-100 group-hover:opacity-80 focus:opacity-100 cursor-pointer"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Bottom Left Artwork Caption & Pagination Overlay */}
      <div className="absolute bottom-6 left-5 sm:bottom-10 sm:left-10 md:bottom-12 md:left-12 z-20 flex flex-col gap-1 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="inline-block text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.28em] text-white/80">
              {activeItem.category}
            </span>
            <h2 className="font-serif italic text-xl sm:text-3xl lg:text-4xl text-white tracking-wide drop-shadow-md">
              {activeItem.title}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots and 01 / 08 Counter */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={`carousel-dot-${activeItem.id}-${idx}`}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="p-1 -m-1 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-5 sm:w-6 bg-white shadow-sm"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="font-sans text-xs tracking-widest text-white/80 font-light pl-1">
            {currentNumStr} / {totalNumStr}
          </span>
        </div>
      </div>
    </div>
  );
}
