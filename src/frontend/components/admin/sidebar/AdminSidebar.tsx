import AdminBrand from "./AdminBrand";
import AdminLogout from "./AdminLogout";
import AdminNav from "./AdminNav";

interface AdminSidebarProps {
  className?: string;
  onLogout?: () => void;
}

export default function AdminSidebar({ className = "", onLogout }: AdminSidebarProps) {
  return (
    <aside
      className={`w-60 shrink-0 h-full flex flex-col bg-white border-r border-[#e2d9d2] select-none ${className}`}
    >
      {/* Brand Header */}
      <AdminBrand />

      {/* Subtle Divider */}
      <div className="mx-5 h-px bg-[#ede9e5]" />

      {/* Navigation Links */}
      <AdminNav />

      {/* Logout Action */}
      <AdminLogout onLogout={onLogout} />
    </aside>
  );
}
