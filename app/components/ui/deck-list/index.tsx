"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

import { DECK_LIST, NerdcastCard } from "./consts";

gsap.registerPlugin(useGSAP, Flip);

const nerdcastCards = DECK_LIST;
const CARD_WIDTH = 200; // Will possibly go for hard-coded values based on screen size
const CARD_HEIGHT = CARD_WIDTH * 1.52; // Will possibly go for hard-coded values based on screen size

export default function DeckList() {
  // 1. To be used to highlight card next to menu sliding in
  const [selectedCard, setSelectedCard] = useState<NerdcastCard | null>(null);

  const container = useRef<HTMLElement | null>();
  const tl = useRef<Timeline>();

  // TBD: to put cards back on #deckbox
  const toggleTimeline = () => {
    tl.current.reversed(!tl.current.reversed());
  };

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".flip-card") as HTMLElement[];

      const deckbox = document.getElementById("deckbox");
      if (!deckbox || !cards) return;

      tl.current = gsap
        .timeline()
        // 1. Bring cards to board
        .to(cards, {
          opacity: 1,
          x: 0,
          y: 0,
          rotateY: 180,
          stagger: 0.06,
        })
        // 2. Flip cards face up
        .to(cards, {
          rotationY: 0,
          force3D: true,
          stagger: 0.04,
          duration: 2,
          ease: "elastic.out(1, 0.6)",
        })
        // 3. Randomize and loop card rotation
        .to(cards, {
          rotationX: "random(-10, 10)",
          rotationY: "random(-10, 10)",
          rotationZ: "random(-2, 2)",
          duration: "random(1, 4)",
          ease: "bezier",
          repeatRefresh: true,
          repeat: -1,
          yoyo: true,
        });
    },
    { scope: container }
  );

  // On click, the card selected should:
  // 1. Flip 360deg
  // 2. Scale to cover the left side of the screen
  // 3. A menu must slide in from the right side of the screen
  // 4. The menu must display all the details specific to the card selected
  // 5. Scroll must be disabled outside the menu
  // 6. The selected card must move slightly based on mouse position (ref: https://tcg.pokemon.com/en-us/galleries/temporal-forces/#seeall)
  const handleCardClick = (
    card: NerdcastCard,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    // console.log({ card: card, event: event });
    // event.stopPropagation();

    const cardElement = event.currentTarget;
    const overlayElement = document.getElementById("card-overlay");

    if (!overlayElement || !cardElement) return;

    const overlayRect = overlayElement.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    if (!selectedCard) {
      setSelectedCard(card);
      // Calculate the position offset to center the card in the overlay
      const translateX =
        overlayRect.left +
        overlayRect.width / 2 -
        (cardRect.left + cardRect.width / 2);
      const translateY =
        overlayRect.top +
        overlayRect.height / 2 -
        (cardRect.top + cardRect.height / 2);

      // Animate the card to the center of the overlay
      gsap.to(cardElement, {
        x: translateX,
        y: translateY,
        scale: 2.8,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  const resetCardPosition = () => {
    if (selectedCard) {
      const cardElement = document.getElementById(selectedCard.id);
      gsap.to(cardElement, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "bounce",
        onComplete: () => {},
      });

      setSelectedCard(null);
    }
  };

  const handleCardMouseEnter = (card: NerdcastCard) => {
    if (!selectedCard) {
      gsap.to(`#${card.id}`, {
        scale: 1.1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  const handleCardMouseLeave = (card: NerdcastCard) => {
    if (!selectedCard) {
      gsap.to(`#${card.id}`, {
        scale: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full overflow-y-hidden ${
          selectedCard ? "bg-black top-0 z-20 opacity-50" : "bg-transparent"
        }`}
        onClick={resetCardPosition} // Reset position on clicking outside
      >
        <div
          id="card-overlay"
          className={`sticky top-0 w-full h-screen transition-all duration-300`}
        ></div>
      </div>

      <div
        id="cards-list"
        className="flex flex-wrap items-center justify-center gap-5 container lg min-w-min"
        ref={container}
      >
        {nerdcastCards.map((card, index) => {
          return (
            <div
              id={card.id}
              key={card.id}
              className={`flip-card ${
                selectedCard && selectedCard.id === card.id ? "active z-50" : ""
              }`}
              onClick={(e) => handleCardClick(card, e)}
              onMouseEnter={() => handleCardMouseEnter(card)}
              onMouseLeave={() => handleCardMouseLeave(card)}
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
                    src="/images/card/card-back-red.webp"
                    alt="Card Nerdcast Deck Back Red"
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
