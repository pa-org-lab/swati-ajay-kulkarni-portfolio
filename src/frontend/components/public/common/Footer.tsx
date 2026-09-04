"use client";

import Link from "next/link";
import {
  Fa500Px,
  FaBehance,
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaUnsplash,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
    ariaLabel: "Visit Swati Ajay Kulkarni on Instagram",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    icon: FaPinterestP,
    ariaLabel: "Explore visual moodboards and inspiration on Pinterest",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
    ariaLabel: "Watch art process and expedition journals on YouTube",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com",
    icon: FaXTwitter,
    ariaLabel: "Follow artist updates on X",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
    ariaLabel: "Connect with Swati Ajay Kulkarni on LinkedIn",
  },
  {
    name: "Email",
    href: "mailto:swatiajaykulkarni@gmail.com",
    icon: FaEnvelope,
    ariaLabel: "Send direct inquiry to Swati Ajay Kulkarni via Email",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full bg-[#f4edf2] border-t border-stone-300/80 px-6 py-4 sm:px-10 sm:py-7 lg:px-14 lg:py-6">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
        {/* 1. ARTIST NAME & COPYRIGHT */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-4 text-center lg:text-left">
          <Link
            href="/"
            className="group font-sans text-xs sm:text-md tracking-[0.26em] font-semibold text-stone-900 uppercase hover:text-[#c2654d] transition-colors duration-300"
          >
            SWATI AJAY KULKARNI
          </Link>
          <span className="hidden sm:inline text-stone-300 select-none">·</span>
          <p className="text-[11px] font-sans text-stone-500 tracking-wider">
            &copy; {currentYear} All Rights Reserved
          </p>
        </div>

        {/* 2. SOCIAL MEDIA LINKS TRAY */}
        <nav
          className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5"
          aria-label="Social media profiles"
        >
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                title={social.name}
                className="group relative flex items-center justify-center h-8 w-8 sm:h-8 sm:w-8 rounded-full bg-stone-200/70 hover:bg-stone-900 text-stone-600 hover:text-white border border-stone-300/70 hover:border-stone-900 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <Icon className="text-xs transition-transform duration-300 group-hover:scale-110" />
                {/* Subtle Hover Tooltip */}
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-stone-900 text-white text-[9px] font-sans tracking-widest uppercase px-2 py-0.5 rounded shadow-md whitespace-nowrap z-20">
                  {social.name}
                </span>
              </a>
            );
          })}
        </nav>

        {/* 3. SMOOTH BACK TO TOP ACTION */}
        <div className="flex justify-center lg:justify-end">
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2.5 text-stone-600 hover:text-[#c2654d] transition-colors duration-300 cursor-pointer focus:outline-none"
            aria-label="Scroll to top of the page"
          >
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.24em] uppercase">
              TOP
            </span>
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-stone-200/80 group-hover:bg-[#c2654d] text-stone-700 group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5 text-xs shadow-2xs">
              &uarr;
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
