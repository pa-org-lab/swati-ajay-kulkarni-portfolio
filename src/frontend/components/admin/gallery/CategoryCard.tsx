"use client";

import Image from "next/image";
import { FiImage, FiMove } from "react-icons/fi";
import type { CategoryData } from "@/backend/actions/category.action";
import CategoryContextMenu from "./CategoryContextMenu";

interface CategoryCardProps {
  category: CategoryData;
  index: number;
  isDragging?: boolean;
  isDragOver?: boolean;
  onClick?: (category: CategoryData) => void;
  onMenuAction?: (action: string, category: CategoryData) => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
}

export default function CategoryCard({
  category,
  index,
  isDragging = false,
  isDragOver = false,
  onClick,
  onMenuAction,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: CategoryCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(category);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop?.(e, index)}
      onClick={() => onClick?.(category)}
      onKeyDown={handleKeyDown}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col focus-visible:ring-2 focus-visible:ring-[#a8522e] focus-visible:outline-none select-none hover:z-20 ${
        isDragging
          ? "opacity-35 scale-95 border-dashed border-[#a8522e]"
          : isDragOver
          ? "border-[#a8522e] ring-2 ring-[#a8522e]/30 -translate-y-1 shadow-lg"
          : "border-[#e2d9d2] shadow-[0_2px_12px_rgba(43,31,24,0.06)] hover:shadow-[0_8px_28px_rgba(43,31,24,0.12)] hover:-translate-y-0.5"
      }`}
    >
      {/* Thumbnail with 4:3 aspect ratio */}
      <div
        className="relative overflow-hidden rounded-t-2xl bg-[#ede8e5] w-full flex items-center justify-center"
        style={{ aspectRatio: "4/3" }}
      >
        {category.img ? (
          <Image
            src={category.img}
            alt={category.alt || `${category.name} collection`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#8c786a] gap-1.5 p-4 select-none">
            <FiImage className="text-3xl opacity-40 text-[#a8522e]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8c786a]/70">
              No images
            </span>
          </div>
        )}

        {/* Hover Scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Position badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10.5px] font-semibold backdrop-blur-sm shadow pointer-events-none">
          #{index + 1}
        </div>

        {/* Drag indicator icon */}
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 text-[#6b5a50] opacity-0 group-hover:opacity-100 flex items-center justify-center shadow transition-opacity">
          <FiMove className="text-xs" />
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-4 py-3.5 mt-auto bg-white rounded-b-2xl border-t border-[#ede9e5]">
        <div className="min-w-0 pr-2">
          <h3 className="text-[14.5px] font-semibold text-[#2b1f18] truncate leading-snug">
            {category.name}
          </h3>
          <p
            className="text-[#a89488] mt-0.5 tracking-[0.06em] uppercase font-medium"
            style={{ fontSize: "10.5px" }}
          >
            {category.count} {category.count === 1 ? "image" : "images"}
          </p>
        </div>

        <CategoryContextMenu
          name={category.name}
          onAction={(action) => onMenuAction?.(action, category)}
        />
      </div>
    </article>
  );
}
