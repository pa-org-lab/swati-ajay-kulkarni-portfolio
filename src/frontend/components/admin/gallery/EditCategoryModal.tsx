"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";
import {
  type CategoryData,
  updateCategoryAction,
} from "@/backend/actions/category.action";

interface EditCategoryModalProps {
  category: CategoryData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCategory: CategoryData) => void;
}

export default function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onSuccess,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setErrorMsg("");
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter a category name");
      toast.error("Please enter a category name");
      return;
    }

    if (name.trim() === category.name) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Updating category...");

    try {
      const res = await updateCategoryAction(category._id, name.trim());
      if (res.success && res.category) {
        toast.success(`Renamed to "${res.category.name}"!`, { id: toastId });
        setErrorMsg("");
        onSuccess(res.category);
        onClose();
      } else {
        const errorText = res.error || "Failed to update category";
        setErrorMsg(errorText);
        toast.error(errorText, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      const errorText = "An unexpected error occurred";
      setErrorMsg(errorText);
      toast.error(errorText, { id: toastId });
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
      aria-labelledby="edit-category-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e2d9d2] overflow-hidden p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ede9e5]">
          <h2
            id="edit-category-title"
            className="text-[19px] font-bold text-[#2b1f18]"
          >
            Rename Category
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="edit-category-name"
              className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50] mb-2"
            >
              Category Name
            </label>
            <input
              id="edit-category-name"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-[#fbf8f6] border rounded-xl text-[14.5px] text-[#2b1f18] placeholder:text-[#a89488] outline-none transition-all focus:bg-white focus:ring-2 ${
                errorMsg
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : "border-[#d4cac2] focus:border-[#a8522e] focus:ring-[#a8522e]/15"
              }`}
            />
            {errorMsg && (
              <p className="mt-1.5 text-[12px] text-red-600 font-medium">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Actions */}
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
              {isSubmitting ? (
                <>
                  <FiLoader className="animate-spin text-sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck className="text-sm" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
