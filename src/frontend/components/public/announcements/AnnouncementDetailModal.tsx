"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { BsPinAngle } from "react-icons/bs";
import {
  FiCalendar,
  FiExternalLink,
  FiMapPin,
  FiShare2,
  FiX,
} from "react-icons/fi";
import type { AnnouncementItemData } from "@/backend/actions/announcement.action";
import MarkdownRenderer from "@/frontend/components/common/MarkdownRenderer";

interface AnnouncementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: AnnouncementItemData | null;
}

const CATEGORY_META: Record<
  string,
  { label: string; badge: string; accent: string }
> = {
  "classes-workshops": {
    label: "Classes & Workshops",
    badge: "bg-amber-50 text-amber-900 border-amber-200/80",
    accent: "text-amber-700",
  },
  exhibitions: {
    label: "Exhibitions",
    badge: "bg-orange-50 text-[#a8522e] border-orange-200/80",
    accent: "text-[#a8522e]",
  },
  community: {
    label: "Community Invitations",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
    accent: "text-emerald-700",
  },
  general: {
    label: "General Updates",
    badge: "bg-stone-100 text-stone-800 border-stone-200/80",
    accent: "text-stone-700",
  },
};

export default function AnnouncementDetailModal({
  isOpen,
  onClose,
  announcement,
}: AnnouncementDetailModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !announcement) return null;

  const cat = CATEGORY_META[announcement.type] || CATEGORY_META.general;

  const formattedEventDate = announcement.eventDate
    ? new Date(announcement.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/announcements#${announcement.slug}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-announcement-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        aria-label="Close modal overlay"
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm -z-10 cursor-default focus:outline-none"
      />

      {/* Modal Dialog Content Container */}
      <div className="relative w-full max-w-3xl my-auto bg-[#FAF7F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 bg-white/90 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-0.5 rounded-full text-[10.5px] font-sans font-semibold uppercase tracking-wider border ${cat.badge}`}
            >
              {cat.label}
            </span>
            {announcement.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-semibold uppercase tracking-wider bg-[#2b1f18] text-white">
                <BsPinAngle className="w-3 h-3 text-[#BE6030]" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              title="Copy link to announcement"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <FiShare2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Announcement Reading Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
          {/* Banner / Poster Cover Image */}
          {announcement.coverImage && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
              {/* biome-ignore lint/performance/noImgElement: dynamic user-authored cover */}
              <img
                src={announcement.coverImage}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Accent */}
          <div>
            <h1
              id="modal-announcement-title"
              className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight leading-tight"
            >
              {announcement.title}
            </h1>
            <div className="w-14 h-[3px] rounded-full bg-[#c2654d] mt-4" />
          </div>

          {/* Date & Location Pill Highlights */}
          {(formattedEventDate || announcement.location) && (
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
              {formattedEventDate && (
                <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm font-sans">
                  <span className="w-8 h-8 rounded-full bg-amber-50 text-[#BE6030] flex items-center justify-center shrink-0">
                    <FiCalendar className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Event Date
                    </span>
                    <span className="font-medium text-stone-800">
                      {formattedEventDate}
                    </span>
                  </div>
                </div>
              )}

              {formattedEventDate && announcement.location && (
                <div className="hidden sm:block h-8 w-[1px] bg-stone-200" />
              )}

              {announcement.location && (
                <div className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm font-sans">
                  <span className="w-8 h-8 rounded-full bg-orange-50 text-[#a8522e] flex items-center justify-center shrink-0">
                    <FiMapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      Location / Venue
                    </span>
                    <span className="font-medium text-stone-800">
                      {announcement.location}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Short Excerpt highlight */}
          {announcement.summary && (
            <div className="p-4 rounded-xl bg-white/70 border-l-4 border-[#c2654d] text-stone-600 font-sans italic text-sm leading-relaxed">
              {announcement.summary}
            </div>
          )}

          {/* Full Markdown Rendered Content */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-2xs">
            <MarkdownRenderer content={announcement.content} />
          </div>

          {/* Action / Registration CTA button */}
          {announcement.link && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-stone-100 border border-stone-200/80">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Ready to participate?
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  Follow the external link to RSVP, register or learn more.
                </span>
              </div>
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BE6030] hover:bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer shrink-0"
              >
                <span>{announcement.linkText || "Register Now"}</span>
                <FiExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200/80 bg-white">
          <span className="text-[11px] font-sans text-stone-400">
            Published on{" "}
            {new Date(announcement.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
