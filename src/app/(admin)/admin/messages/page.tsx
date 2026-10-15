import type { Metadata } from "next";
import AdminMessagesPage from "@/frontend/pages/admin/messages.page";

export const metadata: Metadata = {
  title: "Messages & Inquiries | Admin | Swati Ajay Kulkarni",
  description: "View and manage contact form submissions",
};

export default function Page() {
  return <AdminMessagesPage />;
}
