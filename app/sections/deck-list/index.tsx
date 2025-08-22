"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/all";
import { useGSAP } from "@gsap/react";

import { DECK_LIST, NerdcastCard } from "./card-data";
import CardDetails from "../card-details";
import { useScreenWidth } from "../../hooks/useScreenWidth";
import { useAnimation } from "../../contexts/AnimationContext";

gsap.registerPlugin(useGSAP);

const nerdcastCards = DECK_LIST;
const CARD_WIDTH = 100; // Will possibly go for hard-coded values based on screen size
const CARD_HEIGHT = CARD_WIDTH * 1.52; // Will possibly go for hard-coded values based on screen size
const FRONT_FACING_CARD_DEG = 0;
const BACK_FACING_CARD_DEG = 180;
const DEFAULT_ANIMATION_DURATION = 0.5;

const getScaleBasedOnScreenWidth = () => {
  const screenWidth = window.innerWidth;

  console.log({ screenWidth });

  if (screenWidth > 1440) return 2.5;
  if (screenWidth > 1024) return 1.8;
  if (screenWidth > 768) return 1.5;
  return 1.5; // Increased from 1.3 to 2.0 for mobile devices
};

const applyIdleAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    rotationX: "random(-10, 10)",
    rotationY: "random(-10, 10)",
    rotationZ: "random(-2, 2)",
    duration: "random(1, 4)",
    ease: "bezier",
    repeatRefresh: true,
    repeat: -1,
    yoyo: true,
  });
};

export default function DeckList() {
  // 1. To be used to highlight card next to menu sliding in
  const [selectedCard, setSelectedCard] = useState<NerdcastCard | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useScreenWidth(); // TODO: will probably need to move up to the layout, so we can use it in other components

  // Navigation function used by keyboard, arrows UI and touch
  const navigateToCard = useCallback(
    (direction: "prev" | "next") => {
      if (!selectedCard || isTransitioning || selectedCardIndex === -1) return;

      const currentIndex = selectedCardIndex;
      let newIndex: number;

      if (direction === "prev") {
        newIndex =
          currentIndex === 0 ? nerdcastCards.length - 1 : currentIndex - 1;
      } else {
        newIndex =
          currentIndex === nerdcastCards.length - 1 ? 0 : currentIndex + 1;
      }

      const newCard = nerdcastCards[newIndex];
      const currentCardElement = document.getElementById(selectedCard.id);
      const newCardElement = document.getElementById(newCard.id);
      const cardDetailsElement = document.getElementById("card-details");
      const overlayElement = document.getElementById("card-overlay");

      if (
        !currentCardElement ||
        !newCardElement ||
        !cardDetailsElement ||
        !overlayElement
      )
        return;

      setIsTransitioning(true);

      // Get overlay position for new card positioning
      const overlayRect = overlayElement.getBoundingClientRect();
      const newCardRect = newCardElement.getBoundingClientRect();

      const translateX =
        overlayRect.left +
        overlayRect.width / 2 -
        (newCardRect.left + newCardRect.width / 2);
      const translateY =
        overlayRect.top +
        overlayRect.height / 2 -
        (newCardRect.top + newCardRect.height / 2);

      const timeline = gsap.timeline();

      timeline
        // Reset z-index of current card and set z-index for new card
        .set(currentCardElement, { zIndex: "" })
        .set(newCardElement, { zIndex: 40 })
        // Slide out modal content
        .to(cardDetailsElement, {
          ...(isMobile ? { y: "100%" } : { x: "100%" }),
          duration: DEFAULT_ANIMATION_DURATION,
          ease: "expo.inOut",
        })
        // Scale current card back to original position
        .to(
          currentCardElement,
          {
            x: 0,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: DEFAULT_ANIMATION_DURATION,
            ease: "expo.inOut",
            onComplete: () => {
              // Apply idle animation to the old card
              applyIdleAnimation(currentCardElement);
            },
          },
          0
        )
        // Scale and position new card to highlighted state
        .to(
          newCardElement,
          {
            x: translateX,
            y: translateY,
            scale: getScaleBasedOnScreenWidth(),
            duration: DEFAULT_ANIMATION_DURATION,
            ease: "expo.inOut",
          },
          0
        )
        // Update state
        .call(() => {
          setSelectedCard(newCard);
          setSelectedCardIndex(newIndex);
        })
        // Slide in modal content with new data
        .to(cardDetailsElement, {
          ...(isMobile ? { y: 0 } : { x: 0 }),
          duration: DEFAULT_ANIMATION_DURATION,
          ease: "expo.inOut",
          onComplete: () => {
            setIsTransitioning(false);
          },
        });
    },
    [selectedCard, selectedCardIndex, isMobile, isTransitioning]
  );

  // Add keyboard navigation and touch swipe detection
  useEffect(() => {
    if (!selectedCard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateToCard("prev");
      } else if (e.key === "ArrowRight") {
        navigateToCard("next");
      }
    };

    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          navigateToCard("next");
        } else {
          navigateToCard("prev");
        }
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart as EventListener);
    window.addEventListener("touchend", handleTouchEnd as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(
        "touchstart",
        handleTouchStart as EventListener
      );
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [selectedCard, navigateToCard]);

  // Reset card details position when screen size changes
  useEffect(() => {
    if (selectedCard) {
      const cardDetailsElement = document.getElementById("card-details");
      if (cardDetailsElement) {
        // Clear any existing GSAP transforms
        gsap.set(cardDetailsElement, { clearProps: "all" });

        // Apply the correct initial position based on current screen size
        const initialPosition = isMobile ? { y: "100%" } : { x: "100%" };
        gsap.set(cardDetailsElement, initialPosition);

        // Animate to visible position
        const visiblePosition = isMobile ? { y: 0 } : { x: 0 };
        gsap.to(cardDetailsElement, {
          ...visiblePosition,
          duration: DEFAULT_ANIMATION_DURATION,
          ease: "expo.inOut",
        });
      }
    }
  }, [isMobile, selectedCard]);

  const container = useRef<HTMLDivElement | null>(null);

  const { animationEnded, setAnimationEnded } = useAnimation();

  // // Scroll to top of the page
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollToPlugin);

      const handleLoad = () => {
        gsap.to(window, {
          scrollTo: 0,
        });
      };

      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }
  }, []);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".flip-card") as HTMLElement[];
      if (!cards) return;

      document.body.style.overflow = "hidden";

      // const deckbox = document.getElementById("deckbox");
      // const overlayContainer = document.getElementById("overlay-container");

      // if (!deckbox || !overlayContainer) return;

      // const deckboxRect = deckbox?.getBoundingClientRect();
      // const overlayContainerRect = overlayContainer?.getBoundingClientRect();

      // const translateX =
      //   overlayContainerRect.left +
      //   overlayContainerRect.width / 2 -
      //   (deckboxRect.left + deckboxRect.width / 2);
      // const translateY =
      //   overlayContainerRect.top +
      //   overlayContainerRect.height / 2 -
      //   (deckboxRect.top + deckboxRect.height / 2);

      gsap
        .timeline()
        // DECKBOX
        // 1. Position deckbox to center of page
        // .to(deckbox, {
        //   x: translateX,
        //   y: translateY,
        //   scale: 2,
        // })
        // 2. Reveal deckbox
        // .to(deckbox, {
        //   opacity: 1,
        //   duration: 1,
        // })
        // 3. Animate deckbox to its final position
        // .to(deckbox, {
        //   x: 0,
        //   y: 0,
        //   scale: 1,
        //   delay: 1,
        //   duration: DEFAULT_ANIMATION_DURATION,
        //   ease: "elastic.out(1, 0.5)",
        //   onComplete: () => {},
        // })
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
          onComplete: () => {
            setAnimationEnded(true);
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
      const cardIndex = nerdcastCards.findIndex((c) => c.id === card.id);
      setSelectedCard(card);
      setSelectedCardIndex(cardIndex);

      const translateX =
        overlayRect.left +
        overlayRect.width / 2 -
        (cardRect.left + cardRect.width / 2);
      const translateY =
        overlayRect.top +
        overlayRect.height / 2 -
        (cardRect.top + cardRect.height / 2);

      gsap.to(cardElement, {
        x: translateX,
        y: translateY,
        scale: getScaleBasedOnScreenWidth(),
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "expo.inOut",
      });

      const direction = isMobile ? { y: 0 } : { x: 0 };

      gsap.to("#card-details", {
        ...direction,
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "expo.inOut",
      });

      document.body.style.overflow = "hidden";
      return;
    }

    if (selectedCard?.id === card.id) {
      gsap.killTweensOf(cardElement);
      gsap.to(cardElement, {
        rotationY: isFlipped ? FRONT_FACING_CARD_DEG : BACK_FACING_CARD_DEG,
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "expo.inOut",
        transformOrigin: "center",
        onComplete: () => {
          setIsFlipped(!isFlipped);
        },
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
        rotationY: 0,
        zIndex: "",
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "expo.inOut",
        onComplete: () => {
          if (cardElement) applyIdleAnimation(cardElement);
        },
      });

      const direction = isMobile
        ? {
            y: "100%",
          }
        : { x: "100%" };

      gsap.to("#card-details", {
        ...direction,
        duration: DEFAULT_ANIMATION_DURATION,
        ease: "expo.inOut",
        onComplete: () => {
          setSelectedCard(null);
          setSelectedCardIndex(-1);
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
    <section className="segment w-full min-h-screen h-full flex flex-col items-center justify-center bg-[url('/images/bg/8764038.jpg')] bg-cover bg-no-repeat bg-center pb-8">
      {/* Card overlay */}
      {animationEnded && (
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
            className={`w-full h-full flex-grow basis-3/5 pb-20 relative`}
            onClick={resetCardPosition}
          >
            {/* Navigation arrows */}
            {selectedCard && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToCard("prev");
                  }}
                  disabled={isTransitioning}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-40"
                  aria-label="Carta anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToCard("next");
                  }}
                  disabled={isTransitioning}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-40"
                  aria-label="Próxima carta"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
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
      )}

      {/* Card list */}
      <div
        id="cards-list"
        className={`flex flex-wrap items-center justify-center gap-5 container mx-8 lg min-w-min`}
        ref={container}
      >
        {nerdcastCards.map((card) => {
          return (
            <div
              id={card.id}
              key={card.id}
              className={`flip-card -mx-8 ${
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
                    alt={`Carta do Nerdcaster "${card.name}"`}
                    className={card.signedOn ? "gold-outline" : ""}
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                  />
                </div>
                <div className="flip-card-back">
                  <Image
                    src="/images/card/card-back-blue.webp"
                    alt="Card Nerdcast Deck Back Red"
                    className={card.signedOn ? "gold-outline" : ""}
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
      {/* <ProgressBar /> */}
    </section>
  );
}
