"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  type CategoryData,
  deleteCategoryAction,
  getCategoriesAction,
  reorderCategoriesAction,
} from "@/backend/actions/category.action";
import ImageGridSkeleton from "@/frontend/components/common/ImageCardSkeleton";
import ConfirmationModal from "@/frontend/components/common/ConfirmationModal";
import CategoryDetailView from "./CategoryDetailView";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import GalleryGrid from "./GalleryGrid";
import GalleryHeader from "./GalleryHeader";
import GalleryToolbar from "./GalleryToolbar";
import UploadImageModal from "./UploadImageModal";

export default function AdminGallerySection() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);

  // Selected category for detail view
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null,
  );

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(
    null,
  );
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetCategoryId, setUploadTargetCategoryId] = useState<
    string | undefined
  >(undefined);
  const [imagesRefreshKey, setImagesRefreshKey] = useState(0);

  // Fetch categories from DB
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCategoriesAction();
      if (res.success && res.categories) {
        setCategories(res.categories);
      } else {
        toast.error(res.error || "Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to connect to database");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Sorting
  const handleSort = () => {
    const sorted = [...categories].sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });
    setCategories(sorted);
    setSortAsc(!sortAsc);
  };

  // Reorder Drag and Drop
  const handleReorderCategories = async (reordered: CategoryData[]) => {
    setCategories(reordered);

    const orderedIds = reordered.map((c) => c._id);
    const toastId = toast.loading("Saving category order...");

    try {
      const res = await reorderCategoriesAction(orderedIds);
      if (res.success) {
        toast.success("Category order updated!", { id: toastId });
      } else {
        toast.error(res.error || "Failed to save category order", {
          id: toastId,
        });
        loadCategories();
      }
    } catch (error) {
      console.error("Error reordering categories:", error);
      toast.error("Failed to save category order", { id: toastId });
      loadCategories();
    }
  };

  // Create Category Success
  const handleCreateSuccess = (newCat: CategoryData) => {
    setCategories((prev) => [...prev, newCat]);
  };

  // Edit Category Success
  const handleEditSuccess = (updatedCat: CategoryData) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === updatedCat._id ? updatedCat : c)),
    );
    if (selectedCategory && selectedCategory._id === updatedCat._id) {
      setSelectedCategory(updatedCat);
    }
  };

  // Trigger Delete Modal
  const handleDeleteCategory = (categoryId: string) => {
    const cat = categories.find((c) => c._id === categoryId);
    if (cat) {
      setCategoryToDelete(cat);
    }
  };

  // Confirm Delete Category Action
  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const catId = categoryToDelete._id;
    const catName = categoryToDelete.name;
    const toastId = toast.loading("Deleting category...");
    setIsDeletingCategory(true);

    try {
      const res = await deleteCategoryAction(catId);
      if (res.success) {
        toast.success(`Category "${catName}" deleted`, { id: toastId });
        setCategories((prev) => prev.filter((c) => c._id !== catId));
        if (selectedCategory && selectedCategory._id === catId) {
          setSelectedCategory(null);
        }
        setCategoryToDelete(null);
      } else {
        toast.error(res.error || "Failed to delete category", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category", { id: toastId });
    } finally {
      setIsDeletingCategory(false);
    }
  };

  // Context Menu Actions
  const handleMenuAction = (action: string, category: CategoryData) => {
    switch (action) {
      case "View Images":
        setSelectedCategory(category);
        break;
      case "Edit Category":
      case "Rename":
        setEditingCategory(category);
        break;
      case "Delete":
        handleDeleteCategory(category._id);
        break;
    }
  };

  // Open upload modal
  const handleOpenUpload = (categoryId?: string) => {
    setUploadTargetCategoryId(categoryId || categories[0]?._id);
    setIsUploadModalOpen(true);
  };

  // Handle Upload Success
  const handleUploadSuccess = async (targetCategoryId?: string) => {
    try {
      const res = await getCategoriesAction();
      if (res.success && res.categories) {
        setCategories(res.categories);
        const activeCatId = targetCategoryId || selectedCategory?._id;
        if (activeCatId) {
          const matchedCategory = res.categories.find(
            (c) => c._id === activeCatId,
          );
          if (matchedCategory) {
            setSelectedCategory(matchedCategory);
          }
        }
      }
      // Increment imagesRefreshKey to trigger immediate image refetch in CategoryDetailView
      setImagesRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error("Error refreshing categories after upload:", e);
    }
  };

  return (
    <>
      {/* If a category is selected for detailed image view */}
      {selectedCategory ? (
        <CategoryDetailView
          key={selectedCategory._id}
          category={selectedCategory}
          refreshTrigger={imagesRefreshKey}
          onBack={() => setSelectedCategory(null)}
          onUploadClick={(catId) => handleOpenUpload(catId)}
          onEditCategory={(cat) => setEditingCategory(cat)}
          onDeleteCategory={(catId) => handleDeleteCategory(catId)}
          onImagesChange={loadCategories}
        />
      ) : (
        /* Main Category Grid View */
        <section className="w-full max-w-280 mx-auto px-4 sm:px-8 md:px-10 py-8 md:py-10">
          {/* Header */}
          <GalleryHeader
            onCreateCategory={() => setIsCreateModalOpen(true)}
            onUploadImage={() => handleOpenUpload()}
          />

          {/* Toolbar */}
          <GalleryToolbar totalCount={categories.length} onSort={handleSort} />

          {/* Loading or Grid */}
          {isLoading ? (
            <ImageGridSkeleton count={8} />
          ) : (
            <GalleryGrid
              categories={categories}
              onCategoryClick={(cat) => setSelectedCategory(cat)}
              onMenuAction={handleMenuAction}
              onReorder={handleReorderCategories}
              onCreateCategoryClick={() => setIsCreateModalOpen(true)}
            />
          )}
        </section>
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        category={editingCategory}
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        onSuccess={handleEditSuccess}
      />

      {/* Upload Image Modal */}
      <UploadImageModal
        isOpen={isUploadModalOpen}
        categories={categories}
        defaultCategoryId={uploadTargetCategoryId}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* Delete Category Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDeleteCategory}
        isLoading={isDeletingCategory}
        title="Delete Category"
        message={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-[#2b1f18]">
              &quot;{categoryToDelete?.name}&quot;
            </strong>{" "}
            and all images inside it? This action cannot be undone.
          </span>
        }
        confirmText="Delete Category"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
