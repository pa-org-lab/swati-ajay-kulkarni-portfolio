"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FiGrid } from "react-icons/fi";

interface NavItem {
  label: string;
  href: string;
  icon: (props: { active: boolean }) => ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Gallery",
    href: "/admin",
    icon: ({ active }) => (
      <FiGrid
        className={`text-base shrink-0 ${active ? "text-[#a8522e]" : "text-[#a89488]"}`}
      />
    ),
  },
];

interface AdminNavProps {
  sectionTitle?: string;
  items?: NavItem[];
}

export default function AdminNav({
  sectionTitle = "Collections",
  items = NAV_ITEMS,
}: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 pt-6">
      <p className="px-3 mb-2 text-[9.5px] uppercase tracking-[0.12em] text-[#a89488] font-semibold">
        {sectionTitle}
      </p>

      <div className="space-y-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/admin" && pathname?.startsWith("/admin/gallery"));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e] ${
                isActive
                  ? "bg-[#ece4e0] text-[#a8522e] font-semibold"
                  : "text-[#6b5a50] hover:text-[#2b1f18] hover:bg-[#f6f2f0]"
              }`}
            >
              {item.icon({ active: isActive })}
              <span className="text-[13.5px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
