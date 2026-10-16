"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { BsPinAngle } from "react-icons/bs";
import {
  FiArrowRight,
  FiCalendar,
  FiExternalLink,
  FiInbox,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";
import type { AnnouncementItemData } from "@/backend/actions/announcement.action";
import MarkdownRenderer from "@/frontend/components/common/MarkdownRenderer";
import AnnouncementDetailModal from "./AnnouncementDetailModal";

interface AnnouncementsSectionProps {
  initialAnnouncements: AnnouncementItemData[];
}

const CATEGORY_TABS = [
  { id: "all", label: "All Gatherings" },
  { id: "classes-workshops", label: "Classes & Workshops" },
  { id: "exhibitions", label: "Exhibitions" },
  { id: "community", label: "Community Invitations" },
  { id: "general", label: "General News" },
] as const;

const CATEGORY_STYLES: Record<
  string,
  { label: string; badge: string; accentBorder: string }
> = {
  "classes-workshops": {
    label: "Workshop",
    badge: "bg-amber-50 text-amber-900 border-amber-200/80",
    accentBorder: "border-amber-400",
  },
  exhibitions: {
    label: "Exhibition",
    badge: "bg-orange-50 text-[#a8522e] border-orange-200/80",
    accentBorder: "border-[#a8522e]",
  },
  community: {
    label: "Community",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
    accentBorder: "border-emerald-400",
  },
  general: {
    label: "Announcement",
    badge: "bg-stone-100 text-stone-800 border-stone-200/80",
    accentBorder: "border-stone-400",
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function AnnouncementsSection({
  initialAnnouncements,
}: AnnouncementsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItemData | null>(null);

  // Filter announcements by category & search query
  const filteredAnnouncements = useMemo(() => {
    return initialAnnouncements.filter((item) => {
      const matchesCategory =
        activeTab === "all" ? true : item.type === activeTab;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialAnnouncements, activeTab, searchQuery]);

  // Separate pinned announcement if viewing "all" with no active search
  const pinnedAnnouncement = useMemo(() => {
    if (activeTab !== "all" || searchQuery.trim()) return null;
    return filteredAnnouncements.find((item) => item.isPinned) || null;
  }, [filteredAnnouncements, activeTab, searchQuery]);

  // Remaining list
  const listAnnouncements = useMemo(() => {
    if (pinnedAnnouncement) {
      return filteredAnnouncements.filter(
        (item) => item._id !== pinnedAnnouncement._id,
      );
    }
    return filteredAnnouncements;
  }, [filteredAnnouncements, pinnedAnnouncement]);

  return (
    <section
      aria-label="Announcements, Workshops and Exhibitions"
      className="relative w-full bg-[#FAF7F5] min-h-screen pt-28 sm:pt-32 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-14 xl:px-20"
    >
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* 1. Page Header */}
        <div className=" space-y-4">
          {/* <motion.div {...fadeUp} className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-[#c2654d]">
              Announcements & Gatherings
            </span>
          </motion.div> */}

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="font-serif text-4xl sm:text-5xl lg:text-[60px] font-normal text-stone-900 tracking-[-0.02em] leading-[1.05]"
          >
            Classes, Exhibitions & Gatherings
          </motion.h1>

          {/* <div className="w-14 h-[3px] rounded-full bg-[#c2654d]" /> */}

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="font-sans font-light text-sm sm:text-base text-stone-600 leading-relaxed pt-1"
          >
            Explore upcoming photography masterclasses, gallery exhibitions,
            artist talks, and community invitations. All workshop notes,
            itineraries, and details are shared below.
          </motion.p>
        </div>

        {/* 2. Filter Tabs & Search Bar */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-2 border-b border-stone-200/80 pb-6"
        >
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const count =
                tab.id === "all"
                  ? initialAnnouncements.length
                  : initialAnnouncements.filter((a) => a.type === tab.id)
                      .length;

              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#2b1f18] text-white shadow-xs font-semibold"
                      : "bg-white/80 hover:bg-white text-stone-600 hover:text-stone-950 border border-stone-200/80"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-stone-200/80 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c2654d]/20 focus:border-[#c2654d] shadow-2xs"
            />
          </div>
        </motion.div>

        {/* 3. Featured / Pinned Announcement Banner (if available) */}
        {pinnedAnnouncement && (
          <motion.div
            {...fadeUp}
            className="group relative rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.1)] transition-all duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Cover Image */}
              {pinnedAnnouncement.coverImage && (
                <div className="lg:col-span-5 h-64 sm:h-80 w-full rounded-2xl overflow-hidden relative shadow-2xs">
                  {/* biome-ignore lint/performance/noImgElement: user dynamic banner */}
                  <img
                    src={pinnedAnnouncement.coverImage}
                    alt={pinnedAnnouncement.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-sans font-semibold uppercase tracking-wider bg-[#2b1f18]/90 text-white backdrop-blur-xs">
                    <BsPinAngle className="text-[#c2654d] w-3 h-3" />
                    <span>Featured Gathering</span>
                  </div>
                </div>
              )}

              {/* Information */}
              <div
                className={`${
                  pinnedAnnouncement.coverImage
                    ? "lg:col-span-7"
                    : "lg:col-span-12"
                } space-y-4`}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider border ${
                      CATEGORY_STYLES[pinnedAnnouncement.type]?.badge ||
                      CATEGORY_STYLES.general.badge
                    }`}
                  >
                    {CATEGORY_STYLES[pinnedAnnouncement.type]?.label ||
                      "Announcement"}
                  </span>

                  {pinnedAnnouncement.eventDate && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 font-sans">
                      <FiCalendar className="text-[#c2654d] w-3.5 h-3.5" />
                      <span>
                        {new Date(
                          pinnedAnnouncement.eventDate,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  )}

                  {pinnedAnnouncement.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 font-sans">
                      <FiMapPin className="text-[#c2654d] w-3.5 h-3.5" />
                      <span>{pinnedAnnouncement.location}</span>
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-normal leading-tight group-hover:text-[#c2654d] transition-colors duration-300">
                  {pinnedAnnouncement.title}
                </h2>

                {pinnedAnnouncement.summary ? (
                  <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {pinnedAnnouncement.summary}
                  </p>
                ) : (
                  <div className="line-clamp-3 text-stone-600 text-sm font-sans">
                    <MarkdownRenderer content={pinnedAnnouncement.content} />
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedAnnouncement(pinnedAnnouncement)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2b1f18] hover:bg-[#c2654d] text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shadow-sm cursor-pointer"
                  >
                    <span>Read Full Details</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>

                  {pinnedAnnouncement.link && (
                    <a
                      href={pinnedAnnouncement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold tracking-wider uppercase text-stone-700 hover:text-[#c2654d] transition-colors"
                    >
                      <span>
                        {pinnedAnnouncement.linkText || "External Link"}
                      </span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Announcements Grid */}
        {listAnnouncements.length === 0 && !pinnedAnnouncement ? (
          <div className="py-20 text-center space-y-4 rounded-3xl bg-white/60 border border-stone-200/80 p-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <FiInbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-stone-800">
                No announcements to display
              </h3>
              <p className="font-sans text-sm text-stone-500 max-w-md mx-auto mt-1">
                {searchQuery
                  ? `No announcements matching "${searchQuery}". Try a different keyword.`
                  : "New workshops, masterclasses, and exhibitions will be posted here soon. Please check back shortly!"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {listAnnouncements.map((item, idx) => {
              const style =
                CATEGORY_STYLES[item.type] || CATEGORY_STYLES.general;

              const formattedDate = item.eventDate
                ? new Date(item.eventDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : null;

              return (
                <motion.article
                  key={item._id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: idx * 0.05 }}
                  onClick={() => setSelectedAnnouncement(item)}
                  className="group flex flex-col justify-between bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_2px_14px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:border-stone-300 transition-all duration-400 cursor-pointer"
                >
                  {/* Card Cover (if available) */}
                  {item.coverImage && (
                    <div className="h-48 w-full overflow-hidden relative">
                      {/* biome-ignore lint/performance/noImgElement: dynamic announcement image */}
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta Pill Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-semibold uppercase tracking-wider border ${style.badge}`}
                        >
                          {style.label}
                        </span>

                        {formattedDate && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-sans">
                            <FiCalendar className="text-[#c2654d] w-3 h-3" />
                            <span>{formattedDate}</span>
                          </span>
                        )}

                        {item.location && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 font-sans truncate max-w-[160px]">
                            <FiMapPin className="text-[#c2654d] w-3 h-3" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Card Title */}
                      <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug group-hover:text-[#c2654d] transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Summary or Markdown Preview */}
                      {item.summary ? (
                        <p className="font-sans font-light text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>
                      ) : (
                        <div className="font-sans font-light text-stone-600 text-xs line-clamp-3">
                          <MarkdownRenderer content={item.content} />
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
                      <span className="font-semibold uppercase tracking-wider text-stone-800 group-hover:text-[#c2654d] transition-colors flex items-center gap-1.5">
                        <span>Details & Schedule</span>
                        <FiArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>

                      {item.link && (
                        <span className="text-stone-400 text-[11px] flex items-center gap-1">
                          <span>{item.linkText || "RSVP"}</span>
                          <FiExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Reading Detail Modal */}
      <AnnouncementDetailModal
        isOpen={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        announcement={selectedAnnouncement}
      />
    </section>
  );
}
