"use client";

import Image from "next/image";
import { useState } from "react";
import { DECK_LIST } from "./consts";

export default function DeckList() {
  const nerdcastCards = DECK_LIST;
  //   for (let i = 0; i < 18; i++) {
  //     cards.push({ id: i, name: `Red ${i}`, color: "red", value: i });
  //   }

  const [flipped, setFlipped] = useState(
    Array(nerdcastCards.length).fill(false)
  );

  const handleCardClick = (index: number) => {
    setFlipped((prev) =>
      prev.map((isFlipped, i) => (i === index ? !isFlipped : isFlipped))
    );
  };

  const CARD_WIDTH = 100;
  const CARD_HEIGHT = CARD_WIDTH * 1.5;

  return (
    <div
      id="cards-list"
      className="flex flex-wrap items-center justify-center gap-5 container lg min-w-min"
    >
      {nerdcastCards.map((card, index) => {
        const animationDelay = `${index * 100}ms`;
        return (
          <div
            key={card.id}
            className={`flip-card flip-horizontal-left ${
              flipped[index] ? "flipped-card" : ""
            } fade-in`}
            style={{ animationDelay }}
            onClick={() => handleCardClick(index)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <Image
                  src={card.originalSrc}
                  alt={`Nerdcast card "${card.name}"`}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                />
              </div>
              <div className="flip-card-back">
                <Image
                  src="/images/card/card-back-blue.webp"
                  alt="Card Nerdcast Deck Back Blue"
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
