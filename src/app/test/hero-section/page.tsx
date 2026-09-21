import { getHeroImagesAction } from "@/backend/actions/image.action";

export default async function Page() {
  const heroImages = await getHeroImagesAction();
  console.log(heroImages);
  return (
    <div>
      {heroImages.images.map((img, index) => (
        <img key={index} src={img.url} alt={img.title} width={400} height={400} />
      ))}
    </div>
  );
}