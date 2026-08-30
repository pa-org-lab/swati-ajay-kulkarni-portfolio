  "use client";

import { useEffect, useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

interface CategoryContextMenuProps {
  name: string;
  onAction?: (action: string, categoryName: string) => void;
}

const MENU_ACTIONS = [
  { label: "View Images", danger: false },
  { label: "Edit Category", danger: false },
  { label: "Rename", danger: false },
  { label: "Delete", danger: true },
];

export default function CategoryContextMenu({
  name,
  onAction,
}: CategoryContextMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleItemClick = (label: string) => {
    setOpen(false);
    if (onAction) {
      onAction(label, name);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label={`Options for ${name}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full text-[#a89488] hover:text-[#6b5a50] hover:bg-[#f2eef3] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8522e]"
      >
        <FiMoreVertical className="text-base" />
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          className="absolute right-0 top-10 z-50 bg-white border border-[#e2d9d2] rounded-2xl shadow-2xl overflow-hidden min-w-[152px] py-1 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {MENU_ACTIONS.map(({ label, danger }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              onClick={() => handleItemClick(label)}
              className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors cursor-pointer ${
                danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-[#2b1f18] hover:bg-[#f2eef3]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
