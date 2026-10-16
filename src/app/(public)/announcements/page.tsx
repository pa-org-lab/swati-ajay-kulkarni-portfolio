import type { Metadata } from "next";
import AnnouncementsPage from "@/frontend/pages/public/announcements.page";

export const metadata: Metadata = {
  title: "Announcements & Gatherings | Swati Ajay Kulkarni",
  description:
    "Explore upcoming photography masterclasses, workshops, gallery exhibitions, and community photowalk invitations.",
};

export default function Page() {
  return <AnnouncementsPage />;
}
