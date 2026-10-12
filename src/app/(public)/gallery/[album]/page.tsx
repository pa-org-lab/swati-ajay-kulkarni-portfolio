import { notFound } from "next/navigation";
import { getPublicAlbumBySlugAction } from "@/backend/actions/album.action";
import AlbumPage from "@/frontend/pages/public/album.page";

export default async function ({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album } = await params;
  const res = await getPublicAlbumBySlugAction(album);

  if (!res.success || !res.album) {
    notFound();
  }

  return <AlbumPage album={res.album} />;
}
