"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SpriteAnimation, {
  SPRITE_MAP,
  SpriteCardId,
  SpriteVariant,
} from "../sprite-animation";

interface MarchingSpritesProps {
  /** Pixel size of each sprite (square). Default 128. */
  size?: number;
  /**
   * Spacing between sprites. Number = px, string = any CSS length
   * (e.g. "1.25rem"). Default 80 (px) — wide enough to give each sprite time
   * to load before the next scrolls into view.
   */
  spacing?: number | string;
  /** How many seconds a single sprite takes to cross the full track. Default 60. */
  durationSeconds?: number;
  /** Sprite walk-cycle framerate. Default 24. */
  fps?: number;
  /**
   * Which sprite variant to use. Default "standard" — the marching row renders
   * each frame at ~128 px so HD would just burn GPU memory.
   */
  variant?: SpriteVariant;
  /** Which cards to include (in order). Defaults to all 19. */
  cards?: SpriteCardId[];
  /**
   * How far below the viewport (in px) the component should start mounting
   * sprites. Default 400 — gives them a head start before the user reaches it.
   */
  rootMarginPx?: number;
  /**
   * Milliseconds between mounting each sprite once the section is in view.
   * Staggering avoids a big spike in image fetches / DOM work. Default 300.
   */
  mountStaggerMs?: number;
  className?: string;
}

const ALL_CARDS = Object.keys(SPRITE_MAP) as SpriteCardId[];

export default function MarchingSprites({
  size = 128,
  spacing = 80,
  durationSeconds = 60,
  fps = 24,
  variant = "standard",
  cards = ALL_CARDS,
  rootMarginPx = 400,
  mountStaggerMs = 300,
  className = "",
}: MarchingSpritesProps) {
  const gap = typeof spacing === "number" ? `${spacing}px` : spacing;
  // Duplicate the list so the marquee can loop seamlessly.
  const doubled = [...cards, ...cards];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  // How many sprites have been mounted so far (rendered inside their slots).
  const [mountedCount, setMountedCount] = useState(0);

  useEffect(() => {
    if (shouldMount) return;
    const el = containerRef.current;
    if (!el) return;

    // Fallback: no IntersectionObserver (very old browsers / SSR replay) — mount immediately.
    if (typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${rootMarginPx}px 0px` },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldMount, rootMarginPx]);

  // Once in view, mount sprites one by one on a timer so image fetches and
  // React work are spread out instead of hitting all at once.
  useEffect(() => {
    if (!shouldMount) return;
    if (mountedCount >= doubled.length) return;
    const timer = setTimeout(
      () => setMountedCount((n) => n + 1),
      mountedCount === 0 ? 0 : mountStaggerMs,
    );
    return () => clearTimeout(timer);
  }, [shouldMount, mountedCount, doubled.length, mountStaggerMs]);

  // GSAP-driven marquee. Because the track contains two identical copies of
  // the sprite list (with matching trailing gap), animating xPercent from -50
  // to 0 loops seamlessly.
  useGSAP(
    () => {
      if (!shouldMount || !trackRef.current) return;
      gsap.fromTo(
        trackRef.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          duration: durationSeconds,
          ease: "none",
          repeat: -1,
        },
      );
    },
    { scope: containerRef, dependencies: [shouldMount, durationSeconds] },
  );

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden bg-transparent ${className}`}
      style={{ minHeight: size }}
      aria-hidden="true"
    >
      {shouldMount && (
        <div
          ref={trackRef}
          className="flex w-max"
          style={{ willChange: "transform" }}
        >
          {doubled.map((card, i) => (
            <div
              key={`${card}-${i}`}
              style={{
                paddingRight: gap,
                flex: "0 0 auto",
                width: size + (typeof spacing === "number" ? spacing : 0),
                height: size,
              }}
            >
              {i < mountedCount && (
                <SpriteAnimation
                  card={card}
                  variant={variant}
                  fps={fps}
                  style={{ width: size, height: size }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
