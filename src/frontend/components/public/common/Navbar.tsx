"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "GALLERY", href: "/gallery" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-xs border-b border-stone-200/60 py-3.5 pointer-events-auto"
            : "bg-transparent py-6 sm:py-8 lg:py-10 pointer-events-none"
        }`}
      >
        <div className="mx-auto w-full px-6 sm:px-10 lg:px-12 flex justify-between items-center">
          {/* Logo / Artist Name */}
          <Link
            href="/"
            className="pointer-events-auto group flex items-center focus:outline-none"
          >
            <span
              className={`font-sans text-[11px] sm:text-xs tracking-[0.26em] font-semibold uppercase transition-colors duration-300 ${
                scrolled
                  ? "text-stone-900"
                  : "text-stone-900/95 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
              }`}
            >
              SWATI AJAY KULKARNI
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="pointer-events-auto hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.24em] transition-colors duration-300 py-1 ${
                    scrolled
                      ? isActive
                        ? "text-stone-950 font-semibold"
                        : "text-stone-600 hover:text-stone-950"
                      : isActive
                        ? "text-stone-950 font-semibold"
                        : "text-stone-700 hover:text-stone-950"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="pointer-events-auto md:hidden p-2 -mr-2 rounded-lg text-stone-900 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-stone-900 transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-stone-900 transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-stone-900 transition-transform duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-x-0 top-0 z-40 bg-[#F6F2F5]/98 backdrop-blur-lg pt-24 pb-8 px-6 shadow-xl border-b border-stone-200 md:hidden flex flex-col gap-5"
          >
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-sans tracking-[0.25em] font-medium text-stone-800 hover:text-[#c2654d] py-2 border-b border-stone-200/50"
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
