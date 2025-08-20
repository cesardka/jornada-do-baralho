"use client";

import { DECK_LIST } from "../../../app/sections/deck-list/card-data";

interface MarchingCardsProps {
  direction?: "left" | "right";
  position?: "top" | "bottom";
  opacity?: number;
}

export default function MarchingCards({
  direction = "left",
  position = "top",
  opacity = 0.15,
}: MarchingCardsProps) {
  const animationClass =
    direction === "left" ? "animate-march" : "animate-march-right";
  const positionClass = position === "top" ? "top-0" : "bottom-0";

  // Create multiple copies of the deck for seamless infinite scroll
  const cardSets = [...DECK_LIST, ...DECK_LIST, ...DECK_LIST, ...DECK_LIST];

  return (
    <div
      className={`fixed inset-x-0 ${positionClass} h-48 overflow-hidden pointer-events-none z-0`}
      style={{ opacity }}
    >
      <div
        className={`flex ${animationClass} items-center h-full py-8`}
        style={{
          width: "400%",
          transform:
            direction === "left" ? "translateX(-50%)" : "translateX(-150%)",
        }}
      >
        {cardSets.map((card, index) => (
          <img
            key={`${card.id}-${index}`}
            src={card.originalSrc}
            alt={`Carta do ${card.name}`}
            className="flex-shrink-0 mx-4 opacity-60 animate-sway"
            style={{
              width: "80px",
              height: "121.6px",
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
