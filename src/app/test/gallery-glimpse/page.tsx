import { getGalleryGlimpseAction } from "@/backend/actions/image.action";


export default async function GalleryGlimpsePage() {
  const images = await getGalleryGlimpseAction();

  return (
    <div className="flex flex-wrap gap-4">
      {images.success && images.images.map((image, index) => (
        <div key={index} className="flex flex-col gap-2">
          <img src={image.url} alt={image.title} className="w-40 h-40 object-cover" />
          <p>{image.title}</p>
        </div>
      ))}
    </div>
    );
}   