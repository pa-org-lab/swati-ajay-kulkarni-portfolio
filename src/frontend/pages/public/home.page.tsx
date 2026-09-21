import { getPublicCategoriesWithFirstImage } from "@/backend/actions/category.action";
import { getGalleryGlimpseAction, getHeroImagesAction } from "@/backend/actions/image.action";
import AboutSection from "@/frontend/components/public/home/about/AboutSection";
import CategorySection from "@/frontend/components/public/home/category/CategorySection";
import GalleryGlimpseSection from "@/frontend/components/public/home/galleryGlimpse/GalleryGlimpseSection";
import HeroSection from "@/frontend/components/public/home/heroSection/HeroSection";

export default async function HomePage() {
  const [heroData, galleryGlimpseData, categoriesData] = await Promise.all([
    getHeroImagesAction(),
    getGalleryGlimpseAction(),
    getPublicCategoriesWithFirstImage(),
  ]);

  const heroImages = heroData.success ? heroData.images : [];
  const galleryGlimpseImages = galleryGlimpseData.success ? galleryGlimpseData.images : [];
  const categories = categoriesData.success && categoriesData.categories ? categoriesData.categories : [];

  return (
    <>
      <HeroSection images={heroImages} />

      <CategorySection categories={categories} />

      <GalleryGlimpseSection images={galleryGlimpseImages} />

      <AboutSection />
    </>
  );
}
