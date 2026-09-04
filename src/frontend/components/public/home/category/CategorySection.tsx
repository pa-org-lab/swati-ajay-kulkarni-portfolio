'use client';

import Link from "next/link";
import AccordionGallery, { AccordionGalleryItem } from "./AccordionGallery";

const categoryItems: AccordionGalleryItem[] = [
  {
    image: "/images/midnight-cosmos.jpg",
    label: "Painting",
    worksCount: "4 WORKS",
    description: "Vibrant abstract acrylic impasto textures and layered chromatic pigments on raw canvas.",
    link: "/gallery?category=painting",
    alt: "Abstract acrylic impasto painting artwork"
  },
  {
    image: "/images/portrait-ethereal-gaze.jpg",
    label: "Photography",
    worksCount: "5 WORKS",
    description: "Fine art studio portraiture capturing nuanced expressions, ethereal glances, and authentic human spirit.",
    link: "/gallery?category=photography",
    alt: "Fine art studio portrait photography"
  },
  {
    image: "/images/landscape-misty-peaks.jpg",
    label: "Trekking",
    worksCount: "3 WORKS",
    description: "Expedition visual chronicles through misty sunrise ridges, solitary peaks, and raw high-altitude wilderness.",
    link: "/gallery?category=trekking",
    alt: "Mountain trekking and backcountry landscape photography"
  },
  {
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    label: "Cooking",
    worksCount: "6 WORKS",
    description: "Artisan culinary compositions, rustic hearth preparations, and intimate gastronomical storytelling.",
    link: "/gallery?category=cooking",
    alt: "Artisan culinary and gastronomy photography"
  },
  {
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80",
    label: "Gardening",
    worksCount: "4 WORKS",
    description: "Botanical studies, verdant garden foliage, and peaceful morning harmonies with living soil.",
    link: "/gallery?category=gardening",
    alt: "Lush botanical garden and floriculture photography"
  }
];

export default function CategorySection() {
  return (
    <section
      id="collections"
      aria-label="Featured Collections & Categories"
      className="relative w-full bg-[#F6F2F5] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24 xl:px-20 xl:py-28 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* 1. SEPARATOR (Matching reference design: 02 ────── COLLECTIONS) */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans tracking-[0.28em] text-stone-500 mb-8 sm:mb-12 select-none">
          <span className="font-semibold text-[#c2654d] text-sm sm:text-base tracking-[0.24em]">
            02
          </span>
          <div className="flex-1 h-[1px] bg-stone-300/85" />
          <span className="font-medium text-[10px] sm:text-xs text-stone-500/90 tracking-[0.3em] uppercase">
            COLLECTIONS
          </span>
        </div>

        {/* 2. SECTION HEADER (Featured Work + VIEW ALL —) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-stone-900 tracking-tight leading-[1.1]">
              Featured Work
            </h2>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 text-stone-700 hover:text-[#c2654d] transition-colors duration-300 w-fit pb-1"
          >
            <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.24em] uppercase">
              VIEW ALL
            </span>
            <span className="h-[1px] w-6 bg-stone-400 group-hover:w-9 group-hover:bg-[#c2654d] transition-all duration-300" />
          </Link>
        </div>

        {/* 3. RESPONSIVE ANIMATED ACCORDION GALLERY */}
        <div className="w-full">
          <AccordionGallery
            items={categoryItems}
            defaultIndex={0}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#c2654d"
            overlayColor="#0a080e"
            textColor="#ffffff"
            grayscale
            showLabels
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={520}
            gap={14}
            radius={20}
            orientation="horizontal"
          />
        </div>
      </div>
    </section>
  );
}