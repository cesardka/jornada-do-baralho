"use client";

import React from "react";

interface BouncingTextProps {
  text: string;
}

export default function BouncingText({ text }: BouncingTextProps) {
  return (
    <div className="flex space-x-[1px]">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block animate-bounce text-white text-sm`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
