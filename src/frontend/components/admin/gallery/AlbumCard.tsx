"use client";

import Image from "next/image";
import { FiEdit2, FiFolder, FiTrash2 } from "react-icons/fi";
import type { AlbumData } from "@/backend/actions/album.action";

interface AlbumCardProps {
  album: AlbumData;
  onOpen: (album: AlbumData) => void;
  onEdit: (album: AlbumData) => void;
  onDelete: (album: AlbumData) => void;
}

export default function AlbumCard({
  album,
  onOpen,
  onEdit,
  onDelete,
}: AlbumCardProps) {
  return (
    <div className="relative pt-2">
      {/* Stacked sheet behind the card, so a folder never reads as a single photo */}
      <div
        className="absolute inset-x-3 top-0 h-3 rounded-t-xl bg-[#efe7e2] border border-b-0 border-[#e2d9d2]"
        aria-hidden="true"
      />

      <article
        tabIndex={0}
        role="button"
        onClick={() => onOpen(album)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(album);
          }
        }}
        className="group relative bg-white rounded-2xl border border-[#e2d9d2] shadow-[0_2px_12px_rgba(43,31,24,0.06)] hover:shadow-[0_8px_28px_rgba(43,31,24,0.12)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col focus-visible:ring-2 focus-visible:ring-[#a8522e] focus-visible:outline-none"
      >
        <div
          className="relative overflow-hidden rounded-t-2xl bg-[#ede8e5] w-full flex items-center justify-center"
          style={{ aspectRatio: "4/3" }}
        >
          {album.img ? (
            <Image
              src={album.img}
              alt={album.name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <FiFolder className="text-3xl text-[#a8522e]/40" />
          )}

          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#a8522e] text-white text-[10px] font-semibold tracking-[0.08em] uppercase shadow">
            <FiFolder className="text-[11px]" />
            Album
          </span>
        </div>

        <div className="flex items-center justify-between px-4 py-3.5 mt-auto bg-white rounded-b-2xl border-t border-[#ede9e5]">
          <div className="min-w-0 pr-2">
            <h3 className="text-[14.5px] font-semibold text-[#2b1f18] truncate leading-snug">
              {album.name}
            </h3>
            <p className="text-[10.5px] text-[#a89488] mt-0.5 tracking-[0.06em] uppercase font-medium">
              {album.count} {album.count === 1 ? "image" : "images"}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(album);
              }}
              title="Edit album"
              aria-label={`Edit album ${album.name}`}
              className="w-7 h-7 rounded-full text-[#a89488] hover:text-[#a8522e] hover:bg-[#fbf5f2] flex items-center justify-center transition-colors cursor-pointer"
            >
              <FiEdit2 className="text-xs" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(album);
              }}
              title="Delete album"
              aria-label={`Delete album ${album.name}`}
              className="w-7 h-7 rounded-full text-[#a89488] hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
