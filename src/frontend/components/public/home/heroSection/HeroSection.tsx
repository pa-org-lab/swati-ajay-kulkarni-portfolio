"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import HeroThumbnail, { type HeroSlideItem } from "./HeroThumbnail";

const heroSlides: HeroSlideItem[] = [
  {
    id: "1",
    src: "/images/midnight-cosmos.jpg",
    alt: "Vibrant abstract acrylic impasto painting on canvas with yellow, orange, and turquoise palette knife textures",
    title: "Midnight Cosmos",
    category: "PAINTING",
    year: "2024",
  },
  {
    id: "2",
    src: "/images/portrait-ethereal-gaze.jpg",
    alt: "Fine art studio portrait of a woman with bangs and striking expressive green hazel eyes",
    title: "Ethereal Gaze",
    category: "PORTRAIT",
    year: "2024",
  },
  {
    id: "3",
    src: "/images/landscape-misty-peaks.jpg",
    alt: "Cinematic misty mountain peaks bathed in golden morning sunrise light",
    title: "Misty Peaks",
    category: "LANDSCAPE",
    year: "2024",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1800&q=85",
    alt: "Historic bridge and cathedral architecture along the river in Rome",
    title: "Echoes of Rome",
    category: "ARCHITECTURE",
    year: "2023",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1800&q=85",
    alt: "Expressive fine art oil painting texture with vibrant chromatic brushstrokes",
    title: "Chromatic Rhythm",
    category: "PAINTING",
    year: "2024",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1604511482975-49278f591bf4?auto=format&fit=crop&w=1800&q=85",
    alt: "Golden hour grassy field with soft warm sunset backlight",
    title: "Golden Whispers",
    category: "LANDSCAPE",
    year: "2024",
  },
  {
    id: "7",
    src: "https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?auto=format&fit=crop&w=1800&q=85",
    alt: "Worm's-eye architectural view of clean modern concrete geometry",
    title: "Brutalist Angles",
    category: "ARCHITECTURE",
    year: "2023",
  },
  {
    id: "8",
    src: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=1800&q=85",
    alt: "High-contrast black and white fine art studio portrait",
    title: "Serenade in Monochrome",
    category: "PORTRAIT",
    year: "2024",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  }, []);

  // Auto-advance with hover pause
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(handleNext, 5500);
    return () => clearInterval(interval);
  }, [isHovered, handleNext]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Upcoming 2 thumbnails
  const nextItems = [
    {
      item: heroSlides[(activeIndex + 1) % heroSlides.length],
      targetIndex: (activeIndex + 1) % heroSlides.length,
    },
    {
      item: heroSlides[(activeIndex + 2) % heroSlides.length],
      targetIndex: (activeIndex + 2) % heroSlides.length,
    },
  ];

  const currentNumStr = (activeIndex + 1).toString().padStart(2, "0");

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX < -50) handleNext();
    if (deltaX > 50) handlePrev();
    setTouchStartX(null);
  };

  return (
    <section
      aria-label="Featured Works Carousel"
      className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#F6F2F5]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* LEFT COLUMN: Featured Artwork Canvas (58% - 60% on desktop) */}
      <div className="w-full lg:w-[58%] xl:w-[60%] h-[55vh] sm:h-[60vh] lg:h-screen min-h-[380px] lg:min-h-[720px] relative">
        <HeroCarousel
          activeItem={heroSlides[activeIndex]}
          activeIndex={activeIndex}
          totalSlides={heroSlides.length}
          onSelectIndex={setActiveIndex}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>

      {/* RIGHT COLUMN: Luxury Editorial Content (42% - 40% on desktop) */}
      <div className="w-full lg:w-[42%] xl:w-[40%] flex-1 lg:h-screen min-h-[440px] lg:min-h-[720px] bg-[#F6F2F5] relative flex flex-col justify-between px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:pt-24 lg:pb-10 xl:px-16 xl:pt-28 xl:pb-12">
        {/* Giant Watermark Numeral */}
        <div className="absolute top-6 sm:top-8 lg:top-14 xl:top-16 left-6 sm:left-10 lg:left-12 xl:left-16 pointer-events-none select-none overflow-hidden h-32 sm:h-44 lg:h-56 xl:h-64">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentNumStr}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block font-serif font-light text-[115px] sm:text-[150px] lg:text-[185px] xl:text-[220px] text-[#eddfe2]/85 leading-none tracking-tight"
            >
              {currentNumStr}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Central Editorial Text Block */}
        <div className="relative z-10 my-auto pt-10 sm:pt-14 lg:pt-8 xl:pt-12">
          {/* Tagline / Category & Date */}
          <div className="flex items-center gap-2 mb-3.5 sm:mb-4.5">
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.26em] uppercase text-[#c2654d]">
              VISUAL ARCHIVE · 2024
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] text-stone-900 leading-[1.12] tracking-tight font-normal">
            Stories
            <br />
            told through
            <br />
            <span className="italic font-normal">images.</span>
          </h1>

          {/* Subtitle / Description with Left Accent Line */}
          <div className="border-l border-stone-300 pl-4 sm:pl-5 my-5 sm:my-6 max-w-sm lg:max-w-md">
            <p className="text-stone-600 text-xs sm:text-sm md:text-[14px] xl:text-[15px] leading-relaxed font-sans font-light">
              An evolving collection of paintings, portraits, places and visual
              moments.
            </p>
          </div>

          {/* CTA Link */}
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 text-stone-900 hover:text-[#c2654d] transition-colors duration-300 cursor-pointer w-fit"
          >
            <span className="h-[1px] w-6 bg-stone-900 transition-all duration-300 group-hover:w-9 group-hover:bg-[#c2654d]" />
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.24em] uppercase">
              EXPLORE GALLERY
            </span>
          </Link>
        </div>

        {/* Bottom Area: Upcoming Thumbnails */}
        <div className="relative z-10 pt-8 lg:pt-4 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <HeroThumbnail nextItems={nextItems} onSelect={setActiveIndex} />
          </div>
        </div>

        {/* Vertical SCROLL Indicator (Desktop right edge) */}
        <div className="hidden xl:flex flex-col items-center gap-2.5 absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="text-[9px] font-sans tracking-[0.32em] uppercase text-stone-400 [writing-mode:vertical-rl] rotate-180">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-stone-300 rounded-full"
          />
        </div>

        {/* Floating Help / Info Button (?) */}
        <button
          type="button"
          onClick={() => setShowInfoModal(true)}
          className="fixed bottom-6 right-6 z-40 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-stone-900 text-white flex items-center justify-center font-sans text-xs font-semibold shadow-lg hover:bg-stone-800 hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
          aria-label="About the Artist & Navigation Shortcuts"
        >
          ?
        </button>
      </div>

      {/* Info / Quick Guide Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-[#F6F2F5] p-6 sm:p-8 rounded-2xl shadow-2xl border border-stone-200"
            >
              <div className="flex items-start justify-between pb-4 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#c2654d]">
                    SWATI AJAY KULKARNI
                  </span>
                  <h3 className="font-serif italic text-xl text-stone-900 mt-0.5">
                    Visual Archive
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="text-stone-400 hover:text-stone-900 text-lg p-1 -mr-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                <p>
                  Welcome to the curated portfolio of Swati Ajay Kulkarni,
                  exploring artistic expressions through paintings, portraits,
                  and photography.
                </p>
                <div className="pt-2">
                  <span className="font-semibold text-stone-800 block mb-1">
                    Keyboard Shortcuts:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-500">
                    <li>
                      <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[11px] font-mono">
                        ←
                      </kbd>{" "}
                      /{" "}
                      <kbd className="px-1.5 py-0.5 bg-stone-200 rounded text-[11px] font-mono">
                        →
                      </kbd>{" "}
                      : Previous / Next slide
                    </li>
                    <li>Hover over carousel to pause auto-advance</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-sans tracking-widest uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
