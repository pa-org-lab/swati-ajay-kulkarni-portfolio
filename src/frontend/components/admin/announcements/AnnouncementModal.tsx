"use client";

import type React from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsPinAngle } from "react-icons/bs";
import {
  FiCalendar,
  FiCheck,
  FiExternalLink,
  FiImage,
  FiMapPin,
  FiType,
  FiX,
} from "react-icons/fi";
import {
  type AnnouncementItemData,
  createAnnouncementAction,
  updateAnnouncementAction,
} from "@/backend/actions/announcement.action";
import type { AnnouncementFormData } from "@/backend/schemas/announcement.schema";
import MarkdownEditor from "./MarkdownEditor";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: AnnouncementItemData | null;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = [
  {
    value: "classes-workshops",
    label: "Classes & Workshops",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    description: "Hands-on tutorials, masterclasses, and photography courses",
  },
  {
    value: "exhibitions",
    label: "Exhibitions",
    badgeColor: "bg-orange-100 text-[#a8522e] border-orange-300",
    description:
      "Solo & group gallery shows, retrospectives, and print showcases",
  },
  {
    value: "community",
    label: "Community Invitations",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description: "Photowalks, print exchanges, artist talks, and meetups",
  },
  {
    value: "general",
    label: "General Updates",
    badgeColor: "bg-stone-100 text-stone-800 border-stone-300",
    description: "Studio news, magazine features, and general announcements",
  },
] as const;

export default function AnnouncementModal({
  isOpen,
  onClose,
  announcement,
  onSuccess,
}: AnnouncementModalProps) {
  const isEditing = Boolean(announcement);

  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: "",
    type: "classes-workshops",
    content: "",
    summary: "",
    coverImage: "",
    eventDate: "",
    location: "",
    link: "",
    linkText: "Register Now",
    status: "published",
    isPinned: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize state when modal opens or editing item changes
  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        type: announcement.type || "classes-workshops",
        content: announcement.content || "",
        summary: announcement.summary || "",
        coverImage: announcement.coverImage || "",
        eventDate: announcement.eventDate
          ? new Date(announcement.eventDate).toISOString().slice(0, 16)
          : "",
        location: announcement.location || "",
        link: announcement.link || "",
        linkText: announcement.linkText || "Register Now",
        status: announcement.status || "published",
        isPinned: Boolean(announcement.isPinned),
      });
    } else {
      setFormData({
        title: "",
        type: "classes-workshops",
        content: "",
        summary: "",
        coverImage: "",
        eventDate: "",
        location: "",
        link: "",
        linkText: "Register Now",
        status: "published",
        isPinned: false,
      });
    }
  }, [announcement]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title for the announcement");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please provide markdown content for the announcement");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        eventDate: formData.eventDate
          ? new Date(formData.eventDate).toISOString()
          : "",
      };

      let res: { success: boolean; message?: string; error?: string };
      if (isEditing && announcement?._id) {
        res = await updateAnnouncementAction(announcement._id, payload);
      } else {
        res = await createAnnouncementAction(payload);
      }

      if (res.success) {
        toast.success(res.message || "Announcement saved successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(res.error || "Failed to save announcement");
      }
    } catch (err) {
      console.error("Save announcement error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
        className="relative w-full max-w-5xl my-auto bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FAF7F5]">
          <div>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.24em] text-[#BE6030]">
              {isEditing ? "Edit Announcement" : "Create New Announcement"}
            </span>
            <h2
              id="announcement-modal-title"
              className="font-serif text-xl sm:text-2xl text-stone-900 font-normal mt-0.5"
            >
              {isEditing ? announcement?.title : "Craft Announcement & Event"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* 1. Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Title */}
            <div className="md:col-span-8">
              <label
                htmlFor="announcement-title"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="announcement-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Masterclass in Monochrome Portraiture & Visual Flow"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030] text-sm"
              />
            </div>

            {/* Category / Type */}
            <div className="md:col-span-4">
              <label
                htmlFor="announcement-type"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="announcement-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as AnnouncementFormData["type"],
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030] text-sm"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Event Date, Location, and Registration Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Event Date */}
            <div>
              <label
                htmlFor="announcement-event-date"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5"
              >
                <FiCalendar className="text-[#BE6030]" />
                <span>Event Date & Time</span>
              </label>
              <input
                id="announcement-event-date"
                type="datetime-local"
                value={formData.eventDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventDate: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Leave empty for ongoing/general updates
              </span>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="announcement-location"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5"
              >
                <FiMapPin className="text-[#BE6030]" />
                <span>Location / Venue</span>
              </label>
              <input
                id="announcement-location"
                type="text"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g. Jehangir Art Gallery, Mumbai or Zoom"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
              />
            </div>

            {/* External Registration Link */}
            <div>
              <label
                htmlFor="announcement-link"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5"
              >
                <FiExternalLink className="text-[#BE6030]" />
                <span>Action / RSVP Link</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="announcement-link"
                  type="url"
                  value={formData.link || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
                />
                <input
                  type="text"
                  value={formData.linkText || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkText: e.target.value,
                    }))
                  }
                  placeholder="Button Label"
                  title="Button Label"
                  className="w-28 px-2.5 py-2 rounded-xl border border-stone-300 text-stone-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
                />
              </div>
            </div>
          </div>

          {/* 3. Cover Image & Short Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Cover Image URL */}
            <div className="md:col-span-5">
              <label
                htmlFor="announcement-cover"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5"
              >
                <FiImage className="text-[#BE6030]" />
                <span>Banner / Cover Image URL</span>
              </label>
              <input
                id="announcement-cover"
                type="text"
                value={formData.coverImage || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: e.target.value,
                  }))
                }
                placeholder="https://... (Poster or photograph link)"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
              />
              {formData.coverImage && (
                <div className="mt-2 relative h-20 w-36 rounded-lg overflow-hidden border border-stone-200">
                  {/* biome-ignore lint/performance/noImgElement: user image preview */}
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Short Summary */}
            <div className="md:col-span-7">
              <label
                htmlFor="announcement-summary"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between"
              >
                <span>Short Excerpt / Teaser</span>
                <span className="text-[10.5px] text-stone-400 font-normal">
                  {formData.summary?.length || 0} / 500
                </span>
              </label>
              <textarea
                id="announcement-summary"
                rows={2}
                maxLength={500}
                value={formData.summary || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                placeholder="A concise 1-2 sentence overview shown on the card before expanding..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#BE6030]/20 focus:border-[#BE6030]"
              />
            </div>
          </div>

          {/* 4. Status and Pinning Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-6">
              {/* Status Radio / Select */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Status:
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 text-xs font-medium">
                  {(["published", "draft", "archived"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: st }))
                      }
                      className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                        formData.status === st
                          ? "bg-[#2b1f18] text-white font-semibold"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin to Top Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPinned: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-[#BE6030] rounded border-stone-300 focus:ring-[#BE6030]"
                />
                <span className="text-xs font-medium text-stone-800 flex items-center gap-1">
                  <BsPinAngle
                    className={formData.isPinned ? "text-[#BE6030]" : ""}
                  />
                  <span>Pin to top of page</span>
                </span>
              </label>
            </div>

            <div className="text-[11.5px] text-stone-500 italic">
              Markdown content below will be sanitized and rendered for all
              visitors.
            </div>
          </div>

          {/* 5. Markdown Editor Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="markdown-body-editor"
                className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5"
              >
                <FiType className="text-[#BE6030]" />
                <span>Announcement Markdown Content</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-stone-500">
                Use the toolbar to format headers, lists, links, quotes & tables
              </span>
            </div>
            <MarkdownEditor
              value={formData.content}
              onChange={(nextContent) =>
                setFormData((prev) => ({ ...prev, content: nextContent }))
              }
              minHeight="380px"
              placeholder="Write the full announcement announcement details here in Markdown..."
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-[#FAF7F5]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#BE6030] hover:bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                <span>
                  {isEditing ? "Update Announcement" : "Publish Announcement"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
