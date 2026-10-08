"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiLoader, FiX } from "react-icons/fi";
import {
  type AlbumData,
  createAlbumAction,
  updateAlbumAction,
} from "@/backend/actions/album.action";

interface AlbumModalProps {
  isOpen: boolean;
  categoryId: string;
  album?: AlbumData | null;
  onClose: () => void;
  onSuccess: (album: AlbumData) => void;
}

export default function AlbumModal({
  isOpen,
  categoryId,
  album,
  onClose,
  onSuccess,
}: AlbumModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(album?.name || "");
      setDescription(album?.description || "");
    }
  }, [isOpen, album]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const toastId = toast.loading(
      album ? "Updating album..." : "Creating album...",
    );

    try {
      const res = album
        ? await updateAlbumAction(album._id, name.trim(), description.trim())
        : await createAlbumAction(categoryId, name.trim(), description.trim());

      if (res.success && res.album) {
        toast.success(
          album ? "Album updated" : `Album "${res.album.name}" created`,
          {
            id: toastId,
          },
        );
        onSuccess(res.album);
        onClose();
      } else {
        toast.error(res.error || "Failed to save album", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to save album:", error);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="album-modal-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e2d9d2] overflow-hidden p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#ede9e5]">
          <h2
            id="album-modal-title"
            className="text-[19px] font-bold text-[#2b1f18]"
          >
            {album ? "Edit Album" : "New Album"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#a89488] hover:text-[#2b1f18] hover:bg-[#f2eef3] transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="album-name"
              className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50] mb-2"
            >
              Album Name
            </label>
            <input
              id="album-name"
              type="text"
              autoFocus
              placeholder="e.g. Sharma Wedding"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[#fbf8f6] border border-[#d4cac2] rounded-xl text-[14.5px] text-[#2b1f18] placeholder:text-[#a89488] outline-none transition-all focus:bg-white focus:border-[#a8522e] focus:ring-2 focus:ring-[#a8522e]/15"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="album-description"
                className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50]"
              >
                Description
              </label>
              <span className="text-[11px] text-[#a89488] italic font-normal">
                Optional
              </span>
            </div>
            <textarea
              id="album-description"
              rows={3}
              placeholder="Shown on the public album page."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[#fbf8f6] border border-[#d4cac2] rounded-xl text-[14.5px] text-[#2b1f18] placeholder:text-[#a89488] outline-none transition-all focus:bg-white focus:border-[#a8522e] focus:ring-2 focus:ring-[#a8522e]/15 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-full border border-[#d4cac2] text-[#6b5a50] text-[13px] font-medium hover:bg-[#f6f2f0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold hover:bg-[#8e4325] transition-colors shadow-[0_2px_8px_rgba(168,82,46,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <FiLoader className="animate-spin text-sm" />}
              <span>{album ? "Save Changes" : "Create Album"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
