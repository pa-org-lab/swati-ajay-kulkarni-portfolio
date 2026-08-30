"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiEdit2,
  FiImage,
  FiLoader,
  FiMove,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import type { CategoryData } from "@/backend/actions/category.action";
import {
  deleteImageAction,
  getImagesByCategoryAction,
  type ImageData,
  reorderImagesAction,
} from "@/backend/actions/image.action";
import ConfirmationModal from "@/frontend/components/common/ConfirmationModal";
import EditImageModal from "./EditImageModal";

interface CategoryDetailViewProps {
  category: CategoryData;
  onBack: () => void;
  onUploadClick: (categoryId: string) => void;
  onEditCategory: (category: CategoryData) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export default function CategoryDetailView({
  category,
  onBack,
  onUploadClick,
  onEditCategory,
  onDeleteCategory,
}: CategoryDetailViewProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);
  const [imageToDelete, setImageToDelete] = useState<ImageData | null>(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const fetchCategoryImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getImagesByCategoryAction(category._id);
      if (res.success && res.images) {
        setImages(res.images);
      } else {
        toast.error(res.error || "Failed to load category images");
      }
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load category images");
    } finally {
      setIsLoading(false);
    }
  }, [category._id]);

  useEffect(() => {
    fetchCategoryImages();
  }, [fetchCategoryImages]);

  // Drag and drop handlers
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

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update positions locally
    const updatedWithPositions = reordered.map((img, idx) => ({
      ...img,
      position: idx,
    }));

    setImages(updatedWithPositions);
    setDraggedIndex(null);
    setDragOverIndex(null);

    const orderedIds = updatedWithPositions.map((img) => img._id);
    const toastId = toast.loading("Saving image order...");

    try {
      const res = await reorderImagesAction(category._id, orderedIds);
      if (res.success) {
        toast.success("Image order updated!", { id: toastId });
      } else {
        toast.error(res.error || "Failed to save reordering", { id: toastId });
        fetchCategoryImages();
      }
    } catch (error) {
      console.error("Failed to persist image reordering:", error);
      toast.error("Failed to save reordering", { id: toastId });
      fetchCategoryImages();
    }
  };

  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;

    const imgId = imageToDelete._id;
    const imgTitle = imageToDelete.title;
    const toastId = toast.loading("Deleting image...");
    setIsDeletingImage(true);

    try {
      const res = await deleteImageAction(imgId);
      if (res.success) {
        toast.success("Image deleted successfully", { id: toastId });
        setImages((prev) => prev.filter((img) => img._id !== imgId));
        setImageToDelete(null);
      } else {
        toast.error(res.error || "Failed to delete image", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image", { id: toastId });
    } finally {
      setIsDeletingImage(false);
    }
  };


  const handleImageUpdateSuccess = (updatedImage: ImageData) => {
    setImages((prev) =>
      prev.map((img) => (img._id === updatedImage._id ? updatedImage : img))
    );
  };

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-8 md:px-10 py-8 md:py-10">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4cac2] bg-white text-[#6b5a50] text-[13px] font-medium hover:border-[#a8522e] hover:text-[#a8522e] hover:bg-[#fbf5f2] transition-colors cursor-pointer"
        >
          <FiArrowLeft className="text-sm" />
          <span>Back to Categories</span>
        </button>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d4cac2] bg-white text-[#6b5a50] text-[12.5px] font-medium hover:text-[#2b1f18] hover:bg-[#f6f2f0] transition-colors cursor-pointer"
          >
            <FiEdit2 className="text-xs" />
            <span>Rename</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory(category._id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 bg-white text-red-600 text-[12.5px] font-medium hover:bg-red-50 transition-colors cursor-pointer"
          >
            <FiTrash2 className="text-xs" />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={() => onUploadClick(category._id)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold uppercase tracking-wide hover:bg-[#8e4325] transition-colors shadow-[0_2px_8px_rgba(168,82,46,0.3)] cursor-pointer"
          >
            <FiUpload className="text-sm" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Category Info Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] font-bold text-[#2b1f18] tracking-tight">
            {category.name}
          </h1>
          <span className="px-3 py-1 rounded-full bg-[#ece4e0] text-[#a8522e] text-[12px] font-semibold uppercase tracking-wider">
            {images.length} {images.length === 1 ? "Image" : "Images"}
          </span>
        </div>
        <p className="text-[13.5px] text-[#a89488] mt-1">
          Drag and drop images to reorder, or click Edit to update photo titles and descriptions.
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#a8522e]">
          <FiLoader className="animate-spin text-3xl mb-3" />
          <p className="text-[14px] text-[#6b5a50]">Loading category images...</p>
        </div>
      ) : images.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#e2d9d2] rounded-2xl bg-white/60">
          <div className="w-14 h-14 rounded-full bg-[#ece4e0] text-[#a8522e] flex items-center justify-center mb-3">
            <FiImage className="text-2xl" />
          </div>
          <h3 className="text-[16px] font-bold text-[#2b1f18]">
            No images in this category yet
          </h3>
          <p className="text-[13px] text-[#a89488] mt-1 max-w-sm">
            Upload your first photos to begin showcasing work in {category.name}.
          </p>
          <button
            type="button"
            onClick={() => onUploadClick(category._id)}
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold hover:bg-[#8e4325] transition-colors shadow-md cursor-pointer"
          >
            <FiUpload className="text-sm" />
            <span>Upload Photos Now</span>
          </button>
        </div>
      ) : (
        /* Images Grid with Drag and Drop & Edit */
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}
        >
          {images.map((img, index) => {
            const isDragging = draggedIndex === index;
            const isOver = dragOverIndex === index;

            return (
              <article
                key={img._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
                className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col ${
                  isDragging
                    ? "opacity-40 scale-95 border-dashed border-[#a8522e]"
                    : isOver
                    ? "border-[#a8522e] ring-2 ring-[#a8522e]/30 -translate-y-1 shadow-lg"
                    : "border-[#e2d9d2] shadow-[0_2px_12px_rgba(43,31,24,0.06)] hover:shadow-[0_8px_24px_rgba(43,31,24,0.12)] hover:-translate-y-0.5"
                }`}
              >
                {/* Image Container with 4:3 ratio */}
                <div
                  className="relative overflow-hidden bg-[#ede8e5] w-full"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Image
                    src={img.url}
                    alt={img.title || `${category.name} image`}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {/* Position Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-semibold backdrop-blur-sm shadow">
                    #{index + 1}
                  </div>

                  {/* Drag Grip Indicator */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/85 text-[#6b5a50] opacity-0 group-hover:opacity-100 flex items-center justify-center shadow transition-opacity">
                    <FiMove className="text-xs" />
                  </div>
                </div>

                {/* Footer with Title, Description snippet, Edit and Delete buttons */}
                <div className="p-3.5 bg-white border-t border-[#ede9e5] mt-auto">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13.5px] font-semibold text-[#2b1f18] truncate leading-tight">
                        {img.title || "Untitled Image"}
                      </h4>
                      {img.description ? (
                        <p className="text-[11.5px] text-[#a89488] line-clamp-1 mt-0.5">
                          {img.description}
                        </p>
                      ) : (
                        <p className="text-[10.5px] text-[#c5b8b0] mt-0.5 italic">
                          No description
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImage(img);
                        }}
                        title="Edit title & description"
                        aria-label="Edit image details"
                        className="w-7 h-7 rounded-full text-[#a89488] hover:text-[#a8522e] hover:bg-[#fbf5f2] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FiEdit2 className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageToDelete(img);
                        }}
                        title="Delete Image"
                        aria-label="Delete image"
                        className="w-7 h-7 rounded-full text-[#a89488] hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Edit Image Modal */}
      <EditImageModal
        image={editingImage}
        isOpen={Boolean(editingImage)}
        onClose={() => setEditingImage(null)}
        onSuccess={handleImageUpdateSuccess}
      />

      {/* Delete Image Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(imageToDelete)}
        onClose={() => setImageToDelete(null)}
        onConfirm={handleConfirmDeleteImage}
        isLoading={isDeletingImage}
        title="Delete Image"
        message={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-[#2b1f18]">
              {imageToDelete?.title ? `"${imageToDelete.title}"` : "this image"}
            </strong>
            ? This action cannot be undone.
          </span>
        }
        confirmText="Delete Image"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

