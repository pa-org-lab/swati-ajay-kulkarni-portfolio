"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import { type ImageData, updateImageAction } from "@/backend/actions/image.action";

interface EditImageModalProps {
  image: ImageData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedImage: ImageData) => void;
}

export default function EditImageModal({
  image,
  isOpen,
  onClose,
  onSuccess,
}: EditImageModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (image) {
      setTitle(image.title || "");
      setDescription(image.description || "");
    }
  }, [image]);

  if (!isOpen || !image) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Saving image details...");

    try {
      const res = await updateImageAction(image._id, {
        title: title.trim(),
        description: description.trim(),
      });

      if (res.success && res.image) {
        toast.success("Image details updated!", { id: toastId });
        onSuccess(res.image);
        onClose();
      } else {
        toast.error(res.error || "Failed to update image", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to update image:", error);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-image-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e2d9d2] overflow-hidden p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ede9e5]">
          <h2
            id="edit-image-modal-title"
            className="text-[19px] font-bold text-[#2b1f18]"
          >
            Edit Image Details
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

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Image Thumbnail Preview */}
          <div className="relative w-full h-44 bg-[#ede8e5] rounded-xl overflow-hidden border border-[#e2d9d2]">
            <Image
              src={image.url}
              alt={image.title || "Preview image"}
              fill
              unoptimized
              sizes="500px"
              className="object-cover"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-sm">
              #{image.position + 1}
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label
              htmlFor="edit-image-title"
              className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50] mb-1.5"
            >
              Image Title
            </label>
            <input
              id="edit-image-title"
              type="text"
              placeholder="e.g. Sunset over the Amalfi Coast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-[#fbf8f6] border border-[#d4cac2] rounded-xl text-[14px] text-[#2b1f18] placeholder:text-[#a89488] outline-none transition-all focus:border-[#a8522e] focus:bg-white focus:ring-2 focus:ring-[#a8522e]/15"
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="edit-image-description"
              className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50] mb-1.5"
            >
              Description / Story
            </label>
            <textarea
              id="edit-image-description"
              rows={3}
              placeholder="Add camera details, lighting notes, or the story behind this shot..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-[#fbf8f6] border border-[#d4cac2] rounded-xl text-[13.5px] text-[#2b1f18] placeholder:text-[#a89488] outline-none transition-all focus:border-[#a8522e] focus:bg-white focus:ring-2 focus:ring-[#a8522e]/15 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ede9e5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full border border-[#d4cac2] text-[#6b5a50] text-[13px] font-medium hover:bg-[#f6f2f0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold hover:bg-[#8e4325] transition-colors shadow-[0_2px_8px_rgba(168,82,46,0.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin text-sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck className="text-sm" />
                  <span>Save Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
