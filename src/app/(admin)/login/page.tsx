import type { Metadata } from "next";
import AdminLoginPage from "@/frontend/pages/admin/login.page";

export const metadata: Metadata = {
  title: "Admin Login | Swati Ajay Kulkarni",
  description: "Secure entry to creative management.",
};

export default function LoginPage() {
  return <AdminLoginPage />;
}
