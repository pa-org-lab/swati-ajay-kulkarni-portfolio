"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiCopy,
  FiExternalLink,
  FiLoader,
  FiMail,
  FiSend,
  FiX,
} from "react-icons/fi";
import {
  type ContactItemData,
  replyToContactAction,
} from "@/backend/actions/contact.action";

interface ReplyMessageModalProps {
  contact: ContactItemData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReplyMessageModal({
  contact,
  isOpen,
  onClose,
  onSuccess,
}: ReplyMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (contact) {
      setSubject(`Re: ${contact.subject}`);
      setReplyMessage("");
      setIsCopied(false);
    }
  }, [contact]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSending, onClose]);

  if (!isOpen || !contact) return null;

  // Copy email address to clipboard
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setIsCopied(true);
      toast.success("Email address copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  // Open in Gmail web compose (works in all browsers without OS mail app)
  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      contact.email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      replyMessage,
    )}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };

  // Trigger default OS mail client (mailto:)
  const handleOpenMailApp = () => {
    const mailtoUrl = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(replyMessage)}`;
    window.location.href = mailtoUrl;
  };

  // Send reply directly from website via Resend action
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    setIsSending(true);
    try {
      const res = await replyToContactAction(
        contact._id,
        replyMessage,
        subject,
      );
      if (res.success) {
        toast.success(`Reply sent successfully to ${contact.email}`);
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.error || "Failed to deliver reply email");
      }
    } catch (err: unknown) {
      console.error("Reply error:", err);
      toast.error("An error occurred while sending your reply");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={() => !isSending && onClose()}
      onKeyDown={(e) => e.key === "Escape" && !isSending && onClose()}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reply-modal-title"
    >
      <div
        role="document"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(43,31,24,0.18)] border border-[#e8dfd8] p-6 sm:p-7 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#ede4dc]">
          <div>
            <span className="text-[10.5px] font-semibold tracking-wider uppercase text-[#a8522e] bg-[#fbeee8] px-2.5 py-0.5 rounded-full border border-[#f2d5c8]">
              Compose Reply
            </span>
            <h3
              id="reply-modal-title"
              className="mt-2 font-serif text-2xl font-normal text-[#2b1f18] leading-tight"
            >
              Reply to {contact.name}
            </h3>
          </div>

          <button
            type="button"
            disabled={isSending}
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-[#a89488] hover:text-[#2b1f18] hover:bg-[#f6f1ec] transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content Form */}
        <form
          onSubmit={handleSendReply}
          className="flex-1 overflow-y-auto pr-1 my-4 space-y-4 text-xs font-sans"
        >
          {/* Recipient pill & quick actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#faf6f2] border border-[#ede3da]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-semibold text-[#8e7a6f] uppercase">
                To:
              </span>
              <span className="font-medium text-[#2b1f18] truncate">
                {contact.name} &lt;{contact.email}&gt;
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#d8cec5] text-[#5c4a3f] hover:text-[#2b1f18] hover:border-[#a8522e] transition-colors cursor-pointer text-[11px] font-medium"
                title="Copy email to clipboard"
              >
                {isCopied ? (
                  <>
                    <FiCheck className="text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label
              htmlFor="reply-subject"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#786658] mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="reply-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#faf7f4] border border-[#e8dfd8] text-[#2b1f18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8522e]/20 focus:border-[#a8522e] transition-all"
            />
          </div>

          {/* Inquiry summary quote */}
          <div className="p-3 rounded-xl bg-[#f7f2ee]/60 border border-[#eee4db]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8e7a6f] mb-1">
              Original Message:
            </p>
            <p className="text-[12px] text-[#6b5a50] italic line-clamp-2">
              &quot;{contact.message}&quot;
            </p>
          </div>

          {/* Reply Message Field */}
          <div>
            <label
              htmlFor="reply-message"
              className="block text-[11px] font-bold uppercase tracking-wider text-[#786658] mb-1"
            >
              Your Response
            </label>
            <textarea
              id="reply-message"
              rows={6}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              disabled={isSending}
              placeholder="Type your response here..."
              className="w-full p-3.5 text-xs rounded-xl bg-[#faf7f4] border border-[#e8dfd8] text-[#2b1f18] placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a8522e]/20 focus:border-[#a8522e] transition-all resize-y min-h-[120px]"
            />
          </div>

          {/* External launcher options */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#8e7a6f]">
            <span>Or open directly in:</span>
            <button
              type="button"
              onClick={handleOpenGmail}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#faf6f2] hover:bg-[#f2e9e2] text-[#2b1f18] font-medium border border-[#ede3da] transition-colors cursor-pointer"
            >
              <span>Gmail Web</span>
              <FiExternalLink className="text-[10px]" />
            </button>
            {/* <button
              type="button"
              onClick={handleOpenMailApp}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#faf6f2] hover:bg-[#f2e9e2] text-[#2b1f18] font-medium border border-[#ede3da] transition-colors cursor-pointer"
            >
              <span>Default Mail App</span>
              <FiMail className="text-[10px]" />
            </button> */}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#ede4dc] flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSending}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#d8cec5] bg-white text-[#5c4a3f] font-medium text-xs hover:bg-[#f6f2ee] transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#a8522e] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8e4325] shadow-[0_2px_12px_rgba(168,82,46,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <FiLoader className="animate-spin text-sm" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reply Email</span>
                  <FiSend className="text-xs" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
