"use client";

import { motion } from "motion/react";
import { FaArrowUpRightFromSquare, FaLocationDot } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import ContactForm from "./ContactForm";
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Direct Contact & Socials */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <motion.h1
                {...fadeUp}
                className="font-serif text-4xl sm:text-5xl lg:text-[60px] font-normal text-stone-900 tracking-[-0.02em] leading-[1.05]"
              >
                Get in touch
              </motion.h1>

              <div className="w-14 h-[3px] rounded-full bg-[#c2654d] mt-5" />

              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.08 }}
                className="mt-6 font-sans font-light text-sm sm:text-base text-stone-600 leading-relaxed max-w-md"
              >
                {contactDetails.availability}. Reach out directly or complete
                the inquiry form to discuss exhibitions, acquisition of prints,
                or bespoke photographic assignments.
              </motion.p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Primary Email */}
              <motion.a
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.12 }}
                href={`mailto:${contactDetails.email}`}
                className="group flex items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.09)] hover:border-stone-300 transition-all duration-500"
              >
                <div className="min-w-0">
                  <span className="block text-[10px] font-sans font-semibold tracking-[0.24em] uppercase text-stone-400">
                    Direct Email
                  </span>
                  <span className="block mt-1.5 font-serif text-base sm:text-lg text-stone-900 truncate group-hover:text-[#c2654d] transition-colors duration-300">
                    {contactDetails.email}
                  </span>
                </div>
                <span className="shrink-0 w-11 h-11 rounded-full bg-stone-900 group-hover:bg-[#c2654d] text-white flex items-center justify-center transition-colors duration-300">
                  <FiMail className="w-4 h-4" />
                </span>
              </motion.a>

              {/* Location Badge */}
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.16 }}
                className="flex items-center gap-3 px-2 text-stone-500"
              >
                <FaLocationDot className="w-3.5 h-3.5 text-[#c2654d]" />
                <span className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase">
                  {contactDetails.location}
                </span>
              </motion.div>
            </div>

            {/* Elsewhere / Social Links */}
            <div>
              <motion.div
                {...fadeUp}
                className="flex items-center gap-4 mb-4 select-none"
              >
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-stone-500">
                  Elsewhere
                </span>
                <div className="flex-1 h-[1px] bg-stone-300/80" />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {socialLinks.slice(0, 4).map((social, index) => {
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
                      className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] hover:border-stone-300 transition-all duration-300"
                    >
                      <span className="shrink-0 w-9 h-9 rounded-full bg-stone-100 group-hover:bg-[#c2654d] text-stone-600 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-sans text-[12.5px] font-semibold text-stone-900 leading-snug">
                          {social.name}
                        </span>
                        <span className="block text-[10.5px] font-sans text-stone-500 truncate">
                          {social.handle}
                        </span>
                      </span>
                      <FaArrowUpRightFromSquare className="shrink-0 w-2.5 h-2.5 text-stone-300 group-hover:text-[#c2654d] transition-colors duration-300" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
