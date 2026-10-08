"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FiArrowUpRight, FiFolder } from "react-icons/fi";
import type { PublicAlbumData } from "@/backend/actions/album.action";

interface AlbumFolderGridProps {
  albums: PublicAlbumData[];
}

export default function AlbumFolderGrid({ albums }: AlbumFolderGridProps) {
  if (albums.length === 0) return null;

  return (
    <section aria-label="Albums" className="w-full mb-6 sm:mb-10">
      <div className="flex items-center gap-4 mb-5 sm:mb-6 select-none">
        <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-stone-500">
          Albums
        </span>
        <div className="flex-1 h-[1px] bg-stone-300/80" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
        {albums.map((album, index) => (
          <motion.div
            key={album._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: Math.min(index * 0.04, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative pt-2.5"
          >
            {/* Offset sheet behind the card marks a folder apart from a photo */}
            <div
              className="absolute inset-x-5 top-0 h-3 rounded-t-xl bg-stone-200/70 border border-b-0 border-stone-300/70"
              aria-hidden="true"
            />

            <Link
              href={`/gallery/${album.slug}`}
              className="group relative block rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09)] transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 flex items-center justify-center">
                {album.img ? (
                  <img
                    src={album.img}
                    alt={album.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <FiFolder className="w-7 h-7 text-stone-300" />
                )}

                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-stone-700 border border-stone-200/80">
                  <FiFolder className="w-3 h-3 text-[#c2654d]" />
                  {album.count}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div className="min-w-0">
                  <h3 className="font-serif text-base sm:text-lg text-stone-900 font-normal leading-snug truncate">
                    {album.name}
                  </h3>
                  <p className="text-[9.5px] sm:text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-stone-400 mt-0.5 truncate">
                    {album.categoryName}
                  </p>
                </div>
                <FiArrowUpRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-[#c2654d] transition-colors duration-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-10 select-none">
        <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-stone-500">
          Images
        </span>
        <div className="flex-1 h-[1px] bg-stone-300/80" />
      </div>
    </section>
  );
}
