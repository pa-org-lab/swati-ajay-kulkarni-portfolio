"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiImage,
  FiLoader,
  FiTrash2,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import type { CategoryData } from "@/backend/actions/category.action";
import { type ImageData, saveUploadedImagesAction } from "@/backend/actions/image.action";
import { uploadSingleImage } from "@/frontend/utils/lib/uploadSingleImage";

interface SelectedImageItem {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  description: string;
}

interface UploadImageModalProps {
  isOpen: boolean;
  categories: CategoryData[];
  defaultCategoryId?: string;
  onClose: () => void;
  onSuccess: (targetCategoryId: string, newImages?: ImageData[]) => void;
}

export default function UploadImageModal({
  isOpen,
  categories,
  defaultCategoryId,
  onClose,
  onSuccess,
}: UploadImageModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [images, setImages] = useState<SelectedImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
  }>({ current: 0, total: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultCategoryId) {
        setSelectedCategoryId(defaultCategoryId);
      } else if (categories.length > 0) {
        setSelectedCategoryId(categories[0]._id);
      }
    }
  }, [isOpen, defaultCategoryId, categories]);

  // Clean up object URLs when modal unmounts or closes
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  if (!isOpen) return null;

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const newItems: SelectedImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image format`);
        return;
      }

      // Default title from clean filename
      const defaultTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        title: defaultTitle,
        description: "",
      });
    });

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, title: newTitle } : img))
    );
  };

  const handleDescriptionChange = (id: string, newDesc: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, description: newDesc } : img))
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const itemToRemove = prev.find((img) => img.id === id);
      if (itemToRemove) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleUploadAll = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a target category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: images.length });
    const toastId = toast.loading(`Uploading 0/${images.length} images...`);

    try {
      const uploadedResults: {
        url: string;
        title: string;
        description?: string;
      }[] = [];

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setUploadProgress({ current: i + 1, total: images.length });
        toast.loading(`Uploading image ${i + 1} of ${images.length}...`, {
          id: toastId,
        });

        const publicUrl = await uploadSingleImage(item.file);
        if (!publicUrl) {
          throw new Error(`Failed to upload ${item.file.name}`);
        }

        uploadedResults.push({
          url: publicUrl,
          title: item.title.trim(),
          description: item.description.trim(),
        });
      }

      toast.loading("Saving image records...", { id: toastId });

      const saveRes = await saveUploadedImagesAction(
        selectedCategoryId,
        uploadedResults
      );

      if (saveRes.success) {
        toast.success(
          `Successfully uploaded ${uploadedResults.length} ${uploadedResults.length === 1 ? "image" : "images"}!`,
          { id: toastId }
        );
        images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        setImages([]);
        onSuccess(selectedCategoryId, saveRes.images);
        onClose();
      } else {
        toast.error(saveRes.error || "Failed to save image records in database", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Upload failed. Please check network/storage settings.",
        { id: toastId }
      );
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && !isUploading && onClose()}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#e2d9d2] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#ede9e5] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ece4e0] text-[#a8522e] flex items-center justify-center">
              <FiUploadCloud className="text-base" />
            </div>
            <div>
              <h2
                id="upload-modal-title"
                className="text-[18px] font-bold text-[#2b1f18] leading-tight"
              >
                Upload Images
              </h2>
              <p className="text-[12px] text-[#a89488]">
                Upload photos directly to your cloud collection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#a89488] hover:text-[#2b1f18] hover:bg-[#f2eef3] transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Category Selector */}
          <div>
            <label
              htmlFor="upload-category-select"
              className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50] mb-2"
            >
              Target Category
            </label>
            <select
              id="upload-category-select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              disabled={isUploading}
              className="w-full px-4 py-2.5 bg-[#fbf8f6] border border-[#d4cac2] rounded-xl text-[14px] text-[#2b1f18] outline-none transition-all focus:border-[#a8522e] focus:bg-white focus:ring-2 focus:ring-[#a8522e]/15 cursor-pointer"
            >
              {categories.length === 0 && (
                <option value="">No categories available - please create one first</option>
              )}
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name} ({cat.count} images)
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-[#a8522e] bg-[#fbf5f2]"
                : "border-[#d4cac2] bg-[#fdfbf9] hover:bg-[#f8f4f2] hover:border-[#a8522e]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-[#ece4e0] text-[#a8522e] flex items-center justify-center mx-auto mb-3">
              <FiImage className="text-2xl" />
            </div>
            <p className="text-[14px] font-semibold text-[#2b1f18]">
              Click to select or drag & drop multiple images
            </p>
            <p className="text-[12px] text-[#a89488] mt-1">
              Supports JPEG, PNG, WEBP formats. High resolution recommended.
            </p>
          </div>

          {/* Previews List with Title Inputs */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b5a50]">
                  Selected Images ({images.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
                    setImages([]);
                  }}
                  disabled={isUploading}
                  className="text-[12px] text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative bg-[#fbf8f6] border border-[#e2d9d2] rounded-xl overflow-hidden shadow-sm flex flex-col"
                  >
                    {/* Thumbnail preview */}
                    <div className="relative h-36 bg-[#ede8e5] w-full overflow-hidden group">
                      <img
                        src={item.previewUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                        #{index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(item.id)}
                        disabled={isUploading}
                        aria-label="Remove image"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>

                    {/* Title & Description Inputs at Bottom */}
                    <div className="p-2.5 bg-white border-t border-[#ede9e5] space-y-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#8a7a70] font-medium">
                          <FiFileText className="text-[11px]" />
                          <span>Title</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Image title"
                          value={item.title}
                          onChange={(e) => handleTitleChange(item.id, e.target.value)}
                          disabled={isUploading}
                          className="w-full px-2.5 py-1 text-[12px] bg-[#fbf8f6] border border-[#d4cac2] rounded-lg text-[#2b1f18] placeholder:text-[#a89488] outline-none focus:border-[#a8522e] focus:bg-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Description (Optional)"
                          value={item.description}
                          onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                          disabled={isUploading}
                          className="w-full px-2.5 py-1 text-[11.5px] bg-[#fbf8f6] border border-[#d4cac2] rounded-lg text-[#2b1f18] placeholder:text-[#a89488] outline-none focus:border-[#a8522e] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#ede9e5] bg-[#faf7f5] shrink-0">
          <span className="text-[12.5px] text-[#8a7a70]">
            {images.length > 0 ? `${images.length} images queued` : "No images selected"}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-full border border-[#d4cac2] text-[#6b5a50] text-[13px] font-medium hover:bg-[#f6f2f0] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUploadAll}
              disabled={isUploading || images.length === 0 || !selectedCategoryId}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#a8522e] text-white text-[13px] font-semibold hover:bg-[#8e4325] transition-colors shadow-[0_2px_8px_rgba(168,82,46,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isUploading ? (
                <>
                  <FiLoader className="animate-spin text-sm" />
                  <span>
                    Uploading ({uploadProgress.current}/{uploadProgress.total})...
                  </span>
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-sm" />
                  <span>Upload {images.length > 0 ? `(${images.length})` : ""}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
