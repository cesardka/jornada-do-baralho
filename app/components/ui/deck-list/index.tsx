"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip, ScrollToPlugin } from "gsap/all";

import { DECK_LIST, NerdcastCard } from "./consts";
import ProgressBar from "../progress-bar";
import { useScreenWidth } from "../../useScreenWidth";
import CardDetails from "../card-details";

gsap.registerPlugin(useGSAP, ScrollToPlugin, Flip);

const nerdcastCards = DECK_LIST;
const CARD_WIDTH = 200; // Will possibly go for hard-coded values based on screen size
const CARD_HEIGHT = CARD_WIDTH * 1.52; // Will possibly go for hard-coded values based on screen size

const getScaleBasedOnScreenSize = () => {
  const screenSize = window.innerWidth;

  if (screenSize > 1440) return 2.5;
  if (screenSize > 1024) return 1.8;
  if (screenSize > 768) return 1.5;
  return 1.3;
};

export default function DeckList() {
  // 1. To be used to highlight card next to menu sliding in
  const [selectedCard, setSelectedCard] = useState<NerdcastCard | null>(null);
  const isMobile = useScreenWidth(); // will probably need to move up to the layout, so we can use it in other components

  const container = useRef<HTMLElement | null>();

  if (!!window) {
    // Scroll to top of the page
    window.addEventListener("load", function (event) {
      gsap.to(window, {
        scrollTo: 0,
      });
    });
  }

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".flip-card") as HTMLElement[];
      if (!cards) return;

      document.body.style.overflow = "hidden";

      const deckbox = document.getElementById("deckbox");
      const overlayContainer = document.getElementById("overlay-container");

      if (!deckbox || !overlayContainer) return;

      const deckboxRect = deckbox?.getBoundingClientRect();
      const overlayContainerRect = overlayContainer?.getBoundingClientRect();

      const translateX =
        overlayContainerRect.left +
        overlayContainerRect.width / 2 -
        (deckboxRect.left + deckboxRect.width / 2);
      const translateY =
        overlayContainerRect.top +
        overlayContainerRect.height / 2 -
        (deckboxRect.top + deckboxRect.height / 2);

      gsap
        .timeline()
        // DECKBOX
        // 1. Position deckbox to center of page
        .to(deckbox, {
          x: translateX,
          y: translateY,
          scale: 2,
        })
        // 2. Reveal deckbox
        .to(deckbox, {
          opacity: 1,
          duration: 1,
        })
        // 3. Animate deckbox to its final position
        .to(deckbox, {
          x: 0,
          y: 0,
          scale: 1,
          delay: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {},
        })
        // CARDS
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
          stagger: 0.02,
          duration: 2,
          ease: "elastic.out(1, 0.6)",
          onStart: () => {
            document.body.style.overflow = "";
          },
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
        scale: getScaleBasedOnScreenSize(), // TODO: use screen size to determine scale
        duration: 0.5,
        // ease: "elastic.out(1, 0.5)",
        ease: "expo.inOut",
      });

      const direction = isMobile ? { y: 0 } : { x: 0 };

      gsap.to("#card-details", {
        ...direction,
        duration: 0.5,
        ease: "expo.inOut",
      });

      document.body.style.overflow = "hidden";
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
      });

      const direction = isMobile
        ? {
            y: "100%",
          }
        : { x: "100%" };

      gsap.to("#card-details", {
        ...direction,
        duration: 0.3,
        ease: "elastic.out(1, 0.8)",
        onComplete: () => {
          setSelectedCard(null);
        },
      });

      document.body.style.overflow = "";
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
      {/* Card overlay */}
      <div
        id="overlay-container"
        className={`
          fixed top-0 left-0 w-full h-full transition-all duration-500 
          flex ${isMobile ? "flex-col" : "flex-row"}
          ${selectedCard ? "z-30 bg-black bg-opacity-80" : ""}
        `}
      >
        <div
          id="card-overlay"
          className={`w-full h-full flex-grow basis-3/5 pb-20`}
          onClick={resetCardPosition}
        />
        <div
          id="card-details"
          className={`w-full h-full flex-grow basis-2/5 ${
            isMobile ? "translate-y-full" : "translate-x-full"
          }`}
        >
          <CardDetails
            card={selectedCard}
            isMobile={isMobile}
            closeModal={resetCardPosition}
          />
        </div>
      </div>

      {/* Card list */}
      <div
        id="cards-list"
        className={`flex flex-wrap items-center justify-center gap-5 container lg min-w-min`}
        ref={container}
      >
        {nerdcastCards.map((card) => {
          return (
            <div
              id={card.id}
              key={card.id}
              className={`flip-card ${
                selectedCard && selectedCard.id === card.id ? "active z-30" : ""
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
                    src="/images/card/card-back-blue.webp"
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

      {/* Progress Bar */}
      <ProgressBar />
    </>
  );
}
