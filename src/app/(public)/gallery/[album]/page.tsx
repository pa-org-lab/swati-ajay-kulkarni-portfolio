import AlbumPage from "@/frontend/pages/public/album.page";

export default async function ({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album } = await params;

  return <AlbumPage slug={album} />;
}
