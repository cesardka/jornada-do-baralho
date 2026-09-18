"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bebasNeue } from "@/app/fonts";
import { useI18n } from "@/app/contexts/I18nContext";
import { usePerformanceTier } from "../_hooks/use-performance-tier";
import GalacticBackground from "@/components/ui/galactic-background";
import SparkleParticles from "@/components/ui/sparkle-particles";
import {
  DECK_LIST,
  parseSignedDate,
  type NerdcastCard,
} from "@/app/sections/deck-list/card-data";
import { FallingWords } from "./countdown-section";
import styles from "./signed-cards-carousel.module.css";

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

type SignedCard = NerdcastCard & {
  signedOn: string;
  signedLocation: string;
  signedSrc: string;
};

const signedCards = DECK_LIST.filter(
  (card): card is SignedCard =>
    card.signedOn !== null &&
    card.signedLocation !== null &&
    card.signedSrc !== null,
).sort(
  (first, second) =>
    first.signedOn.localeCompare(second.signedOn) ||
    (first.signedOrder ?? Number.MAX_SAFE_INTEGER) -
      (second.signedOrder ?? Number.MAX_SAFE_INTEGER),
);

const getCardPlaceholder = (source: string) =>
  source.replace("/images/card/", "/images/cards-LQ/");

const getSignedPhotoPlaceholder = (source: string) => {
  const filename = source.slice(source.lastIndexOf("/") + 1);
  return `/images/signed-cards-LQ/${filename.replace(/\.[^.]+$/, ".webp")}`;
};

const capitalizeFirst = (value: string, locale: string) => {
  const text = value.trim();
  return text ? text[0].toLocaleUpperCase(locale) + text.slice(1) : text;
};

function CardItem({
  card,
  decorative = false,
  effectsReady,
  sparklesEnabled,
  revealed,
  onToggle,
}: {
  card: SignedCard;
  decorative?: boolean;
  effectsReady: boolean;
  sparklesEnabled: boolean;
  revealed: boolean;
  onToggle: (cardId: string) => void;
}) {
  const { t, locale } = useI18n();
  const localeCode = locale === "pt" ? "pt-BR" : "en-US";
  const formattedDate = new Intl.DateTimeFormat(localeCode, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(parseSignedDate(card.signedOn));
  const formattedLocation = capitalizeFirst(card.signedLocation, localeCode);
  const formattedContext = card.signedContext
    ? capitalizeFirst(card.signedContext, localeCode)
    : null;

  return (
    <li className={styles.card} data-signed-card>
      <article className={styles.cardSurface}>
        <button
          type="button"
          aria-label={
            decorative
              ? undefined
              : `${t(
                  revealed
                    ? "v2.signedCards.hidePhoto"
                    : "v2.signedCards.revealPhoto",
                )} ${card.name}`
          }
          aria-pressed={decorative ? undefined : revealed}
          tabIndex={decorative ? -1 : undefined}
          data-revealed={revealed}
          onClick={() => onToggle(card.id)}
          className={styles.cardInteraction}
        >
          <span className={styles.scene}>
            <span className={styles.polaroid}>
              <span className={styles.photoFrame}>
                <Image
                  src={card.signedSrc}
                  alt={
                    decorative
                      ? ""
                      : `${t("v2.signedCards.photoAlt")} ${card.name}`
                  }
                  fill
                  draggable={false}
                  sizes="(max-width: 767px) 40vw, (max-width: 1199px) 24vw, 15vw"
                  placeholder="blur"
                  blurDataURL={getSignedPhotoPlaceholder(card.signedSrc)}
                  className="object-cover"
                />
              </span>
            </span>
            <span className={styles.playingCard}>
              <span className={styles.playingCardIdle} data-idle-card>
                <Image
                  src={card.originalSrc}
                  alt={
                    decorative
                      ? ""
                      : `${t("v2.signedCards.cardAlt")} ${card.name}`
                  }
                  fill
                  draggable={false}
                  sizes="(max-width: 767px) 48vw, (max-width: 1199px) 28vw, 18vw"
                  placeholder="blur"
                  blurDataURL={getCardPlaceholder(card.originalSrc)}
                  className="signed-card-glow object-contain"
                />
                {effectsReady && sparklesEnabled ? <SparkleParticles /> : null}
              </span>
            </span>
          </span>
        </button>
        <div className={styles.metadata}>
          <p className={styles.location}>
            <MapPin aria-hidden="true" size={21} strokeWidth={2.25} />
            <span>{formattedLocation}</span>
          </p>
          <time className={styles.date} dateTime={card.signedOn}>
            {formattedDate}
          </time>
          {formattedContext ? (
            <p className={styles.context}>{formattedContext}</p>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export default function SignedCardsCarousel() {
  const { t, locale } = useI18n();
  const performanceTier = usePerformanceTier();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const [effectsReady, setEffectsReady] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  useEffect(() => {
    pausedRef.current = revealedCardId !== null;
  }, [revealedCardId]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEffectsReady(true);
        observer.disconnect();
      },
      {
        rootMargin: `0px 0px -${
          performanceTier === "low"
            ? 30
            : performanceTier === "standard"
              ? 15
              : 10
        }% 0px`,
      },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [performanceTier]);

  const toggleCard = (cardId: string) => {
    setRevealedCardId((current) => (current === cardId ? null : cardId));
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const wordTracks = gsap.utils.toArray<HTMLElement>("[data-word-track]");
        let randomDrop: gsap.core.Tween | undefined;
        let previousWord = -1;

        const dropWord = (track: HTMLElement) => {
          gsap.killTweensOf(track);
          gsap.fromTo(
            track,
            { yPercent: -50 },
            {
              yPercent: 0,
              duration: 0.5,
              ease: "power2.out",
              force3D: false,
              onComplete: () => {
                gsap.set(track, { y: 0, yPercent: 0, force3D: false });
              },
            },
          );
        };

        const queueRandomDrop = () => {
          randomDrop = gsap.delayedCall(gsap.utils.random(2.2, 4.5), () => {
            if (
              document.visibilityState === "visible" &&
              wordTracks.length > 0
            ) {
              let nextWord = Math.floor(Math.random() * wordTracks.length);
              if (wordTracks.length > 1 && nextWord === previousWord) {
                nextWord = (nextWord + 1) % wordTracks.length;
              }
              previousWord = nextWord;
              dropWord(wordTracks[nextWord]);
            }
            queueRandomDrop();
          });
        };

        const hoverHandlers =
          performanceTier === "low"
            ? []
            : wordTracks.map((track) => {
                const word = track.closest<HTMLElement>("[data-falling-word]");
                const handlePointerEnter = () => dropWord(track);
                word?.addEventListener("pointerenter", handlePointerEnter);
                return () =>
                  word?.removeEventListener("pointerenter", handlePointerEnter);
              });

        gsap.fromTo(
          wordTracks,
          { yPercent: -50 },
          {
            yPercent: 0,
            duration: 0.6,
            ease: "power2.out",
            force3D: false,
            stagger: { each: 0.07, from: "random" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              once: true,
            },
            onComplete: performanceTier === "low" ? undefined : queueRandomDrop,
          },
        );

        return () => {
          randomDrop?.kill();
          hoverHandlers.forEach((removeHandler) => removeHandler());
        };
      });

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [locale, performanceTier],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!effectsReady) return;

      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const sequence = sequenceRef.current;
      if (!section || !viewport || !track || !sequence) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = section.querySelectorAll<HTMLElement>("[data-signed-card]");
      const idleCards =
        sequence.querySelectorAll<HTMLElement>("[data-idle-card]");
      let position = 0;
      let sequenceWidth = sequence.offsetWidth;
      let isDragging = false;
      let isVisible = true;

      if (performanceTier !== "low") {
        gsap.to(idleCards, {
          rotationX: "random(-6, 6)",
          rotationY: "random(-8, 8)",
          rotationZ: "random(-3, 3)",
          duration: "random(1.4, 2.8)",
          ease: "sine.inOut",
          force3D: true,
          repeat: -1,
          repeatRefresh: true,
          yoyo: true,
        });
      }

      const setTrackX = gsap.quickSetter(track, "x", "px");
      const render = () => {
        if (sequenceWidth === 0) return;
        const wrapped = gsap.utils.wrap(-sequenceWidth, 0, position);
        setTrackX(wrapped);
      };

      const resetCards = () => {
        gsap.to(cards, {
          rotate: 0,
          xPercent: 0,
          yPercent: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const observer = Observer.create({
        target: viewport,
        type: "pointer,touch",
        allowClicks: true,
        dragMinimum: 4,
        lockAxis: true,
        onDragStart: () => {
          isDragging = true;
          gsap.to(cards, {
            rotate: (index) => ((index % 5) - 2) * 2.5,
            xPercent: (index) => ((index % 3) - 1) * 2,
            yPercent: (index) => (index % 2 === 0 ? -2 : 2),
            scale: 0.97,
            duration: 0.35,
            ease: "back.inOut(2)",
            overwrite: true,
          });
        },
        onDrag: (self) => {
          if (self.axis !== "x") return;
          position += self.deltaX;
          render();
        },
        onRelease: () => {
          isDragging = false;
          resetCards();
        },
        onStop: () => {
          isDragging = false;
          resetCards();
        },
      });

      let animationFrame = 0;
      let previousFrameTime = performance.now();
      const tick = (frameTime: number) => {
        const deltaTime = Math.min(frameTime - previousFrameTime, 50);
        previousFrameTime = frameTime;
        if (!pausedRef.current && !isDragging && isVisible) {
          position -= deltaTime * 0.13;
          render();
        }
        animationFrame = requestAnimationFrame(tick);
      };

      const resizeObserver = new ResizeObserver(() => {
        sequenceWidth = sequence.offsetWidth;
        render();
      });
      resizeObserver.observe(sequence);

      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 },
      );
      visibilityObserver.observe(section);

      animationFrame = requestAnimationFrame(tick);
      render();

      return () => {
        observer.kill();
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        cancelAnimationFrame(animationFrame);
      };
    },
    {
      scope: sectionRef,
      dependencies: [effectsReady, performanceTier],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="signed-cards-title"
    >
      {effectsReady ? (
        <GalacticBackground
          variant="balatro"
          centerDarkness={0.35}
          starCount={
            performanceTier === "low"
              ? 40
              : performanceTier === "standard"
                ? 72
                : 120
          }
          maxFPS={
            performanceTier === "low"
              ? 20
              : performanceTier === "standard"
                ? 24
                : 30
          }
          resolutionCap={performanceTier === "high" ? 1.25 : 1}
          className="-z-10"
        />
      ) : null}
      <div className={styles.heading}>
        <div>
          <h2
            id="signed-cards-title"
            className={`${bebasNeue.className} text-6xl leading-none tracking-wide sm:text-7xl lg:text-8xl`}
          >
            <FallingWords text={t("v2.signedCards.title")} />
          </h2>
          <p
            id="signed-cards-instructions"
            className="mx-auto mt-4 max-w-3xl text-base text-white/70 sm:text-lg"
          >
            {t("v2.signedCards.caption")}
          </p>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        aria-describedby="signed-cards-instructions"
      >
        <div ref={trackRef} className={styles.track}>
          <ul ref={sequenceRef} role="list" className={styles.sequence}>
            {signedCards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                effectsReady={effectsReady}
                sparklesEnabled={performanceTier !== "low"}
                revealed={revealedCardId === card.id}
                onToggle={toggleCard}
              />
            ))}
          </ul>
          <ul
            aria-hidden="true"
            className={`${styles.sequence} ${styles.duplicate}`}
          >
            {signedCards.map((card) => (
              <CardItem
                key={`duplicate-${card.id}`}
                card={card}
                decorative
                effectsReady={effectsReady}
                sparklesEnabled={performanceTier === "high"}
                revealed={revealedCardId === card.id}
                onToggle={toggleCard}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
