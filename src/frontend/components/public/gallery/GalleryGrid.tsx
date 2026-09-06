"use client";

import { motion } from "motion/react";
import { FiMaximize2 } from "react-icons/fi";
import type { PublicGalleryImageItem } from "@/backend/actions/image.action";
import DriftWall, { type DriftWallItem } from "./DriftGallery";
import type { GalleryLayoutOption } from "./GalleryFilterBar";

interface GalleryGridProps {
  images: PublicGalleryImageItem[];
  isLoading: boolean;
  layout: GalleryLayoutOption;
  onImageClick: (index: number) => void;
}

export default function GalleryGrid({
  images,
  isLoading,
  layout,
  onImageClick,
}: GalleryGridProps) {
  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="rounded-2xl bg-stone-200/60 animate-pulse overflow-hidden border border-stone-200/60"
            style={{
              height: idx % 3 === 0 ? "380px" : idx % 2 === 0 ? "320px" : "280px",
            }}
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full py-20 px-6 text-center rounded-3xl border border-stone-200/80 bg-white/50 backdrop-blur-sm">
        <p className="font-serif italic text-2xl text-stone-700">
          No works found in this selection
        </p>
        <p className="font-sans text-xs text-stone-500 tracking-[0.18em] uppercase mt-2">
          Try choosing another category or clearing your search.
        </p>
      </div>
    );
  }

  if (layout === "drift") {
    const driftItems: DriftWallItem[] = images.map((img) => ({
      image: img.url,
      title: img.title,
      category: img.categoryName,
      description: img.description,
    }));

    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative w-full h-[620px] sm:h-[700px] lg:h-[760px] rounded-3xl overflow-hidden border border-stone-200/80 bg-[#f4eee9]/35 backdrop-blur-sm select-none shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
          <DriftWall
            items={driftItems}
            columns={5}
            tileWidth={260}
            tileHeight={175}
            gap={20}
            radius={16}
            tilt={12}
            turn={-10}
            perspective={1200}
            depth={80}
            speed={36}
            direction="up"
            variance={0.4}
            parallax={0.5}
            pauseOnHover={true}
            lift={40}
            fade={0}
            dim={1}
            overlayColor="transparent"
            onItemClick={(_item, index) => onImageClick(index)}
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 select-none">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.24em] uppercase text-stone-400">
            ← Move cursor or drag to tilt & drift through archive • Click tile for details →
          </span>
        </div>
      </div>
    );
  }


  if (layout === "masonry") {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
        {images.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: Math.min(index * 0.04, 0.4),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09)] transition-all duration-500 cursor-pointer"
            onClick={() => onImageClick(index)}
            tabIndex={0}
            role="button"
            aria-label={`View ${item.title || "photograph"}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onImageClick(index);
              }
            }}
          >
            {/* Image display - Crisp, without dark filter overlays */}
            <div className="relative overflow-hidden w-full">
              <img
                src={item.url}
                alt={item.title || "Portfolio photograph"}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Hover Overlay: Subtle, clean gradient only on hover for caption readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-between p-5">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                  <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.24em] uppercase text-stone-200 bg-stone-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    {item.categoryName}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <FiMaximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-lg sm:text-xl text-white font-normal leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 font-sans text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Uniform Grid View
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {images.map((item, index) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: Math.min(index * 0.04, 0.4),
            ease: [0.22, 1, 0.36, 1],
          }}
          className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09)] transition-all duration-500 cursor-pointer"
          onClick={() => onImageClick(index)}
          tabIndex={0}
          role="button"
          aria-label={`View ${item.title || "photograph"}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onImageClick(index);
            }
          }}
        >
          <img
            src={item.url}
            alt={item.title || "Portfolio photograph"}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-between p-5">
            <div className="flex justify-between items-start">
              <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.24em] uppercase text-stone-200 bg-stone-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                {item.categoryName}
              </span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <FiMaximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-serif text-lg sm:text-xl text-white font-normal leading-snug">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 font-sans text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
