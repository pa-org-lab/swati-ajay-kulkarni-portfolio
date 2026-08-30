import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AdminSidebar from "@/frontend/components/admin/sidebar/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard | Swati Ajay Kulkarni",
  description: "Photography collection management dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f2eef3]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#2b1f18",
            color: "#ffffff",
            fontSize: "13.5px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(43,31,24,0.18)",
          },
          success: {
            iconTheme: {
              primary: "#BE6030",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
