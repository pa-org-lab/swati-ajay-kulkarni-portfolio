"use client";

import { motion } from "motion/react";
import Image from "next/image";

export type HeroSlideItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: string;
  year?: string;
};

type Props = {
  nextItems: {
    item: HeroSlideItem;
    targetIndex: number;
  }[];
  onSelect: (targetIndex: number) => void;
};

export default function HeroThumbnail({ nextItems, onSelect }: Props) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {nextItems.map(({ item, targetIndex }, idx) => (
        <motion.button
          key={`${item.id}-${targetIndex}`}
          type="button"
          onClick={() => onSelect(targetIndex)}
          className="group relative h-16 w-24 sm:h-20 sm:w-32 md:h-22 md:w-36 lg:h-24 lg:w-40 overflow-hidden rounded-xl bg-stone-200 shadow-md shadow-stone-900/10 ring-1 ring-black/5 transition-all duration-300 hover:shadow-xl hover:ring-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 cursor-pointer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.08 }}
          aria-label={`View ${item.title}`}
        >
          <Image
            src={item.src}
            alt={item.alt || item.title}
            fill
            sizes="(max-width: 640px) 96px, (max-width: 1024px) 144px, 160px"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/0" />

          {/* Micro label on hover */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-1.5 sm:p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-left">
            <p className="truncate text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-wider text-stone-300">
              {item.category}
            </p>
            <p className="truncate text-[11px] sm:text-xs font-serif italic text-white leading-tight">
              {item.title}
            </p>
          </div>

          {/* Corner number indicator */}
          <span className="absolute top-1.5 right-1.5 rounded-full bg-black/40 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-sans font-medium text-white/90 backdrop-blur-xs">
            0{targetIndex + 1}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
