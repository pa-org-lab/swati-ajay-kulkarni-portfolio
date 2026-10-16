import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getAnnouncementsAction,
  getAnnouncementsEnabledAction,
} from "@/backend/actions/announcement.action";
import AnnouncementsSection from "@/frontend/components/public/announcements/AnnouncementsSection";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const isEnabled = await getAnnouncementsEnabledAction();
  if (!isEnabled) {
    notFound();
  }

  const res = await getAnnouncementsAction({ onlyPublished: true, limit: 100 });
  const announcements =
    res.success && res.announcements ? res.announcements : [];

  return (
    <main className="w-full">
      <Suspense fallback={<div className="w-full min-h-screen bg-[#FAF7F5]" />}>
        <AnnouncementsSection initialAnnouncements={announcements} />
      </Suspense>
    </main>
  );
}
