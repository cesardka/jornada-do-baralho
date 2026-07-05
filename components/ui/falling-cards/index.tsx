"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CARD_IMAGES = [
  "nerdcast-k-alottoni.webp",
  "nerdcast-q-francine.webp",
  "nerdcast-k-srk.webp",
  "nerdcast-j-gugaferrari.webp",
  "nerdcast-k-jp.webp",
  "nerdcast-a-briggs.webp",
  "nerdcast-a-nickellis.webp",
  "nerdcast-k-azaghal.webp",
  "nerdcast-joker-fabioyabu.webp",
  "nerdcast-q-srajovemnerd.webp",
  "nerdcast-q-portuguesa.webp",
  "nerdcast-a-carlosvoltor.webp",
  "nerdcast-j-tucano.webp",
  "nerdcast-q-ruiva.webp",
  "nerdcast-j-bluehand.webp",
  "nerdcast-amigoimaginario.webp",
  "nerdcast-j-eduardospohr.webp",
  "nerdcast-a-android.webp",
  "nerdcast-joker-tresde.webp",
];

const CARD_COUNT = 50;

// Deterministic pseudo-random helpers so we get variety without hydration
// mismatches (Math.random() would differ between server & client render).
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type CardConfig = {
  id: number;
  image: string;
  leftPct: number;
  fallDelay: number;
  fallDuration: number;
  wobble: [number, number, number, number]; // x offsets at 25/50/75/100
  flipDuration: number;
  flipDelay: number;
  flipVariant: "y" | "yReverse" | "yx" | "yz";
};

const buildCardConfigs = (): CardConfig[] => {
  const rand = mulberry32(1337);
  return Array.from({ length: CARD_COUNT }, (_, i) => ({
    id: i + 1,
    image: CARD_IMAGES[i % CARD_IMAGES.length],
    leftPct: rand() * 100,
    fallDelay: rand() * 2,
    fallDuration: 7 + rand() * 3,
    wobble: [
      (rand() - 0.5) * 60,
      (rand() - 0.5) * 60,
      (rand() - 0.5) * 60,
      (rand() - 0.5) * 60,
    ],
    flipDuration: 2 + rand() * 3,
    flipDelay: rand() * 1.5,
    flipVariant: (["y", "yReverse", "yx", "yz"] as const)[i % 4],
  }));
};

export default function FallingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useRef(buildCardConfigs()).current;

  useGSAP(
    () => {
      const cardEls = gsap.utils.toArray<HTMLDivElement>(".falling-card");
      const innerEls = gsap.utils.toArray<HTMLDivElement>(".card-inner");

      cardEls.forEach((el, i) => {
        const cfg = cards[i];

        // Fall + spin: keyframes tween cycles y, x wobble, and full 3D rotations.
        // `ease: "none"` matches the original CSS `linear` timing so cards drift
        // uniformly. Repeats forever with a per-card offset delay.
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            keyframes: {
              "0%": {
                y: "-100vh",
                x: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                opacity: 0.5,
              },
              "25%": {
                y: "-50vh",
                x: cfg.wobble[0],
                rotationX: 90,
                rotationY: 180,
                rotationZ: 90,
                opacity: 0.5,
              },
              "50%": {
                y: "0vh",
                x: cfg.wobble[1],
                rotationX: 180,
                rotationY: 360,
                rotationZ: 180,
                opacity: 0.5,
              },
              "75%": {
                y: "50vh",
                x: cfg.wobble[2],
                rotationX: 270,
                rotationY: 540,
                rotationZ: 270,
                opacity: 0.5,
              },
              "100%": {
                y: "100vh",
                x: cfg.wobble[3],
                rotationX: 360,
                rotationY: 720,
                rotationZ: 360,
                opacity: 0,
              },
              easeEach: "none",
            },
            duration: cfg.fallDuration,
            delay: cfg.fallDelay,
            repeat: -1,
            ease: "none",
          },
        );

        // Card-inner flip. Four variants:
        //   y         — plain rotationY 0 → 360
        //   yReverse  — rotationY 0 → -360
        //   yx        — rotationY 0 → 360 while rocking rotationX ±45
        //   yz        — rotationY 0 → 360 while adding rotationZ 0 → 180
        const inner = innerEls[i];
        if (!inner) return;

        const base = {
          duration: cfg.flipDuration,
          delay: cfg.flipDelay,
          repeat: -1,
          ease: "none" as const,
        };
        switch (cfg.flipVariant) {
          case "y":
            gsap.to(inner, { rotationY: 360, ...base });
            break;
          case "yReverse":
            gsap.to(inner, { rotationY: -360, ...base });
            break;
          case "yx":
            gsap.to(inner, {
              keyframes: {
                "0%":   { rotationY: 0,   rotationX: 0 },
                "25%":  { rotationY: 90,  rotationX: 45 },
                "50%":  { rotationY: 180, rotationX: 0 },
                "75%":  { rotationY: 270, rotationX: -45 },
                "100%": { rotationY: 360, rotationX: 0 },
                easeEach: "none",
              },
              ...base,
            });
            break;
          case "yz":
            gsap.to(inner, {
              keyframes: {
                "0%":   { rotationY: 0,   rotationZ: 0 },
                "33%":  { rotationY: 120, rotationZ: 60 },
                "66%":  { rotationY: 240, rotationZ: 120 },
                "100%": { rotationY: 360, rotationZ: 180 },
                easeEach: "none",
              },
              ...base,
            });
            break;
        }
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} aria-hidden="true" className="contents">
      <style jsx>{`
        .falling-card {
          position: absolute;
          top: 0;
          width: 50px;
          height: 70px;
          pointer-events: none;
          z-index: 0;
          perspective: 1000px;
          opacity: 0;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {cards.map((card) => (
        <div
          key={card.id}
          className="falling-card"
          style={{ left: `${card.leftPct}%` }}
        >
          <div className="card-inner">
            <div className="card-front">
              <Image
                src={`/images/card/${card.image}`}
                alt=""
                width={50}
                height={70}
                className="w-full h-full object-cover rounded-md"
                unoptimized
              />
            </div>
            <div className="card-back">
              <Image
                src="/images/card/card-back-red.webp"
                alt=""
                width={50}
                height={70}
                className="w-full h-full object-cover rounded-md"
                unoptimized
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
