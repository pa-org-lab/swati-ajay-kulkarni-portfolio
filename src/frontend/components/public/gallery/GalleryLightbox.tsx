"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import type { PublicGalleryImageItem } from "@/backend/actions/image.action";

interface GalleryLightboxProps {
  images: PublicGalleryImageItem[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  selectedIndex,
  onClose,
  onSelectIndex,
}: GalleryLightboxProps) {
  const isOpen = selectedIndex !== null && selectedIndex >= 0 && selectedIndex < images.length;
  const currentItem = isOpen ? images[selectedIndex] : null;

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || images.length === 0) return;
    const nextIdx = (selectedIndex - 1 + images.length) % images.length;
    onSelectIndex(nextIdx);
  }, [selectedIndex, images.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null || images.length === 0) return;
    const nextIdx = (selectedIndex + 1) % images.length;
    onSelectIndex(nextIdx);
  }, [selectedIndex, images.length, onSelectIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && currentItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-white/30 backdrop-blur-xl select-none"
          onClick={onClose}
        >
          {/* Top Bar: Title, Category, Counter & Close Button */}
          <div
            className="absolute top-0 inset-x-0 p-4 sm:p-6 md:p-8 flex items-center justify-between pointer-events-none z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full bg-white/65 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]">
              <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.24em] text-[#c2654d] uppercase">
                {currentItem.categoryName}
              </span>
              <div className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-xs font-sans font-medium tracking-[0.2em] text-stone-600">
                {String((selectedIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/65 hover:bg-white/85 text-stone-700 hover:text-stone-950 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] backdrop-blur-xl"
              aria-label="Close image lightbox"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow Navigation Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/65 hover:bg-white/90 text-stone-800 hover:text-[#c2654d] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-xl"
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow Navigation Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/65 hover:bg-white/90 text-stone-800 hover:text-[#c2654d] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] backdrop-blur-xl"
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Centered Image Container */}
          <motion.div
            key={currentItem._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-full max-h-[80vh] flex flex-col items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.url}
              alt={currentItem.title || "Gallery photograph"}
              className="max-w-[90vw] sm:max-w-[85vw] max-h-[72vh] object-contain rounded-lg sm:rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-white/80 ring-1 ring-black/5 select-none pointer-events-auto"
              draggable={false}
            />

            {/* Bottom Glassmorphic Caption Bar */}
            {currentItem.title && (
              <div className="mt-4 sm:mt-5 text-center px-6 py-2.5 max-w-2xl rounded-2xl bg-white/65 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]">
                <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-stone-900 font-normal tracking-wide">
                  {currentItem.title}
                </h3>
                {currentItem.description && (
                  <p className="mt-1 text-xs sm:text-sm font-sans text-stone-600 font-light leading-relaxed">
                    {currentItem.description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
