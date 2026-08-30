import Link from "next/link";
import { FiAperture } from "react-icons/fi";

interface AdminBrandProps {
  name?: string;
  href?: string;
}

export default function AdminBrand({
  name = "swati ajay kulkarni",
  href = "/admin",
}: AdminBrandProps) {
  return (
    <div className="px-6 pt-6 pb-6">
      <Link
        href={href}
        className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e] rounded-lg p-0.5"
      >
        <div
          className="w-8 h-8 rounded-full bg-[#a8522e] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(168,82,46,0.35)] transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <FiAperture className="text-white text-xl" />
        </div>
        <span className="text-[16px] text-[#2b1f18] leading-tight font-serif italic tracking-normal">
          {name}
        </span>
      </Link>
    </div>
  );
}
