"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getPublicCategoriesAction,
  type CategoryData,
} from "@/backend/actions/category.action";
import {
  getPublicGalleryImagesAction,
  type PublicGalleryImageItem,
} from "@/backend/actions/image.action";
import GalleryHeader from "./GalleryHeader";
import GalleryFilterBar, {
  type GalleryCategoryTab,
  type GalleryLayoutOption,
  type GallerySortOption,
} from "./GalleryFilterBar";
import GalleryGrid from "./GalleryGrid";
import GalleryLightbox from "./GalleryLightbox";

export default function GallerySection() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [activeSort, setActiveSort] = useState<GallerySortOption>("curated");
  const [activeLayout, setActiveLayout] = useState<GalleryLayoutOption>("drift");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [dbImages, setDbImages] = useState<PublicGalleryImageItem[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Synchronize category if query parameter updates
  useEffect(() => {
    const paramCategory = searchParams.get("category");
    if (paramCategory) {
      setActiveCategory(paramCategory.toLowerCase());
    }
  }, [searchParams]);

  // Load categories and images from DB (hero-section strictly excluded)
  const loadGalleryData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catRes, imgRes] = await Promise.all([
        getPublicCategoriesAction(),
        getPublicGalleryImagesAction(),
      ]);

      if (catRes.success && catRes.categories) {
        setDbCategories(catRes.categories);
      }

      if (imgRes.success && imgRes.images) {
        setDbImages(imgRes.images);
      }
    } catch (err) {
      console.error("Failed to load gallery data from DB:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

  // Dynamically build category tabs from backend categories, strictly excluding hero-section
  const categoryTabs = useMemo<GalleryCategoryTab[]>(() => {
    const tabs: GalleryCategoryTab[] = [
      { id: "all", name: "ALL", slug: "all" },
    ];

    for (const cat of dbCategories) {
      const slugLower = cat.slug.toLowerCase();
      const nameLower = cat.name.toLowerCase();

      // Exclude hero section
      if (
        slugLower === "hero-section" ||
        slugLower === "hero" ||
        slugLower === "herosection" ||
        nameLower.startsWith("hero")
      ) {
        continue;
      }

      tabs.push({
        id: cat._id,
        name: cat.name.toUpperCase(),
        slug: cat.slug.toLowerCase(),
        count: cat.count,
      });
    }

    return tabs;
  }, [dbCategories]);

  // Filter and sort images fetched from backend (which already excludes hero-section)
  const filteredImages = useMemo<PublicGalleryImageItem[]>(() => {
    let result = dbImages;

    // Filter by category
    if (activeCategory && activeCategory !== "all") {
      const activeCatLower = activeCategory.toLowerCase();
      result = result.filter((item) => {
        const itemCatSlug = (item.categorySlug || "").toLowerCase();
        const itemCatName = (item.categoryName || "").toLowerCase();

        return itemCatSlug === activeCatLower || itemCatName === activeCatLower;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }


    // Sorting
    const sorted = [...result];
    if (activeSort === "newest") {
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (activeSort === "oldest") {
      sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    } else if (activeSort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [dbImages, activeCategory, searchQuery, activeSort]);


  return (
    <section
      id="gallery-archive"
      aria-label="Photography and Visual Arts Gallery"
      className="relative w-full bg-[#FAF7F5] min-h-screen pt-20 sm:pt-30 lg:pt-30 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-14 xl:px-20"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* 1. Header Section Matching Screenshot */}
        <GalleryHeader totalCount={filteredImages.length} />

        {/* 2. Filter Bar with Capsule Pills + Circular Filter Button */}
        <GalleryFilterBar
          categories={categoryTabs}
          activeCategory={activeCategory}
          onSelectCategory={(slug) => setActiveCategory(slug)}
          activeSort={activeSort}
          onSelectSort={(sort) => setActiveSort(sort)}
          activeLayout={activeLayout}
          onSelectLayout={(layout) => setActiveLayout(layout)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* 3. Clean Responsive Gallery Grid (Zero Muddy Overlays or Dark Shadows) */}
        <GalleryGrid
          images={filteredImages}
          isLoading={isLoading}
          layout={activeLayout}
          onImageClick={(index) => setLightboxIndex(index)}
        />

        {/* 4. Interactive Minimalist Lightbox Modal */}
        <GalleryLightbox
          images={filteredImages}
          selectedIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onSelectIndex={(index) => setLightboxIndex(index)}
        />
      </div>
    </section>
  );
}