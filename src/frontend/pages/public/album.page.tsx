import type { PublicAlbumDetail } from "@/backend/actions/album.action";
import AlbumView from "@/frontend/components/public/gallery/AlbumView";

interface AlbumPageProps {
  album: PublicAlbumDetail;
}

export default function AlbumPage({ album }: AlbumPageProps) {
  return (
    <main className="w-full">
      <AlbumView album={album} />
    </main>
  );
}
