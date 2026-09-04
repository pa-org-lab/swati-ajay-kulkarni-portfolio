'use client';

import Link from "next/link";
import CircularGallery from "./CircularGallery";

const glimpseItems = [
  {
    image: "/images/midnight-cosmos.jpg",
    text: "Midnight Cosmos"
  },
  {
    image: "/images/portrait-ethereal-gaze.jpg",
    text: "Ethereal Gaze"
  },
  {
    image: "/images/landscape-misty-peaks.jpg",
    text: "Misty Peaks"
  },
  {
    image: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=85",
    text: "Chromatic Rhythm"
  },
  {
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=85",
    text: "Echoes of Rome"
  },
  {
    image: "https://images.unsplash.com/photo-1604511482975-49278f591bf4?auto=format&fit=crop&w=1200&q=85",
    text: "Golden Whispers"
  },
  {
    image: "https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?auto=format&fit=crop&w=1200&q=85",
    text: "Brutalist Angles"
  },
  {
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85",
    text: "Rustic Hearth"
  },
  {
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=85",
    text: "Botanical Solitude"
  }
];

export default function GalleryGlimpseSection() {
  return (
    <section
      id="gallery-glimpse"
      aria-label="Gallery Glimpse Archive"
      className="relative w-full bg-[#F6F2F5] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24 xl:px-20 xl:py-28 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* 1. SEPARATOR (Matching reference theme: 03 ─────── GALLERY ARCHIVE) */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans tracking-[0.28em] text-stone-500 mb-8 sm:mb-12 select-none">
          <span className="font-semibold text-[#c2654d] text-sm sm:text-base tracking-[0.24em]">
            03
          </span>
          <div className="flex-1 h-[1px] bg-stone-300/85" />
          <span className="font-medium text-[10px] sm:text-xs text-stone-500/90 tracking-[0.3em] uppercase">
            GALLERY ARCHIVE
          </span>
        </div>

        {/* 2. SECTION HEADER (Gallery Glimpse + VIEW ALL WORKS —) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-stone-900 tracking-tight leading-[1.1]">
              Gallery Glimpse
            </h2>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 text-stone-700 hover:text-[#c2654d] transition-colors duration-300 w-fit pb-1"
          >
            <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.24em] uppercase">
              VIEW ALL WORKS
            </span>
            <span className="h-[1px] w-6 bg-stone-400 group-hover:w-9 group-hover:bg-[#c2654d] transition-all duration-300" />
          </Link>
        </div>

        {/* 3. INTERACTIVE 3D CIRCULAR WEBGL GALLERY */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-2xl sm:rounded-3xl overflow-hidden select-none">
          <CircularGallery
            items={glimpseItems}
            bend={1.4}
            textColor="#1c1917"
            borderRadius={0.06}
            scrollEase={0.05}
            fontUrl="https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,500;1,600&display=swap"
            font="italic 24px Lora"
            scrollSpeed={2}
          />
        </div>

        {/* 4. INTERACTIVE GESTURE CUE */}
        <div className="flex items-center justify-center gap-2 mt-4 select-none">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.24em] uppercase text-stone-400">
            ← Drag horizontally to rotate archive →
          </span>
        </div>
      </div>
    </section>
  );
}