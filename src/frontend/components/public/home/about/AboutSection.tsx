"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Swati Ajay Kulkarni"
      className="relative w-full bg-[#F6F2F5] px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24 xl:px-20 xl:py-28 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* 1. SEPARATOR (Matching reference theme: 04 ─────── THE ARTIST) */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans tracking-[0.28em] text-stone-500 mb-8 sm:mb-12 select-none">
          <span className="font-semibold text-[#c2654d] text-sm sm:text-base tracking-[0.24em]">
            04
          </span>
          <div className="flex-1 h-[1px] bg-stone-300/85" />
          <span className="font-medium text-[10px] sm:text-xs text-stone-500/90 tracking-[0.3em] uppercase">
            THE ARTIST
          </span>
        </div>

        {/* 2. SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <h2 className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-stone-900 tracking-tight leading-[1.1]">
              Capturing the Unspoken
            </h2>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 text-stone-700 hover:text-[#c2654d] transition-colors duration-300 w-fit pb-1"
          >
            <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-[0.24em] uppercase">
              VIEW ARCHIVE
            </span>
            <span className="h-[1px] w-6 bg-stone-400 group-hover:w-9 group-hover:bg-[#c2654d] transition-all duration-300" />
          </Link>
        </div>

        {/* 3. EDITORIAL GRID: LARGE IMAGE + NARRATIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* LEFT: LARGE ARTIST PORTRAIT SHOWCASE */}
          <div className="lg:col-span-6 xl:col-span-5 relative group">
            {/* Subtle decorative background offset border frame */}
            <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-2xl sm:rounded-3xl border border-stone-300/70 translate-x-2 translate-y-2 -z-10 transition-transform duration-500 group-hover:translate-x-3.5 group-hover:translate-y-3.5" />

            {/* Main Image Container */}
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-200 shadow-xl shadow-stone-900/8 border border-stone-200/80">
              <Image
                src="/images/about-artist.jpg"
                alt="Swati Ajay Kulkarni in her studio with camera and paintings"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 45vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority={false}
              />

              {/* Gradient Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

              {/* Glassmorphism Artist Info Tag */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F6F2F5]/85 backdrop-blur-md border border-white/70 shadow-lg text-stone-900 flex items-center justify-between transition-transform duration-300 group-hover:-translate-y-1">
                <div>
                  <h3 className="font-serif italic font-medium text-base sm:text-lg text-stone-900">
                    Swati Ajay Kulkarni
                  </h3>
                  <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-stone-600 font-medium">
                    Visual Artist & Photographer
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] tracking-[0.22em] font-sans font-semibold uppercase text-[#c2654d]">
                    STUDIO ARCHIVE
                  </span>
                  <span className="text-[10px] font-sans text-stone-500 tracking-wider">
                    Pune · Worldwide
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: EDITORIAL STORY & CREDENTIALS */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">
            {/* Pull Quote */}
            <div className="border-l-2 border-[#c2654d] pl-5 sm:pl-6 mb-6 sm:mb-7">
              <blockquote className="font-serif italic text-lg sm:text-xl lg:text-2xl text-stone-800 leading-relaxed font-normal">
                &ldquo;Photography and painting are two dialects of the same
                silent language &mdash; one captures what is fleeting, while the
                other gives form to what lingers.&rdquo;
              </blockquote>
            </div>

            {/* Concise Narrative Body */}
            <div className="text-stone-600 font-sans font-light text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              <p>
                Swati Ajay Kulkarni is an Indian visual artist and photographer
                bridging fine art portraiture, tactile impasto painting, and
                wilderness chronicles. Grounded in organic texture and natural
                light, her work explores raw emotion and the quiet dialogue
                between memory and the canvas.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-stone-300/80 select-none">
              <div>
                <span className="block font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  10+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-stone-500 mt-1">
                  Years of Craft
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  500+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-stone-500 mt-1">
                  Curated Works
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                  15+
                </span>
                <span className="block text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-stone-500 mt-1">
                  Exhibitions
                </span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl text-[#c2654d] font-normal">
                  5
                </span>
                <span className="block text-[10px] sm:text-[11px] font-sans tracking-[0.2em] uppercase text-stone-500 mt-1">
                  Disciplines
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
