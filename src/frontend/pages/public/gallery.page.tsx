import { Suspense } from "react";
import GallerySection from "@/frontend/components/public/gallery/GallerySection";

export default function GalleryPage() {
  return (
    <main className="w-full">
      <Suspense fallback={<div className="w-full min-h-screen"></div>}>
        <GallerySection />
      </Suspense>
    </main>
  );
}