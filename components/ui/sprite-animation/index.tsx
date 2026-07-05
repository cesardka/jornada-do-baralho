"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export const SPRITE_MAP: Record<string, string> = {
  alottoni: "/images/sprites/01_alottoni.webp",
  azaghal: "/images/sprites/02_azaghal.webp",
  jp: "/images/sprites/03_jp.webp",
  sr_k: "/images/sprites/04_sr_k.webp",
  francine: "/images/sprites/05_francine.webp",
  ruiva: "/images/sprites/06_ruiva.webp",
  portuguesa: "/images/sprites/07_portuguesa.webp",
  sra_jovem_nerd: "/images/sprites/08_sra_jovem_nerd.webp",
  fabio_yabu: "/images/sprites/09_fabio_yabu.webp",
  tresde: "/images/sprites/10_tresde.webp",
  bluehand: "/images/sprites/11_bluehand.webp",
  spohr: "/images/sprites/12_spohr.webp",
  guga_ferrari: "/images/sprites/13_guga_ferrari.webp",
  tucano: "/images/sprites/14_tucano.webp",
  nick_ellis: "/images/sprites/15_nick_ellis.webp",
  android: "/images/sprites/16_android.webp",
  briggs: "/images/sprites/17_briggs.webp",
  carlos_voltor: "/images/sprites/18_carlos_voltor.webp",
  amigo_imaginario: "/images/sprites/19_amigo_imaginario.webp",
};

export type SpriteCardId = keyof typeof SPRITE_MAP;

export type SpriteVariant = "standard" | "hd";

interface SpriteAnimationProps {
  card?: SpriteCardId | string;
  variant?: SpriteVariant;
  fps?: number;
  frameCount?: number;
  columns?: number;
  rows?: number;
  playing?: boolean;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

function resolveSrc(card: string, variant: SpriteVariant): string {
  const base = SPRITE_MAP[card] ?? SPRITE_MAP.alottoni;
  return variant === "hd" ? base.replace(/\.webp$/, "-hd.webp") : base;
}

export default function SpriteAnimation({
  card = "alottoni",
  variant = "standard",
  fps = 24,
  frameCount = 24,
  columns = 5,
  rows = 5,
  playing = true,
  className = "",
  style,
  alt,
}: SpriteAnimationProps) {
  const src = resolveSrc(card, variant);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || fps <= 0) return;

    // Every sprite reads from the same clock (gsap.ticker.time in seconds),
    // so all instances show the same frame regardless of when they mounted.
    const period = frameCount / fps;

    const handler = () => {
      if (!elRef.current) return;
      const t = gsap.ticker.time % period;
      const f = Math.floor((t / period) * frameCount) % frameCount;
      const col = f % columns;
      const row = Math.floor(f / columns);
      const posX = columns > 1 ? (col / (columns - 1)) * 100 : 0;
      const posY = rows > 1 ? (row / (rows - 1)) * 100 : 0;
      elRef.current.style.backgroundPosition = `${posX}% ${posY}%`;
    };

    gsap.ticker.add(handler);
    return () => gsap.ticker.remove(handler);
  }, [playing, fps, frameCount, columns, rows]);

  return (
    <div
      ref={elRef}
      role="img"
      aria-label={alt ?? `Sprite animation ${card}`}
      className={`aspect-square ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${columns * 100}% ${rows * 100}%`,
        backgroundPosition: "0% 0%",
        backgroundRepeat: "no-repeat",
        imageRendering: "auto",
        ...style,
      }}
    />
  );
}
