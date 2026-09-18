"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface BouncingTextProps {
  text: string;
  className?: string;
  color?: string;
  // When true, letters display a moving rainbow gradient clipped to text
  rainbow?: boolean;
  // Duration in seconds for a full rainbow cycle
  rainbowSpeedSeconds?: number;
  // Duration in seconds of one bounce for a single letter
  bounceDurationSeconds?: number;
  // Delay between adjacent letters starting their bounce (in seconds)
  stagger?: number;
  // How high each letter jumps, in em (relative to font size)
  bounceHeightEm?: number;
}

export default function BouncingText({
  text,
  className,
  color = "#ffffff",
  rainbow = false,
  rainbowSpeedSeconds = 3,
  bounceDurationSeconds = 1,
  stagger = 0.08,
  bounceHeightEm = 0.5,
}: BouncingTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-bt-letter]");
      if (letters.length === 0) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Bounce: each letter tweens up then yoyos back down, staggered by index.
        const bounce = gsap.timeline({ repeat: -1, repeatDelay: 0.7 });
        const riseDuration = bounceDurationSeconds * 0.35;
        const fallDuration = bounceDurationSeconds - riseDuration;

        letters.forEach((letter, index) => {
          const start = index * stagger;
          bounce
            .to(
              letter,
              {
                y: `-${bounceHeightEm}em`,
                duration: riseDuration,
                ease: "power2.out",
              },
              start,
            )
            .to(
              letter,
              { y: 0, duration: fallDuration, ease: "bounce.out" },
              start + riseDuration,
            );
        });

        if (rainbow) {
          gsap.to(letters, {
            backgroundPosition: "200% 50%",
            duration: rainbowSpeedSeconds,
            ease: "none",
            repeat: -1,
          });
        }
      });

      return () => media.revert();
    },
    {
      scope: containerRef,
      dependencies: [
        text,
        stagger,
        bounceDurationSeconds,
        bounceHeightEm,
        rainbow,
        rainbowSpeedSeconds,
      ],
    },
  );

  const baseClass = "inline-block text-sm";

  return (
    <span ref={containerRef} className="inline-block">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex space-x-[1px]">
        {text.split("").map((char, i) => {
          const style: React.CSSProperties = rainbow
            ? {
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                backgroundImage:
                  "linear-gradient(45deg, #ff004c, #ff8a00, #ffe600, #17ff00, #00f0ff, #0044ff, #b800ff, #ff004c)",
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 50%",
              }
            : { color };

          return (
            <span
              key={i}
              data-bt-letter={char === " " ? undefined : ""}
              className={className ? className : baseClass}
              style={style}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
