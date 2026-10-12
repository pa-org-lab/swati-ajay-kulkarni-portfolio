"use client";

import { FiX } from "react-icons/fi";

interface AlbumModalSkeletonProps {
  onClose?: () => void;
}

export default function AlbumModalSkeleton({
  onClose,
}: AlbumModalSkeletonProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading album"
      aria-busy="true"
      className="fixed inset-0 z-[100] w-screen h-screen h-[100dvh] bg-[#FAF7F5] flex flex-col lg:flex-row overflow-hidden select-none"
    >
      {/* 80% Left Image Area Skeleton */}
      <div className="relative w-full lg:w-[80%] h-[60vh] sm:h-[65vh] lg:h-full bg-[#F4EFEA] flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 overflow-hidden">
        {/* Counter badge skeleton */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 h-7 w-24 rounded-full bg-stone-300/60 animate-pulse border border-stone-200/60" />

        {/* Large Main Photo Placeholder */}
        <div className="w-[min(90%,760px)] aspect-[4/3] max-h-[80vh] rounded-xl sm:rounded-2xl bg-stone-300/50 animate-pulse shadow-md border border-stone-200/60" />

        {/* Bottom thumbnail strip skeleton */}
        <div className="absolute bottom-4 sm:bottom-6 z-20 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/70 border border-stone-200/70 shadow-xs">
          <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg bg-stone-300/60 animate-pulse" />
          <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg bg-stone-300/50 animate-pulse" />
          <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg bg-stone-300/40 animate-pulse" />
        </div>
      </div>

      {/* 20% Right Text Column Skeleton */}
      <div className="relative w-full lg:w-[20%] h-[40vh] sm:h-[35vh] lg:h-full bg-[#FAF7F5] border-t lg:border-t-0 lg:border-l border-stone-200/90 flex flex-col justify-between p-6 sm:p-7 xl:p-8 overflow-y-auto">
        <div>
          {/* Header Row: Badge & Close button */}
          <div className="flex items-center justify-between gap-3 w-full">
            <div className="h-6 w-24 rounded-full bg-stone-300/60 animate-pulse" />
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close album modal"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Title Placeholder */}
          <div className="mt-5 space-y-2">
            <div className="h-7 xl:h-8 w-4/5 rounded-lg bg-stone-300/70 animate-pulse" />
            <div className="h-7 xl:h-8 w-1/2 rounded-lg bg-stone-300/60 animate-pulse" />
          </div>

          {/* Terracotta accent rule */}
          <div className="w-10 h-[2.5px] rounded-full bg-[#c2654d]/40 mt-3.5 mb-4" />

          {/* Description lines */}
          <div className="space-y-2 mt-4">
            <div className="h-3.5 w-full rounded bg-stone-300/50 animate-pulse" />
            <div className="h-3.5 w-11/12 rounded bg-stone-300/50 animate-pulse" />
            <div className="h-3.5 w-4/5 rounded bg-stone-300/40 animate-pulse" />
          </div>

          <div className="h-[1px] w-full bg-stone-200/80 my-5" />

          {/* Caption placeholder */}
          <div className="space-y-2">
            <div className="h-4 w-2/3 rounded bg-stone-300/60 animate-pulse" />
            <div className="h-3 w-full rounded bg-stone-300/40 animate-pulse" />
          </div>
        </div>

        {/* Footer info placeholder */}
        <div className="pt-6 border-t border-stone-200/60 mt-auto">
          <div className="h-3 w-28 rounded bg-stone-300/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
