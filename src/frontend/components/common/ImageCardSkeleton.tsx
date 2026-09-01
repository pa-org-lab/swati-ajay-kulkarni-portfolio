"use client";

interface ImageCardSkeletonProps {
  className?: string;
}

export function ImageCardSkeleton({ className = "" }: ImageCardSkeletonProps) {
  return (
    <article
      aria-hidden="true"
      className={`relative bg-white rounded-2xl overflow-hidden border border-[#e2d9d2] shadow-[0_2px_12px_rgba(43,31,24,0.04)] flex flex-col pointer-events-none animate-pulse ${className}`}
    >
      {/* 4:3 Aspect Ratio Image Skeleton */}
      <div
        className="relative overflow-hidden bg-[#eae4df] w-full"
        style={{ aspectRatio: "4/3" }}
      >
        {/* Top-left badge placeholder */}
        <div className="absolute top-2.5 left-2.5 w-8 h-4 rounded-full bg-[#dacfca]/70" />
      </div>

      {/* Footer / Info section skeleton */}
      <div className="p-3.5 bg-white border-t border-[#ede9e5] mt-auto">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title placeholder line */}
            <div className="h-3.5 w-3/4 rounded-md bg-[#ded6d0]" />
            {/* Description placeholder line */}
            <div className="h-2.5 w-1/2 rounded-md bg-[#ede7e2]" />
          </div>

          {/* Action button placeholders */}
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <div className="w-6 h-6 rounded-full bg-[#ede7e2]" />
            <div className="w-6 h-6 rounded-full bg-[#ede7e2]" />
          </div>
        </div>
      </div>
    </article>
  );
}

interface ImageGridSkeletonProps {
  count?: number;
  className?: string;
}

const SKELETON_SLOTS = [
  "skel-1",
  "skel-2",
  "skel-3",
  "skel-4",
  "skel-5",
  "skel-6",
  "skel-7",
  "skel-8",
  "skel-9",
  "skel-10",
  "skel-11",
  "skel-12",
];

export default function ImageGridSkeleton({
  count = 12,
  className = "",
}: ImageGridSkeletonProps) {
  const slots =
    count <= SKELETON_SLOTS.length
      ? SKELETON_SLOTS.slice(0, count)
      : Array.from({ length: count }, (_, i) => `skel-slot-${i + 1}`);

  return (
    <div
      role="status"
      aria-label="Loading photos"
      className={`grid gap-5 ${className}`}
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}
    >
      {slots.map((id) => (
        <ImageCardSkeleton key={id} />
      ))}
    </div>
  );
}
