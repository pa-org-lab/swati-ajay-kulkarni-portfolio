'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  TouchEvent
} from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export interface AccordionGalleryItem {
  image: string;
  label: string;
  worksCount?: string;
  link: string;
  alt?: string;
  description?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: '/images/midnight-cosmos.jpg', label: 'Painting', worksCount: '4 WORKS', link: '/gallery?category=painting' },
  { image: '/images/portrait-ethereal-gaze.jpg', label: 'Photography', worksCount: '5 WORKS', link: '/gallery?category=photography' },
  { image: '/images/landscape-misty-peaks.jpg', label: 'Trekking', worksCount: '3 WORKS', link: '/gallery?category=trekking' },
  { image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80', label: 'Cooking', worksCount: '6 WORKS', link: '/gallery?category=cooking' },
  { image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80', label: 'Gardening', worksCount: '4 WORKS', link: '/gallery?category=gardening' }
];

export default function AccordionGallery({
  items = DEFAULT_ITEMS,
  defaultIndex = 0,
  accentColor = '#c2654d',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 520,
  gap = 12,
  radius = 20,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = ''
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const collapsedContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(360);

  const [isCompact, setIsCompact] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 720;
    }
    return false;
  });
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  // Touch swipe tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // ResizeObserver and media query listener for responsive compact mode (< 720px width)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const checkWidth = () => {
      setIsCompact(el.getBoundingClientRect().width < 720 || window.innerWidth < 720);
    };

    checkWidth();
    const ro = new ResizeObserver(() => checkWidth());
    ro.observe(el);
    window.addEventListener('resize', checkWidth);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  const isVertical = orientation === 'vertical' || isCompact;

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const overlayBg = `linear-gradient(180deg, transparent 15%, rgba(10, 8, 12, 0.4) 55%, rgba(10, 8, 12, 0.92) 100%), color-mix(in srgb, ${overlayColor} calc(var(--ag-dim, 0.3) * 100%), transparent)`;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = isVertical
        ? Math.min(Math.max(expandRatio, 0.46), 0.6)
        : Math.min(Math.max(expandRatio, 0.32), 0.65);

      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const activeContent = activeContentRefs.current[i];
        const collapsedContent = collapsedContentRefs.current[i];

        // 3D tilt
        const rot = isActive || isVertical ? 0 : i < active ? tilt : -tilt;
        const rotProp = isVertical
          ? { rotateX: 0, rotateY: 0 }
          : { rotateY: rot, rotateX: 0 };

        tl.to(
          panel,
          {
            flexGrow: isActive ? grow : 1,
            ...rotProp,
            duration: dur,
            ease
          },
          0
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 0.85) : 0;

          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: isVertical ? 0 : isActive ? 0 : shift,
              y: isVertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.45,
              duration: dur,
              ease
            },
            0
          );
        }

        if (showLabels) {
          if (activeContent) {
            if (isActive) {
              tl.to(
                activeContent,
                {
                  opacity: 1,
                  y: 0,
                  duration: dur,
                  ease,
                  stagger: prefersReduced ? 0 : stagger,
                  pointerEvents: 'auto'
                },
                0
              );
            } else {
              tl.to(
                activeContent,
                {
                  opacity: 0,
                  y: 12,
                  duration: dur * 0.5,
                  ease,
                  pointerEvents: 'none'
                },
                0
              );
            }
          }

          if (collapsedContent) {
            if (!isActive) {
              tl.to(
                collapsedContent,
                {
                  opacity: 1,
                  duration: dur,
                  ease,
                  pointerEvents: 'auto'
                },
                0
              );
            } else {
              tl.to(
                collapsedContent,
                {
                  opacity: 0,
                  duration: dur * 0.4,
                  ease,
                  pointerEvents: 'none'
                },
                0
              );
            }
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      isVertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = isVertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(160, usable * Math.min(Math.max(expandRatio, 0.3), 0.7) * 1.3);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, isVertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  const handleEnter = (i: number) => {
    if (trigger === 'hover' && !isCompact) setActive(i);
  };

  const handleCardClick = (i: number) => {
    setActive(i);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  // Touch navigation for mobile
  const handleTouchStart = (e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (isVertical) {
      if (deltaY < -40) setActive((prev) => (prev + 1) % count);
      else if (deltaY > 40) setActive((prev) => (prev - 1 + count) % count);
    } else {
      if (deltaX < -40) setActive((prev) => (prev + 1) % count);
      else if (deltaX > 40) setActive((prev) => (prev - 1 + count) % count);
    }
    touchStartRef.current = null;
  };

  // Responsive height calculation
  const containerHeight = isVertical
    ? Math.max(560, count * 72 + 160)
    : height;

  return (
    <div
      ref={rootRef}
      className={`flex ${isVertical ? 'flex-col' : 'flex-row'} w-full max-w-full ${
        isVertical ? '[perspective:none]' : '[perspective:1600px]'
      } ${className}`}
      style={{
        gap: `${gap}px`,
        height: `${containerHeight}px`
      }}
      role="list"
      aria-label="Collections and categories accordion"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, i) => {
        const isActive = i === active;

        return (
          <div
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="group relative block min-w-0 min-h-0 flex-[1_1_0] cursor-pointer overflow-hidden bg-[#0c0a10] outline-none [transform-style:preserve-3d] [transform-origin:center] rounded-2xl sm:rounded-3xl border border-black/10 shadow-lg select-none"
            style={
              {
                borderRadius: `${radius}px`,
                '--ag-accent': accentColor,
                willChange: 'flex-grow, transform'
              } as CSSProperties
            }
            onClick={() => handleCardClick(i)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`${item.label} collection, ${item.worksCount || ''}`}
          >
            {/* Background Image Canvas */}
            <span className="absolute inset-0 overflow-hidden [border-radius:inherit]">
              <span
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
                className="absolute top-1/2 left-1/2 [filter:grayscale(var(--ag-gray,1))]"
                style={{
                  width: isVertical ? '100%' : 'var(--ag-media-size, 360px)',
                  height: isVertical ? 'var(--ag-media-size, 360px)' : '100%',
                  willChange: 'transform, filter'
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable={false}
                  className="block h-full w-full select-none object-cover [-webkit-user-drag:none]"
                />
              </span>
              <span
                className="pointer-events-none absolute inset-0"
                style={{ background: overlayBg }}
                aria-hidden="true"
              />
            </span>

            {/* Subtle terracotta indicator line at card edge */}
            <div
              className={`absolute ${
                isVertical ? 'top-0 left-0 right-0 h-[3px]' : 'top-0 bottom-0 left-0 w-[3px]'
              } bg-[#c2654d] ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* 1. COLLAPSED VIEW CONTENT (Visible when inactive) */}
            <div
              ref={(el) => {
                collapsedContentRefs.current[i] = el;
              }}
              className={`pointer-events-none absolute inset-0 z-[2] flex ${
                isVertical
                  ? 'flex-row items-center justify-between px-5 py-3'
                  : 'flex-col justify-end items-center pb-8'
              }`}
              aria-hidden={isActive ? 'true' : undefined}
            >
              {isVertical ? (
                // Collapsed Strip in Mobile Vertical mode: Horizontal bar with number, title & count
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-medium tracking-[0.2em] text-[#eddfe2]/70 uppercase">
                      0{i + 1}
                    </span>
                    <span className="font-serif italic text-lg text-white font-normal drop-shadow-sm">
                      {item.label}
                    </span>
                  </div>
                  {item.worksCount && (
                    <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-stone-300/85">
                      {item.worksCount}
                    </span>
                  )}
                </div>
              ) : (
                // Collapsed Strip in Desktop Horizontal mode: Elegant Vertical Label
                <div className="flex flex-col items-center gap-3.5 [writing-mode:vertical-rl] rotate-180">
                  <span className="font-serif italic text-xl xl:text-2xl text-white/95 tracking-wide select-none drop-shadow-md whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.worksCount && (
                    <span className="text-[9px] font-sans font-medium tracking-[0.26em] uppercase text-[#eddfe2]/75 select-none whitespace-nowrap">
                      {item.worksCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 2. ACTIVE EXPANDED VIEW CONTENT (Visible when active) */}
            <div
              ref={(el) => {
                activeContentRefs.current[i] = el;
              }}
              className="pointer-events-none absolute inset-0 z-[3] flex flex-col justify-end p-6 sm:p-8 lg:p-10"
              aria-hidden={!isActive ? 'true' : undefined}
            >
              {/* Works Count Badge */}
              {item.worksCount && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[2px] w-4 bg-[#c2654d]" />
                  <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-stone-200">
                    {item.worksCount}
                  </span>
                </div>
              )}

              {/* Category Name in Serif Italic */}
              <h3 className="font-serif italic text-3xl sm:text-4xl lg:text-[46px] text-white font-normal leading-[1.1] tracking-tight mb-2 sm:mb-3 drop-shadow-md">
                {item.label}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="text-xs sm:text-sm text-stone-200/90 font-sans font-light leading-relaxed max-w-md mb-4 hidden sm:block">
                  {item.description}
                </p>
              )}

              {/* CTA Link to Category Gallery */}
              <div className="pt-1 pointer-events-auto">
                <Link
                  href={item.link}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2.5 text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/95 hover:text-white group/link"
                >
                  <span className="border-b border-white/40 pb-0.5 group-hover/link:border-white">
                    Explore Collection
                  </span>
                  <span className="inline-block text-[#c2654d]">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
