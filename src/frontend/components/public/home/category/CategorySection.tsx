'use client';

import Link from "next/link";
import AccordionGallery, { AccordionGalleryItem } from "./AccordionGallery";
import type { CategoryData } from "@/backend/actions/category.action";

interface CategorySectionProps {
  categories?: CategoryData[];
}

export default function CategorySection({ categories = [] }: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const categoryItems: AccordionGalleryItem[] = categories.map((cat) => ({
    image: cat.img || "/images/midnight-cosmos.jpg",
    label: cat.name,
    worksCount: `${cat.count} ${cat.count === 1 ? "WORK" : "WORKS"}`,
    description: cat.description || "",
    link: `/gallery?category=${encodeURIComponent(cat.slug)}`,
    alt: cat.alt || `${cat.name} photo collection`,
  }));
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
            overlayColor=""
            textColor="#ffffff"
            // grayscale
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