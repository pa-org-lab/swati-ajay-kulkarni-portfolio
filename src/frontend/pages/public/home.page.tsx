import AboutSection from "@/frontend/components/public/home/about/AboutSection";
import CategorySection from "@/frontend/components/public/home/category/CategorySection";
import GalleryGlimpseSection from "@/frontend/components/public/home/galleryGlimpse/GalleryGlimpseSection";
import HeroSection from "@/frontend/components/public/home/heroSection/HeroSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <CategorySection />

      <GalleryGlimpseSection />

      <AboutSection />
    </>
  );
}
