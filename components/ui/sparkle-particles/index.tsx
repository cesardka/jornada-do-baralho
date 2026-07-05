"use client";

import { useEffect, useRef } from "react";

interface SparkleParticlesProps {
  /** Spawn frequency in sparkles per second. Default 14. */
  rate?: number;
  /** How often (roughly) the foil scanner sweeps, in ms. Default 3500. */
  arcIntervalMs?: number;
  /** Hex colors sampled per sparkle. */
  palette?: string[];
  className?: string;
}

const DEFAULT_PALETTE = ["#fff4a0", "#ffe066", "#ffd700", "#ffffff", "#ffb703"];

type SparkleState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  baseScale: number;
  rot: number;
  rotSpeed: number;
  color: string;
};

type ArcState = {
  // Perpendicular offset lerps from `perpStart` → `perpEnd` across `maxLife`,
  // producing the scanning-sweep motion. Endpoints are recomputed each frame
  // from the current offset and the fixed diagonal direction.
  perpStart: number;
  perpEnd: number;
  life: number;
  maxLife: number;
};

/**
 * Sparkling lightning particles for signed cards.
 *
 * Uses a plain 2D `<canvas>` (NOT WebGL) so many instances can coexist
 * without exhausting the browser's WebGL context budget — an important
 * consideration because there can be a dozen or more signed cards on the
 * page at once, plus a separate WebGL background.
 */
export default function SparkleParticles({
  rate = 14,
  arcIntervalMs = 3500,
  palette = DEFAULT_PALETTE,
  className = "",
}: SparkleParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const sparkles: SparkleState[] = [];
    const arcs: ArcState[] = [];

    const pickEdgePoint = () => {
      const inset = 6;
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) return { x: Math.random() * width, y: inset };
      if (edge === 1) return { x: width - inset, y: Math.random() * height };
      if (edge === 2) return { x: Math.random() * width, y: height - inset };
      return { x: inset, y: Math.random() * height };
    };

    const spawnSparkle = () => {
      const { x, y } = pickEdgePoint();
      sparkles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        life: 0,
        maxLife: 450 + Math.random() * 550,
        baseScale: 0.4 + Math.random() * 0.9,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    };

    // Foil-style diagonal scanner: a straight line running bottom-left to
    // top-right, sweeping across the card perpendicular to its own direction.
    // Each streak animates from one side of the card to the other, giving a
    // "scanner beam" feel rather than a static flash.
    const spawnArc = () => {
      // Perpendicular range spans the diagonal length so the streak fully
      // enters and exits the card during its lifetime.
      const range = Math.hypot(width, height) * 0.6;

      const makeStreak = (offsetShift: number) => ({
        perpStart: -range + offsetShift,
        perpEnd: range + offsetShift,
        life: 0,
        maxLife: 650,
      });

      arcs.push(makeStreak(0));

      // Occasionally add a second parallel streak trailing just behind the
      // first, offset perpendicular so they sweep side by side.
      if (Math.random() < 0.4) {
        const gap = 8 + Math.random() * 14;
        const dir = Math.random() < 0.5 ? 1 : -1;
        arcs.push(makeStreak(dir * gap));
      }
    };

    // Pre-baked star sprite so we don't rebuild the path each frame.
    const STAR_R = 12;
    const buildStarPath = () => {
      const path = new Path2D();
      const spikes = 4;
      const inner = STAR_R * 0.28;
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? STAR_R : inner;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      }
      path.closePath();
      return path;
    };
    const starPath = buildStarPath();

    let raf = 0;
    let prev = performance.now();
    let spawnAcc = 0;
    let arcAcc = 0;
    const spawnInterval = 1000 / Math.max(rate, 0.1);

    const tick = (now: number) => {
      const dt = Math.min(64, now - prev); // cap dt so tab-switching doesn't fire a burst
      prev = now;

      // Spawn sparkles
      spawnAcc += dt;
      while (spawnAcc >= spawnInterval) {
        spawnSparkle();
        spawnAcc -= spawnInterval;
      }

      // Occasional arc
      arcAcc += dt;
      if (arcAcc >= arcIntervalMs && Math.random() < 0.08) {
        arcAcc = 0;
        spawnArc();
      }

      // Advance sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life += dt;
        if (s.life >= s.maxLife) {
          sparkles.splice(i, 1);
          continue;
        }
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.rotSpeed * dt;
      }
      // Advance arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        arcs[i].life += dt;
        if (arcs[i].life >= arcs[i].maxLife) arcs.splice(i, 1);
      }

      // Render
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalCompositeOperation = "lighter"; // additive blend for glow

      // Sparkles
      for (const s of sparkles) {
        const k = s.life / s.maxLife;
        const twinkle = Math.sin(k * Math.PI);
        const scale = s.baseScale * (0.2 + twinkle * 0.9);
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.scale(scale, scale);
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = s.color;
        ctx.fill(starPath);
        // Central glow blob
        ctx.beginPath();
        ctx.arc(0, 0, STAR_R * 0.5, 0, Math.PI * 2);
        ctx.globalAlpha = twinkle * 0.9;
        ctx.fill();
        ctx.restore();
      }

      // Foil scanner streaks — bottom-left → top-right diagonal, sweeping
      // perpendicular across the card. Endpoints are recomputed each frame
      // from the animated `perpOffset`. Alpha uses a sin envelope so streaks
      // fade in as they enter and fade out as they leave.
      const diag = Math.hypot(width, height);
      const dx = width / diag;
      const dy = -height / diag; // BL → TR: y decreases
      const nx = -dy; // perpendicular = rotate 90° CCW: (h/diag, w/diag)
      const ny = dx;
      const halfLen = diag * 0.6;

      for (const a of arcs) {
        const k = a.life / a.maxLife;
        // Peak alpha capped at 0.5 for a subtler foil sheen.
        const alpha = Math.max(0, Math.sin(k * Math.PI)) * 0.5;
        const perpOffset = a.perpStart + (a.perpEnd - a.perpStart) * k;
        const cx = width / 2 + nx * perpOffset;
        const cy = height / 2 + ny * perpOffset;
        const x0 = cx - dx * halfLen;
        const y0 = cy - dy * halfLen;
        const x1 = cx + dx * halfLen;
        const y1 = cy + dy * halfLen;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Wide soft outer band.
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = "#fff2a0";
        ctx.globalAlpha = alpha * 0.4;
        ctx.lineWidth = 22;
        ctx.stroke();

        // Bright core.
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 5;
        ctx.stroke();
      }

      ctx.restore();

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [rate, arcIntervalMs, palette]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      // translateZ pushes the wrapper (and its canvas) in front of both flip
      // faces in the preserve-3d space of `.flip-card`, so sparkles never get
      // occluded mid-flip.
      style={{ zIndex: 5, transform: "translateZ(30px)" }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
