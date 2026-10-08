"use client";

import { motion } from "motion/react";
import { FaArrowUpRightFromSquare, FaLocationDot } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { contactDetails, socialLinks } from "./contact.data";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function ContactSection() {
  return (
    <section
      aria-label="Contact Swati Ajay Kulkarni"
      className="relative w-full bg-[#FAF7F5] min-h-screen pt-28 sm:pt-32 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-14 xl:px-20"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Separator */}
        {/* <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12 select-none">
          <span className="font-sans font-semibold text-[#c2654d] text-sm tracking-[0.24em]">
            01
          </span>
          <div className="flex-1 h-[1px] bg-stone-300/85" />
          <span className="font-sans font-medium text-[10px] sm:text-xs text-stone-500/90 tracking-[0.3em] uppercase">
            CONTACT
          </span>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-start">
          {/* Left: heading and direct contact */}
          <div>
            <motion.h1
              {...fadeUp}
              className="font-serif text-4xl sm:text-5xl lg:text-[64px] font-normal text-stone-900 tracking-[-0.02em] leading-[1.05]"
            >
              Get in touch
            </motion.h1>

            <div className="w-14 h-[3px] rounded-full bg-[#c2654d] mt-5" />

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="mt-7 font-sans font-light text-sm sm:text-base text-stone-600 leading-relaxed max-w-md"
            >
              {contactDetails.availability}.
            </motion.p>

            {/* Primary email */}
            <motion.a
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.12 }}
              href={`mailto:${contactDetails.email}`}
              className="group mt-10 flex items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09)] hover:border-stone-300 transition-all duration-500"
            >
              <div className="min-w-0">
                <span className="block text-[10px] font-sans font-semibold tracking-[0.24em] uppercase text-stone-400">
                  Email
                </span>
                <span className="block mt-1.5 font-serif text-lg sm:text-xl text-stone-900 truncate group-hover:text-[#c2654d] transition-colors duration-300">
                  {contactDetails.email}
                </span>
              </div>
              <span className="shrink-0 w-11 h-11 rounded-full bg-stone-900 group-hover:bg-[#c2654d] text-white flex items-center justify-center transition-colors duration-300">
                <FiMail className="w-4 h-4" />
              </span>
            </motion.a>

            {/* Location */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.16 }}
              className="mt-6 flex items-center gap-3 text-stone-500"
            >
              <FaLocationDot className="w-3.5 h-3.5 text-[#c2654d]" />
              <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase">
                {contactDetails.location}
              </span>
            </motion.div>
          </div>

          {/* Right: social platforms */}
          <div>
            <motion.div
              {...fadeUp}
              className="flex items-center gap-4 mb-6 select-none"
            >
              <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-stone-500">
                Elsewhere
              </span>
              <div className="flex-1 h-[1px] bg-stone-300/80" />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Swati Ajay Kulkarni on ${social.name}`}
                    className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09)] hover:border-stone-300 transition-all duration-500"
                  >
                    <span className="shrink-0 w-10 h-10 rounded-full bg-stone-100 group-hover:bg-[#c2654d] text-stone-600 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-[13px] font-semibold text-stone-900">
                        {social.name}
                      </span>
                      <span className="block text-[11px] font-sans text-stone-500 truncate">
                        {social.handle}
                      </span>
                    </span>
                    <FaArrowUpRightFromSquare className="shrink-0 w-3 h-3 text-stone-300 group-hover:text-[#c2654d] transition-colors duration-300" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
