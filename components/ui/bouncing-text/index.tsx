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

      // Bounce: each letter tweens up then yoyos back down, staggered by index.
      gsap.to(letters, {
        y: `-${bounceHeightEm}em`,
        duration: bounceDurationSeconds / 2,
        ease: "sine.inOut",
        stagger,
        yoyo: true,
        repeat: -1,
      });

      if (rainbow) {
        gsap.to(letters, {
          backgroundPosition: "200% 50%",
          duration: rainbowSpeedSeconds,
          ease: "none",
          repeat: -1,
        });
      }
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
    <span ref={containerRef} className="flex space-x-[1px]">
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
            data-bt-letter
            className={className ? className : baseClass}
            style={style}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}
