'use client';

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
  category?: string;
  description?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
  onItemClick?: (item: DriftWallItem, index: number) => void;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

const DEFAULT_ITEMS: DriftWallItem[] = Array.from({ length: 15 }, (_, i) => {
  const ids = [1015, 1025, 1039, 1043, 1044, 1050, 1062, 1069, 1074, 1080, 1084, 106, 110, 133, 164];
  return {
    image: `https://picsum.photos/id/${ids[i % ids.length]}/600/400`,
    title: `Artwork ${i + 1}`,
    href: undefined,
  };
});

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 260,
  tileHeight = 175,
  gap = 20,
  radius = 16,
  tilt = 12,
  turn = -10,
  roll = 0,
  perspective = 1200,
  depth = 80,
  speed = 36,
  direction = 'up',
  variance = 0.4,
  parallax = 0.5,
  pauseOnHover = true,
  lift = 40,
  fade = 0,
  dim = 1,
  grayscale = false,
  overlayColor = 'transparent',
  className = '',
  style,
  onItemClick,
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(650);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo<{ item: DriftWallItem; originalIndex: number }[][]>(() => {
    const cols: { item: DriftWallItem; originalIndex: number }[][] = Array.from(
      { length: columns },
      () => []
    );
    items.forEach((item, i) => cols[i % columns].push({ item, originalIndex: i }));
    return cols.map((col) => (col.length ? col : [{ item: items[0], originalIndex: 0 }]));
  }, [items, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 650);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.15) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const pointerDownPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastClickTimeRef = useRef<number>(0);

  const handleItemClick = useCallback(
    (item: DriftWallItem, index: number) => {
      const now = Date.now();
      if (now - lastClickTimeRef.current < 250) return;
      lastClickTimeRef.current = now;
      if (onItemClick) {
        onItemClick(item, index);
      }
    },
    [onItemClick]
  );

  const triggerTileAtPoint = useCallback(
    (clientX: number, clientY: number, targetElement?: HTMLElement | null): boolean => {
      let tile = targetElement?.closest('[data-tile-id]') as HTMLElement | null;
      if (!tile && typeof document !== 'undefined') {
        const hit = document.elementFromPoint(clientX, clientY);
        tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
      }
      if (tile && tile.dataset.originalIndex !== undefined) {
        const index = Number(tile.dataset.originalIndex);
        if (!isNaN(index) && items[index]) {
          handleItemClick(items[index], index);
          return true;
        }
      }
      return false;
    },
    [items, handleItemClick]
  );

  const activate = useCallback((id: string, index: number): void => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback((): void => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }
      const target = e.target as HTMLElement | null;
      let tile = target?.closest('[data-tile-id]') as HTMLElement | null;
      if (!tile && typeof document !== 'undefined') {
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
      }
      if (!tile) return;
      const id = tile.dataset.tileId ?? null;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback((): void => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const maskStyle =
    fade > 0
      ? `radial-gradient(ellipse 85% 88% at 50% 50%, #000 var(--dw-edge), transparent 100%)`
      : undefined;

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        ...(maskStyle
          ? {
              WebkitMaskImage: maskStyle,
              maskImage: maskStyle,
            }
          : {}),
        ...style,
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, fade, perspective, maskStyle, style]
  );

  const tileClass = cx(
    'group/tile relative block flex-none cursor-pointer outline-none select-none',
    'w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]'
  );

  const innerClass = cx(
    'pointer-events-auto cursor-pointer absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-stone-100 border border-stone-200/80',
    'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]',
    'transition-[transform,opacity,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]',
    'group-[.is-active]/tile:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.14)]',
    'group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]',
    'group-focus-visible/tile:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.14),0_0_0_2px_rgba(194,101,77,0.8)]'
  );

  const imgClass = cx(
    'block h-full w-full select-none object-cover',
    '[filter:grayscale(var(--dw-gray))]',
    'transition-[filter,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:scale-105 group-focus-visible/tile:scale-105'
  );

  const overlayClass = cx(
    'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)]',
    'transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
  );

  const renderTile = (
    itemData: { item: DriftWallItem; originalIndex: number },
    id: string,
    colIndex: number
  ) => {
    const { item, originalIndex } = itemData;

    const inner = (
      <span className={innerClass}>
        <img
          src={item.image}
          alt={item.title ?? ''}
          draggable={false}
          className={imgClass}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.dataset.fallback) {
              target.dataset.fallback = 'true';
              target.src =
                'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=600&q=80';
            }
          }}
        />

        {overlayColor !== 'transparent' && (
          <span className={overlayClass} aria-hidden="true" />
        )}
        {item.title && (
          <span className="absolute bottom-2.5 inset-x-2.5 px-3 py-1.5 rounded-lg bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-sans font-medium opacity-0 group-[.is-active]/tile:opacity-100 transition-opacity duration-200 truncate text-center pointer-events-none">
            {item.title}
          </span>
        )}
      </span>
    );

    const commonProps = {
      className: cx(tileClass, activeId === id && 'is-active'),
      'data-tile-id': id,
      'data-col': colIndex,
      'data-original-index': originalIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleItemClick(item, originalIndex);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick(item, originalIndex);
        }
      },
    };

    if (item.href && !onItemClick) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }

    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden select-none', className)}
      style={cssVars}
      onPointerDown={(e) => {
        pointerDownPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      }}
      onPointerUp={(e) => {
        if (pointerDownPosRef.current) {
          const dx = e.clientX - pointerDownPosRef.current.x;
          const dy = e.clientY - pointerDownPosRef.current.y;
          const dt = Date.now() - pointerDownPosRef.current.time;
          pointerDownPosRef.current = null;
          if (Math.hypot(dx, dy) < 10 && dt < 500) {
            triggerTileAtPoint(e.clientX, e.clientY, e.target as HTMLElement | null);
          }
        }
      }}
      onClick={(e) => {
        triggerTileAtPoint(e.clientX, e.clientY, e.target as HTMLElement | null);
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Interactive drifting gallery wall"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              key={`col-${c}`}
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((itemData, itemIndex) =>
                    renderTile(itemData, `${c}-${copyIndex}-${itemIndex}`, c)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
