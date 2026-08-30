"use client";

import { FiSliders } from "react-icons/fi";

interface GalleryToolbarProps {
  totalCount: number;
  label?: string;
  onSort?: () => void;
}

export default function GalleryToolbar({
  totalCount,
  label = "Total Categories",
  onSort,
}: GalleryToolbarProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <span className="text-[10px] uppercase tracking-[0.13em] text-[#a89488] font-semibold">
        {label} :  {totalCount}
      </span>

      <button
        type="button"
        onClick={onSort}
        className="flex items-center gap-1.5 text-[12px] text-[#a89488] hover:text-[#6b5a50] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e] rounded-md px-1.5 py-0.5"
      >
        <FiSliders className="text-xs shrink-0" />
        <span>Sort</span>
      </button>
    </div>
  );
}
