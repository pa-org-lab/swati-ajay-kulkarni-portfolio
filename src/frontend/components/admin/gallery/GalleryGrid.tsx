"use client";

import { useState } from "react";
import { FiFolderPlus } from "react-icons/fi";
import type { CategoryData } from "@/backend/actions/category.action";
import CategoryCard from "./CategoryCard";

interface GalleryGridProps {
  categories: CategoryData[];
  onCategoryClick?: (category: CategoryData) => void;
  onMenuAction?: (action: string, category: CategoryData) => void;
  onReorder?: (reorderedCategories: CategoryData[]) => void;
  onCreateCategoryClick?: () => void;
}

export default function GalleryGrid({
  categories,
  onCategoryClick,
  onMenuAction,
  onReorder,
  onCreateCategoryClick,
}: GalleryGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...categories];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const updatedWithPositions = reordered.map((cat, idx) => ({
      ...cat,
      position: idx,
    }));

    setDraggedIndex(null);
    setDragOverIndex(null);
    onReorder?.(updatedWithPositions);
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#e2d9d2] rounded-2xl bg-white/50">
        <div className="w-14 h-14 rounded-full bg-[#ece4e0] text-[#a8522e] flex items-center justify-center mb-3">
          <FiFolderPlus className="text-2xl" />
        </div>
        <p className="text-[16px] font-bold text-[#2b1f18]">No categories found</p>
        <p className="text-[13px] text-[#a89488] mt-1 max-w-sm">
          Get started by creating your first photo category to organize your work.
        </p>
        {onCreateCategoryClick && (
          <button
            type="button"
            onClick={onCreateCategoryClick}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold hover:bg-[#8e4325] transition-colors shadow-md cursor-pointer"
          >
            <span>Create New Category</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}
    >
      {categories.map((cat, index) => (
        <CategoryCard
          key={cat._id}
          category={cat}
          index={index}
          isDragging={draggedIndex === index}
          isDragOver={dragOverIndex === index}
          onClick={onCategoryClick}
          onMenuAction={onMenuAction}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
