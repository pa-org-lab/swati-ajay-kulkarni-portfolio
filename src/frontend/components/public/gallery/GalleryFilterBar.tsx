"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { LuSlidersHorizontal } from "react-icons/lu";

export interface GalleryCategoryTab {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export type GallerySortOption = "curated" | "newest" | "oldest" | "title";
export type GalleryLayoutOption = "drift" | "masonry" | "grid";

interface GalleryFilterBarProps {
  categories: GalleryCategoryTab[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  activeSort: GallerySortOption;
  onSelectSort: (sort: GallerySortOption) => void;
  activeLayout: GalleryLayoutOption;
  onSelectLayout: (layout: GalleryLayoutOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function GalleryFilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  activeSort,
  onSelectSort,
  activeLayout,
  onSelectLayout,
  searchQuery,
  onSearchChange,
}: GalleryFilterBarProps) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  return (
    <div className="w-full mb-8 sm:mb-12">
      {/* Top Filter Bar Container */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Capsule Pill Category Filter (Matches Reference Screenshot) */}
        <div className="overflow-x-auto no-scrollbar py-1">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-full border border-stone-200/90 bg-white/75 backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] select-none">
            {categories.map((cat) => {
              const isActive =
                activeCategory.toLowerCase() === cat.slug.toLowerCase();

              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`relative px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/30"
                  }`}
                >
                  {/* Active Taupe Pill Indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-full bg-[#a48879] shadow-xs -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Circular Filter Button + Label (Matches Reference Screenshot) */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`group inline-flex items-center gap-3 cursor-pointer py-1 px-1 rounded-full transition-all duration-200 select-none ${
              filterDrawerOpen ? "text-[#c2654d]" : "text-stone-700"
            }`}
            aria-expanded={filterDrawerOpen}
            aria-label="Toggle gallery display and sort options"
          >
            {/* Circular icon container */}
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                filterDrawerOpen
                  ? "border-[#c2654d] bg-[#c2654d] text-white shadow-xs"
                  : "border-stone-200/90 bg-white/80 group-hover:border-stone-400 group-hover:bg-white text-stone-700 shadow-xs"
              }`}
            >
              <LuSlidersHorizontal className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </div>

            {/* "FILTER" text matching screenshot */}
            <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.24em] uppercase text-stone-800 group-hover:text-stone-950 transition-colors">
              FILTER
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Filter & Sort Settings Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mt-4"
          >
            <div className="p-4 sm:p-6 rounded-2xl border border-stone-200/80 bg-white/85 backdrop-blur-md shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by title, location, or tag..."
                    className="w-full pl-10 pr-9 py-2.5 text-xs font-sans bg-stone-50/70 rounded-full border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-colors placeholder:text-stone-400 text-stone-800"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] text-stone-400 uppercase">
                    SORT:
                  </span>
                  <div className="inline-flex rounded-full border border-stone-200/90 p-1 bg-stone-50/70">
                    {(
                      [
                        { label: "CURATED", val: "curated" },
                        { label: "NEWEST", val: "newest" },
                        { label: "OLDEST", val: "oldest" },
                        { label: "TITLE A-Z", val: "title" },
                      ] as const
                    ).map((sort) => (
                      <button
                        key={sort.val}
                        type="button"
                        onClick={() => onSelectSort(sort.val)}
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.18em] font-medium uppercase transition-colors cursor-pointer ${
                          activeSort === sort.val
                            ? "bg-stone-900 text-white font-semibold"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Switcher */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] text-stone-400 uppercase">
                    VIEW:
                  </span>
                  <div className="inline-flex rounded-full border border-stone-200/90 p-1 bg-stone-50/70">
                    <button
                      type="button"
                      onClick={() => onSelectLayout("drift")}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.18em] font-medium uppercase transition-colors cursor-pointer ${
                        activeLayout === "drift"
                          ? "bg-stone-900 text-white font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      DRIFT 3D
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectLayout("masonry")}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.18em] font-medium uppercase transition-colors cursor-pointer ${
                        activeLayout === "masonry"
                          ? "bg-stone-900 text-white font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      MASONRY
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectLayout("grid")}
                      className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.18em] font-medium uppercase transition-colors cursor-pointer ${
                        activeLayout === "grid"
                          ? "bg-stone-900 text-white font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      GRID
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
