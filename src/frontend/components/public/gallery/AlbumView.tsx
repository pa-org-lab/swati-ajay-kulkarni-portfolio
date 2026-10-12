"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import type { PublicAlbumDetail } from "@/backend/actions/album.action";

interface AlbumViewProps {
  album: PublicAlbumDetail;
  onClose?: () => void;
}

export default function AlbumView({ album, onClose }: AlbumViewProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const total = album.images.length;
  const current = album.images[index];
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const isLoading = !!current && loadedId !== current._id;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.push("/gallery");
    }
  }, [onClose, router]);

  const go = useCallback(
    (step: number) => {
      if (total <= 1) return;
      setIndex((prev) => (prev + step + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, isZoomed, handleClose]);

  // Lock body scroll while modal layout is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={album.name}
      className="fixed inset-0 z-[100] w-screen h-screen h-[100dvh] bg-[#FAF7F5] flex flex-col lg:flex-row overflow-hidden select-none"
    >
      {/* ========================================================= */}
      {/* LEFT COLUMN: IMAGE DISPLAY (80% ON DESKTOP)               */}
      {/* ========================================================= */}
      <div className="relative w-full lg:w-[80%] h-[62vh] sm:h-[65vh] lg:h-full bg-[#F4EFEA] flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden">
        {/* Top Floating Controls on Left Image Panel */}
        <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-none">
          {/* Index Counter */}
          {total > 0 && (
            <span className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 text-[10.5px] sm:text-[11px] font-sans font-medium tracking-[0.16em] text-stone-700 shadow-xs">
              <span className="font-semibold text-[#c2654d]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-stone-400">/</span>
              <span>{String(total).padStart(2, "0")}</span>
            </span>
          )}

          {/* Zoom/Expand button */}
          {current && (
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              aria-label="View photo full size"
              className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#c2654d] border border-stone-200/80 shadow-xs flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <FiMaximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Previous Image Chevron Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#c2654d] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-stone-200/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Image Chevron Button */}
        {total > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-[#c2654d] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-stone-200/80 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Main Photo Frame */}
        <div className="relative max-w-full max-h-[82vh] lg:max-h-[86vh] flex items-center justify-center">
          {isLoading && (
            <div
              aria-hidden
              className="absolute inset-0 min-w-[260px] min-h-[220px] rounded-xl sm:rounded-2xl animate-pulse bg-stone-300/40"
            />
          )}

          {current ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={current._id}
                ref={(el) => {
                  if (el?.complete && el.naturalWidth > 0) {
                    setLoadedId(current._id);
                  }
                }}
                onLoad={() => setLoadedId(current._id)}
                onError={() => setLoadedId(current._id)}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                src={current.url}
                alt={current.title || album.name}
                onClick={() => setIsZoomed(true)}
                className="block max-w-[86vw] lg:max-w-[74vw] max-h-[52vh] sm:max-h-[58vh] lg:max-h-[82vh] object-contain rounded-xl sm:rounded-2xl shadow-[0_20px_50px_-20px_rgba(28,25,23,0.22)] border border-stone-300/50 cursor-zoom-in select-none"
                draggable={false}
              />
            </AnimatePresence>
          ) : (
            <p className="font-serif italic text-lg sm:text-xl text-stone-500">
              This album is empty.
            </p>
          )}
        </div>

        {/* Bottom Thumbnail Strip (for albums with multiple photos) */}
        {total > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto max-w-[92%] flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] overflow-x-auto">
              {album.images.map((img, i) => (
                <button
                  key={img._id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={i === index}
                  className={`relative shrink-0 w-11 h-8 sm:w-13 sm:h-9 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    i === index
                      ? "border-[#c2654d] scale-105 shadow-xs"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: TEXT DETAILS & CONTROLS (20% ON DESKTOP)   */}
      {/* ========================================================= */}
      <div className="relative w-full lg:w-[20%] h-[38vh] sm:h-[35vh] lg:h-full bg-[#FAF7F5] border-t lg:border-t-0 lg:border-l border-stone-200/90 flex flex-col justify-between p-5 sm:p-6 lg:p-6 xl:p-8 overflow-y-auto">
        <div className="w-full">
          {/* Header Row: Category Badge & Close Button */}
          <div className="flex items-center justify-between gap-3 w-full">
            {album.categoryName ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200/90 text-[9.5px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2654d]" />
                {album.categoryName}
              </span>
            ) : (
              <span className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-stone-400">
                Album
              </span>
            )}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close album modal"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Album Title */}
          <h1 className="font-serif text-2xl xl:text-3xl font-normal text-stone-900 tracking-[-0.02em] leading-[1.12] mt-5">
            {album.name}
          </h1>

          {/* Terracotta accent rule */}
          <div className="w-10 h-[2.5px] rounded-full bg-[#c2654d] mt-3.5 mb-4" />

          {/* Album Description */}
          {album.description && (
            <p className="font-sans text-xs xl:text-sm text-stone-600 leading-relaxed break-words">
              {album.description}
            </p>
          )}

          {/* Divider */}
          <div className="h-[1px] w-full bg-stone-200/80 my-5" />

          {/* Active Photo Caption (Title & Description) */}
          {current && (current.title || current.description) ? (
            <div className="space-y-1.5 rounded-xl bg-white/70 border border-stone-200/80 p-3.5 sm:p-4 shadow-2xs">
              <span className="text-[9px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-400 block">
                Active Photograph
              </span>
              {current.title && (
                <h2 className="font-serif text-base xl:text-lg font-medium text-stone-900 leading-snug break-words">
                  {current.title}
                </h2>
              )}
              {current.description && (
                <p className="font-sans text-xs text-stone-500 leading-relaxed break-words">
                  {current.description}
                </p>
              )}
            </div>
          ) : (
            <div className="text-[11px] font-sans text-stone-400 italic">
              Photograph {index + 1} of {total}
            </div>
          )}
        </div>

        {/* Bottom Actions & Keyboard Hints */}
        <div className="pt-6 border-t border-stone-200/70 mt-6 lg:mt-auto">
          <button
            type="button"
            onClick={handleClose}
            className="group inline-flex items-center gap-2 text-stone-500 hover:text-[#c2654d] text-xs font-sans font-semibold tracking-[0.18em] uppercase transition-colors duration-300 cursor-pointer"
          >
            <FiArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Gallery</span>
          </button>

          <p className="text-[10px] font-sans tracking-[0.16em] uppercase text-stone-400 mt-3 hidden lg:block">
            Use ← → to navigate • Esc to close
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FULL-SIZE IMAGE ZOOM OVERLAY (ON DEMAND)                  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isZoomed && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => setIsZoomed(false)}
            role="dialog"
            aria-modal="true"
            aria-label={current.title || album.name}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-stone-950/94 backdrop-blur-md cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              aria-label="Close zoom preview"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <motion.img
              key={current._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              src={current.url}
              alt={current.title || album.name}
              className="max-w-[95vw] max-h-[92vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
