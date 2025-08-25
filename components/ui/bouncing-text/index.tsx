"use client";

import React from "react";

interface BouncingTextProps {
  text: string;
  className?: string;
  // When true, letters display a moving rainbow gradient clipped to text
  rainbow?: boolean;
  // Duration in seconds for a full rainbow cycle
  rainbowSpeedSeconds?: number;
}

export default function BouncingText({
  text,
  className,
  rainbow = false,
  rainbowSpeedSeconds = 3,
}: BouncingTextProps) {
  return (
    <span className="flex space-x-[1px]">
      {text.split("").map((char, i) => {
        const delay = i * 0.02;
        const baseClass = `inline-block text-sm ${className ?? ""}`;
        const animations = rainbow
          ? `bounce 1s infinite, rainbow ${rainbowSpeedSeconds}s linear infinite`
          : `bounce 1s infinite`;
        const animationDelay = rainbow ? `${delay}s, ${delay}s` : `${delay}s`;

        const style: React.CSSProperties = rainbow
          ? {
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              backgroundImage:
                "linear-gradient(45deg, #ff004c, #ff8a00, #ffe600, #17ff00, #00f0ff, #0044ff, #b800ff, #ff004c)",
              backgroundSize: "200% 200%",
              animation: animations,
              animationDelay,
            }
          : {
              color: "#ffffff",
              animation: animations,
              animationDelay,
            };

        return (
          <span key={i} className={baseClass} style={style}>
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
      <style jsx>{`
        /* Local keyframes so inline animation references are always available */
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </span>
  );
}
