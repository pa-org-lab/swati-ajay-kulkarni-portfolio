"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import type { PublicAlbumDetail } from "@/backend/actions/album.action";

interface AlbumViewProps {
  album: PublicAlbumDetail;
}

export default function AlbumView({ album }: AlbumViewProps) {
  const [index, setIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const total = album.images.length;
  const current = album.images[index];
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const isLoading = !!current && loadedId !== current._id;

  const go = useCallback(
    (step: number) => {
      if (total === 0) return;
      setIndex((prev) => (prev + step + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "Escape") setIsZoomed(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  useEffect(() => {
    if (!isZoomed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isZoomed]);

  return (
    <section className="relative w-full bg-[#FAF7F5] min-h-screen pt-28 sm:pt-32 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-14 xl:px-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Back to gallery */}
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2.5 text-stone-500 hover:text-[#c2654d] transition-colors duration-300 mb-8 sm:mb-10"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.24em] uppercase">
            Gallery
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 lg:gap-16 xl:gap-20 items-start">
          {/* Carousel column */}
          <div className="w-full">
            <div className="w-fit max-w-full">
              {/* Category badge + arrows */}
              <div className="flex items-center justify-between gap-4 mb-3 w-full">
                {album.categoryName && (
                  <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-stone-200/80 text-[9.5px] sm:text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-stone-700 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c2654d]" />
                    {album.categoryName}
                  </span>
                )}

                {total > 1 && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous image"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-stone-200/90 text-stone-700 hover:text-[#c2654d] hover:border-stone-400 flex items-center justify-center transition-colors duration-300 cursor-pointer"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next image"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-stone-200/90 text-stone-700 hover:text-[#c2654d] hover:border-stone-400 flex items-center justify-center transition-colors duration-300 cursor-pointer"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Image frame */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                aria-label="View image full size"
                className={`relative block rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] select-none cursor-zoom-in ${
                  isLoading ? "w-[min(100%,560px)] aspect-[4/3]" : ""
                }`}
              >
                {isLoading && (
                  <div
                    aria-hidden
                    className="absolute inset-0 animate-pulse bg-stone-200"
                  />
                )}
                {current && (
                  <motion.img
                    key={current._id}
                    ref={(el) => {
                      if (el?.complete && el.naturalWidth > 0) {
                        setLoadedId(current._id);
                      }
                    }}
                    onLoad={() => setLoadedId(current._id)}
                    onError={() => setLoadedId(current._id)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    src={current.url}
                    alt={current.title || album.name}
                    className={`block max-w-full object-contain ${
                      isLoading
                        ? "absolute inset-0 w-full h-full"
                        : "w-auto h-auto max-h-[80vh]"
                    }`}
                    draggable={false}
                  />
                )}

                <span className="absolute bottom-3.5 right-3.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-stone-200/70 text-[10.5px] font-sans font-medium tracking-[0.12em] text-stone-700">
                  {index + 1} / {total}
                </span>
              </button>

              {/* Dot indicators */}
              {total > 1 && (
                <div className="flex items-center justify-center flex-wrap gap-1.5 mt-5 w-full">
                  {album.images.map((img, i) => (
                    <button
                      key={img._id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === index}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === index
                          ? "w-7 bg-[#c2654d]"
                          : "w-1.5 bg-stone-300 hover:bg-stone-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details column */}
          <div className="w-full">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] font-normal text-stone-900 tracking-[-0.02em] leading-[1.05]">
              {album.name}
            </h1>

            {/* Accent rule, then full-width divider */}
            <div className="w-14 h-[3px] rounded-full bg-[#c2654d] mt-5" />
            <div className="h-[1px] w-full bg-stone-300/80 mt-6" />

            {album.description && (
              <p className="mt-8 font-sans text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                {album.description}
              </p>
            )}

            {/* Caption for the image currently in view */}
            {current && (current.title || current.description) && (
              <div className="mt-8 max-w-xl">
                {current.title && (
                  <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
                    {current.title}
                  </h2>
                )}
                {current.description && (
                  <p className="mt-2 font-sans text-sm text-stone-500 leading-relaxed">
                    {current.description}
                  </p>
                )}
              </div>
            )}

            {total === 0 && (
              <p className="mt-8 font-serif italic text-xl text-stone-600">
                This album is empty.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Full-size image modal */}
      <AnimatePresence>
        {isZoomed && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsZoomed(false)}
            role="dialog"
            aria-modal="true"
            aria-label={current.title || album.name}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-stone-950/92 backdrop-blur-md cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              aria-label="Close image"
              className="absolute top-5 right-5 sm:top-8 sm:right-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <motion.img
              key={current._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={current.url}
              alt={current.title || album.name}
              className="max-w-[94vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
