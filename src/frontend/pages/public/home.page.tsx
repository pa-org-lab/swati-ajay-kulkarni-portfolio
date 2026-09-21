import { getGalleryGlimpseAction, getHeroImagesAction } from "@/backend/actions/image.action";
import AboutSection from "@/frontend/components/public/home/about/AboutSection";
import CategorySection from "@/frontend/components/public/home/category/CategorySection";
import GalleryGlimpseSection from "@/frontend/components/public/home/galleryGlimpse/GalleryGlimpseSection";
import HeroSection from "@/frontend/components/public/home/heroSection/HeroSection";

export default async function HomePage() {
  const [heroData, galleryGlimpseData] = await Promise.all([
    getHeroImagesAction(),
    getGalleryGlimpseAction(),
  ]);

  const heroImages = heroData.success ? heroData.images : [];
  const galleryGlimpseImages = galleryGlimpseData.success ? galleryGlimpseData.images : [];

  return (
    <>
      <HeroSection images={heroImages} />

      <CategorySection />

      <GalleryGlimpseSection images={galleryGlimpseImages} />

      <AboutSection />
    </>
  );
}
