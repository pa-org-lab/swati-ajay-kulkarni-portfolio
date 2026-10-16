"use client";

import { BsPinAngle } from "react-icons/bs";
import { FiCalendar, FiExternalLink, FiMapPin, FiX } from "react-icons/fi";
import type { AnnouncementItemData } from "@/backend/actions/announcement.action";
import MarkdownRenderer from "@/frontend/components/common/MarkdownRenderer";

interface AnnouncementPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: AnnouncementItemData | null;
}

const CATEGORY_LABELS: Record<string, { label: string; badge: string }> = {
  "classes-workshops": {
    label: "Classes & Workshops",
    badge: "bg-amber-50 text-amber-900 border-amber-200/80",
  },
  exhibitions: {
    label: "Exhibitions",
    badge: "bg-orange-50 text-[#a8522e] border-orange-200/80",
  },
  community: {
    label: "Community Invitations",
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
  },
  general: {
    label: "General Updates",
    badge: "bg-stone-100 text-stone-800 border-stone-200/80",
  },
};

export default function AnnouncementPreviewModal({
  isOpen,
  onClose,
  announcement,
}: AnnouncementPreviewModalProps) {
  if (!isOpen || !announcement) return null;

  const catMeta = CATEGORY_LABELS[announcement.type] || CATEGORY_LABELS.general;

  const formattedEventDate = announcement.eventDate
    ? new Date(announcement.eventDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        className="relative w-full max-w-3xl my-auto bg-[#FAF7F5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-200/80 bg-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-stone-600">
              Live Visitor Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
          {/* Cover image if available */}
          {announcement.coverImage && (
            <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-sm border border-stone-200/80">
              {/* biome-ignore lint/performance/noImgElement: dynamic announcement cover preview */}
              <img
                src={announcement.coverImage}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Badges & Metadata row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider border ${catMeta.badge}`}
            >
              {catMeta.label}
            </span>

            {announcement.isPinned && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-sans font-semibold uppercase tracking-wider bg-[#2b1f18] text-white">
                <BsPinAngle className="w-3 h-3 text-[#BE6030]" />
                <span>Featured / Pinned</span>
              </span>
            )}

            {formattedEventDate && (
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 font-sans px-2.5 py-1 rounded-lg bg-stone-100">
                <FiCalendar className="text-[#BE6030] w-3.5 h-3.5" />
                <span>{formattedEventDate}</span>
              </span>
            )}

            {announcement.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-600 font-sans px-2.5 py-1 rounded-lg bg-stone-100">
                <FiMapPin className="text-[#BE6030] w-3.5 h-3.5" />
                <span>{announcement.location}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h1
              id="preview-modal-title"
              className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight leading-tight"
            >
              {announcement.title}
            </h1>
            <div className="w-12 h-[3px] rounded-full bg-[#BE6030] mt-4" />
          </div>

          {/* Short summary excerpt callout if present */}
          {announcement.summary && (
            <div className="p-4 rounded-xl bg-white/80 border border-stone-200/70 text-sm font-sans text-stone-600 italic leading-relaxed">
              {announcement.summary}
            </div>
          )}

          {/* Rendered Markdown Body */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/70 shadow-2xs">
            <MarkdownRenderer content={announcement.content} />
          </div>

          {/* Call to action link if present */}
          {announcement.link && (
            <div className="pt-4 flex justify-end">
              <a
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BE6030] hover:bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>{announcement.linkText || "Learn More"}</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-stone-200/80 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
