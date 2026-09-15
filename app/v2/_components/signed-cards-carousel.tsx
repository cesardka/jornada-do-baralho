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
import GalacticBackground from "@/components/ui/galactic-background";
import SparkleParticles from "@/components/ui/sparkle-particles";
import {
  DECK_LIST,
  type NerdcastCard,
} from "@/app/sections/deck-list/card-data";
import { FallingWords } from "./countdown-section";
import styles from "./signed-cards-carousel.module.css";

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

type SignedCard = NerdcastCard & {
  signedOn: Date;
  signedLocation: string;
  signedSrc: string;
};

const signedCards = DECK_LIST.filter(
  (card): card is SignedCard =>
    card.signedOn !== null &&
    card.signedLocation !== null &&
    card.signedSrc !== null,
).sort((first, second) => first.signedOn.getTime() - second.signedOn.getTime());

const capitalizeFirst = (value: string, locale: string) => {
  const text = value.trim();
  return text ? text[0].toLocaleUpperCase(locale) + text.slice(1) : text;
};

function CardItem({
  card,
  decorative = false,
  revealed,
  onToggle,
}: {
  card: SignedCard;
  decorative?: boolean;
  revealed: boolean;
  onToggle: (cardId: string) => void;
}) {
  const { t, locale } = useI18n();
  const localeCode = locale === "pt" ? "pt-BR" : "en-US";
  const formattedDate = new Intl.DateTimeFormat(localeCode, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(card.signedOn);
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
                  className="signed-card-glow object-contain"
                />
                <SparkleParticles />
              </span>
            </span>
          </span>
        </button>
        <div className={styles.metadata}>
          <p className={styles.location}>
            <MapPin aria-hidden="true" size={21} strokeWidth={2.25} />
            <span>{formattedLocation}</span>
          </p>
          <time className={styles.date} dateTime={card.signedOn.toISOString()}>
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
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);
  const pausedRef = useRef(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  useEffect(() => {
    pausedRef.current = revealedCardId !== null;
  }, [revealedCardId]);

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

        const hoverHandlers = wordTracks.map((track) => {
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
            onComplete: queueRandomDrop,
          },
        );

        return () => {
          randomDrop?.kill();
          hoverHandlers.forEach((removeHandler) => removeHandler());
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [locale], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const sequence = sequenceRef.current;
      if (!section || !viewport || !track || !sequence) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = section.querySelectorAll<HTMLElement>("[data-signed-card]");
      const idleCards =
        section.querySelectorAll<HTMLElement>("[data-idle-card]");
      let position = 0;
      let sequenceWidth = sequence.offsetWidth;
      let isDragging = false;
      let isVisible = true;

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

      const render = () => {
        if (sequenceWidth === 0) return;
        const wrapped = gsap.utils.wrap(-sequenceWidth, 0, position);
        gsap.set(track, { x: wrapped });
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

      const tick = (_time: number, deltaTime: number) => {
        if (pausedRef.current || isDragging || !isVisible) return;
        position -= deltaTime * 0.13;
        render();
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

      gsap.ticker.add(tick);
      render();

      return () => {
        observer.kill();
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        gsap.ticker.remove(tick);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="signed-cards-title"
    >
      <GalacticBackground
        variant="balatro"
        centerDarkness={0.35}
        className="-z-10"
      />
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
