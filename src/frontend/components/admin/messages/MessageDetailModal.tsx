"use client";

import { useEffect } from "react";
import {
  FiBookmark,
  FiCheck,
  FiClock,
  FiMail,
  FiSend,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import type { ContactItemData } from "@/backend/actions/contact.action";

interface MessageDetailModalProps {
  contact: ContactItemData | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (contact: ContactItemData) => void;
  onDelete: (contact: ContactItemData) => void;
  onReply: (contact: ContactItemData) => void;
  isUpdating?: boolean;
}

export default function MessageDetailModal({
  contact,
  isOpen,
  onClose,
  onToggleStatus,
  onDelete,
  onReply,
  isUpdating = false,
}: MessageDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !contact) return null;

  const formattedDate = new Date(contact.createdAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-detail-title"
    >
      <div
        role="document"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(43,31,24,0.18)] border border-[#e8dfd8] p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#ede4dc]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                  contact.status === "unread"
                    ? "bg-[#fbeee8] text-[#a8522e] border border-[#f2d5c8]"
                    : "bg-[#f3efe9] text-[#786658] border border-[#e4ded6]"
                }`}
              >
                {contact.status === "unread" ? "Unread Message" : "Read"}
              </span>

              {contact.emailSentToUser && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <FiCheck className="text-xs" />
                  <span>Auto-reply dispatched</span>
                </span>
              )}
            </div>

            <h3
              id="message-detail-title"
              className="font-serif text-2xl font-normal text-[#2b1f18] leading-tight"
            >
              {contact.subject}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-[#a89488] hover:text-[#2b1f18] hover:bg-[#f6f1ec] transition-colors cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Sender Info & Metadata */}
        <div className="py-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#faf6f2] border border-[#eee4db]">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#a8522e] text-white flex items-center justify-center font-serif text-base font-medium shadow-sm">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2b1f18] flex items-center gap-2">
                  <span>{contact.name}</span>
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-xs text-[#a8522e] hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <FiMail className="text-xs" />
                  <span>{contact.email}</span>
                </a>
              </div>
            </div>

            <div className="text-right text-xs text-[#8e7a6f] flex items-center gap-1.5">
              <FiClock className="text-xs" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Message Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 my-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8e7a6f] mb-2 flex items-center gap-1.5">
            <FiBookmark className="text-xs" />
            <span>Message Content</span>
          </p>
          <div className="p-5 rounded-2xl bg-[#fcfaf8] border border-[#ede3da] text-sm text-[#3b2e25] leading-relaxed whitespace-pre-wrap font-sans min-h-[140px]">
            {contact.message}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-5 mt-2 border-t border-[#ede4dc] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Toggle Status Button */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onToggleStatus(contact)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#d8cec5] text-[#5c4a3f] bg-white hover:bg-[#f6f2ee] hover:text-[#2b1f18] transition-colors cursor-pointer disabled:opacity-50"
            >
              {contact.status === "unread" ? "Mark as Read" : "Mark as Unread"}
            </button>

            {/* Delete Button */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onDelete(contact)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FiTrash2 className="text-xs" />
              <span>Delete</span>
            </button>
          </div>

          {/* Reply CTA Button */}
          <button
            type="button"
            onClick={() => onReply(contact)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8e4325] shadow-[0_2px_12px_rgba(168,82,46,0.3)] transition-all cursor-pointer"
          >
            <span>Reply to {contact.name}</span>
            <FiSend className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
