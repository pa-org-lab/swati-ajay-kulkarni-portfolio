import { notFound } from "next/navigation";
import { getPublicAlbumBySlugAction } from "@/backend/actions/album.action";
import AlbumView from "@/frontend/components/public/gallery/AlbumView";

export default async function AlbumPage({ slug }: { slug: string }) {
  const res = await getPublicAlbumBySlugAction(slug);

  if (!res.success || !res.album) {
    notFound();
  }

  return (
    <main className="w-full">
      <AlbumView album={res.album} />
    </main>
  );
}
