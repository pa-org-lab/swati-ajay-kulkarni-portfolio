"use client";

import { FiPlus, FiUpload } from "react-icons/fi";

interface GalleryHeaderProps {
  title?: string;
  subtitle?: string;
  onCreateCategory?: () => void;
  onUploadImage?: () => void;
}

export default function GalleryHeader({
  title = "Gallery",
  subtitle = "Manage your creative collection.",
  onCreateCategory,
  onUploadImage,
}: GalleryHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
      <div>
        <h1 className="text-[34px] font-bold text-[#2b1f18] leading-none tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-[14px] text-[#a89488] font-normal">
          {subtitle}
        </p>
      </div>

      {/* Header Action CTAs */}
      <div className="flex flex-wrap items-center gap-3 shrink-0 pt-1">
        {/* Secondary / Ghost Action */}
        <button
          type="button"
          onClick={onCreateCategory}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#d4cac2] bg-white text-[#6b5a50] text-[13px] font-semibold hover:border-[#a8522e] hover:text-[#a8522e] hover:bg-[#f9f5f3] transition-all duration-200 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e]"
        >
          <FiPlus className="text-sm shrink-0" />
          <span>Create New Category</span>
        </button>

        {/* Primary Terracotta CTA */}
        <button
          type="button"
          onClick={onUploadImage}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold uppercase tracking-wide hover:bg-[#8e4325] transition-colors duration-200 shadow-[0_2px_10px_rgba(168,82,46,0.35)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e]"
        >
          <FiUpload className="text-sm shrink-0" />
          <span>Upload New Image</span>
        </button>
      </div>
    </header>
  );
}
