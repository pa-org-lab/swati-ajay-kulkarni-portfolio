import type { Metadata } from "next";
import AdminAnnouncementsPage from "@/frontend/pages/admin/announcements.page";

export const metadata: Metadata = {
  title: "Announcements & Community | Admin | Swati Ajay Kulkarni",
  description:
    "Manage classes, workshops, exhibitions, and community announcements",
};

export default function Page() {
  return <AdminAnnouncementsPage />;
}
