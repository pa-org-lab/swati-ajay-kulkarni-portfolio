import { Suspense } from "react";
import GallerySection from "@/frontend/components/public/gallery/GallerySection";
import { getPublicCategoriesAction } from "@/backend/actions/category.action";
import { getPublicGalleryImagesAction } from "@/backend/actions/image.action";
import { getPublicAlbumsAction } from "@/backend/actions/album.action";

export default async function GalleryPage() {
  const [catRes, imgRes, albumRes] = await Promise.all([
    getPublicCategoriesAction(),
    getPublicGalleryImagesAction(),
    getPublicAlbumsAction(),
  ]);

  const categories = catRes.success && catRes.categories ? catRes.categories : [];
  const images = imgRes.success && imgRes.images ? imgRes.images : [];
  const albums = albumRes.success && albumRes.albums ? albumRes.albums : [];

  return (
    <main className="w-full">
      <Suspense fallback={<div className="w-full min-h-screen"></div>}>
        <GallerySection categories={categories} images={images} albums={albums} />
      </Suspense>
    </main>
  );
}