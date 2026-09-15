"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import styles from "./countdown-section.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CHALLENGE_START = Date.UTC(2012, 5, 1);
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const FIRE_FPS = 12;
const FIRE_FRAMES = Array.from(
  { length: 9 },
  (_, index) =>
    `/images/bg/countdown/fire/frame-${String(index + 1).padStart(2, "0")}.webp`,
);

function getElapsedDays() {
  return Math.floor((Date.now() - CHALLENGE_START) / DAY_IN_MS);
}

export function FallingWords({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={styles.wordLine}>
        {text.split(" ").map((word, index) => (
          <span
            key={`${word}-${index}`}
            data-falling-word
            className={styles.wordMask}
          >
            <span data-word-track className={styles.wordTrack}>
              <span className={styles.wordCopy}>{word}</span>
              <span className={styles.wordCopy}>{word}</span>
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

function FireAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLImageElement | null>>([]);
  const loadedFrames = useRef(new Set<number>());
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      if (!ready) return;

      const frames = frameRefs.current.filter(
        (frame): frame is HTMLImageElement => frame !== null,
      );
      if (frames.length !== FIRE_FRAMES.length) return;

      let previousFrame = 0;
      const showFrame = (index: number) => {
        if (index === previousFrame) return;
        frames[previousFrame].style.visibility = "hidden";
        frames[previousFrame].style.opacity = "0";
        frames[index].style.visibility = "visible";
        frames[index].style.opacity = "1";
        previousFrame = index;
      };
      const period = FIRE_FRAMES.length / FIRE_FPS;
      const updateFrame = () => {
        if (document.visibilityState !== "visible") return;
        const index =
          Math.floor((gsap.ticker.time % period) * FIRE_FPS) %
          FIRE_FRAMES.length;
        showFrame(index);
      };
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.ticker.add(updateFrame);
        return () => gsap.ticker.remove(updateFrame);
      });

      return () => {
        media.revert();
        frames.forEach((frame, index) => {
          frame.style.visibility = index === 0 ? "visible" : "hidden";
          frame.style.opacity = index === 0 ? "1" : "0";
        });
      };
    },
    { scope: containerRef, dependencies: [ready] },
  );

  const handleFrameLoad = (index: number) => {
    loadedFrames.current.add(index);
    if (loadedFrames.current.size === FIRE_FRAMES.length) setReady(true);
  };

  return (
    <div
      ref={containerRef}
      data-countdown-background
      className={styles.fire}
      aria-hidden="true"
    >
      {FIRE_FRAMES.map((src, index) => (
        <Image
          key={src}
          ref={(frame) => {
            frameRefs.current[index] = frame;
          }}
          src={src}
          alt=""
          fill
          loading="eager"
          sizes="(orientation: portrait) 170vh, 100vw"
          className={styles.fireFrame}
          onLoad={() => handleFrameLoad(index)}
        />
      ))}
    </div>
  );
}

function StatueEyes() {
  const { t } = useI18n();
  const layerRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const blinkRef = useRef<HTMLDivElement>(null);
  const triggerBlinkRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const layer = layerRef.current;
      const tracker = trackerRef.current;
      const blink = blinkRef.current;
      const section = layer?.closest("section");
      if (!layer || !tracker || !blink || !section) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const moveX = gsap.quickTo(tracker, "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(tracker, "y", {
          duration: 0.45,
          ease: "power3.out",
        });
        let blinkTimer: gsap.core.Tween | undefined;
        let blinkTween: gsap.core.Tween | undefined;

        function playBlink() {
          blinkTimer?.kill();
          blinkTween?.kill();
          gsap.set(blink, { autoAlpha: 1, scaleY: 1 });
          blinkTween = gsap.to(blink, {
            autoAlpha: 0,
            scaleY: 0.02,
            duration: 0.5,
            ease: "power2.inOut",
            repeat: 1,
            yoyo: true,
            transformOrigin: "50% 46%",
            onComplete: scheduleBlink,
          });
        }
        function scheduleBlink() {
          blinkTimer = gsap.delayedCall(gsap.utils.random(6, 12), () => {
            if (document.visibilityState === "visible") playBlink();
            else scheduleBlink();
          });
        }
        triggerBlinkRef.current = playBlink;
        const handlePointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const bounds = section.getBoundingClientRect();
          const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
          const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
          moveX(horizontal * 28);
          moveY(vertical * 20);
        };
        const resetPosition = () => {
          moveX(0);
          moveY(0);
        };

        section.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        section.addEventListener("pointerleave", resetPosition);
        scheduleBlink();

        return () => {
          section.removeEventListener("pointermove", handlePointerMove);
          section.removeEventListener("pointerleave", resetPosition);
          blinkTimer?.kill();
          blinkTween?.kill();
          triggerBlinkRef.current = null;
          gsap.killTweensOf([tracker, blink]);
        };
      });

      return () => media.revert();
    },
    { scope: layerRef },
  );

  const handleStatueInteraction = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = layerRef.current?.closest("section");
    if (!section) return;

    const statueLayers = gsap.utils.toArray<HTMLElement>(
      "[data-statue-layer]",
      section,
    );
    triggerBlinkRef.current?.();
    gsap.killTweensOf(statueLayers, "x,rotation");
    gsap
      .timeline()
      .to(statueLayers, {
        x: -5,
        rotation: -0.75,
        duration: 0.12,
        ease: "power2.out",
        transformOrigin: "50% 46%",
      })
      .to(statueLayers, {
        x: 5,
        rotation: 0.75,
        duration: 0.16,
        ease: "power2.inOut",
      })
      .to(statueLayers, {
        x: -2.5,
        rotation: -0.35,
        duration: 0.12,
        ease: "power2.inOut",
      })
      .to(statueLayers, {
        x: 0,
        rotation: 0,
        duration: 0.18,
        ease: "power2.out",
      });
  };

  return (
    <div
      ref={layerRef}
      data-countdown-background
      data-statue-layer
      className={styles.eyesScene}
    >
      <div ref={trackerRef} className={styles.eyesTracker} aria-hidden="true">
        <div ref={blinkRef} className={styles.eyesBlink}>
          <Image
            src="/images/bg/countdown/olhos_estatua.webp"
            alt=""
            fill
            loading="eager"
            sizes="(orientation: portrait) 170vh, 100vw"
            className={styles.eyesImage}
            style={{
              backgroundImage:
                'url("/images/bg/countdown/lq/olhos_estatua.webp")',
            }}
          />
        </div>
      </div>
      <button
        type="button"
        className={styles.statueHitTarget}
        aria-label={t("v2.countdown.statueInteraction")}
        onClick={handleStatueInteraction}
      />
    </div>
  );
}

export default function CountdownSection() {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const dayCountRef = useRef<HTMLSpanElement>(null);
  const [daysSinceChallenge, setDaysSinceChallenge] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setDaysSinceChallenge(getElapsedDays());
  }, []);

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

        gsap.set(wordTracks, { yPercent: 0 });

        gsap
          .timeline({ delay: 0.2 })
          .to("[data-countdown-eyebrow]", {
            autoAlpha: 1,
            duration: 0.55,
            ease: "power2.out",
          })
          .to(
            "[data-countdown-title]",
            { autoAlpha: 1, duration: 2, ease: "power2.out" },
            "+=0.2",
          )
          .to(
            "[data-countdown-elapsed]",
            { autoAlpha: 1, duration: 0.65, ease: "power2.out" },
            "+=0.3",
          );

        const startRandomDrop = gsap.delayedCall(3, queueRandomDrop);

        gsap.fromTo(
          "[data-countdown-background]",
          { scale: 1.06 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "25% top",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );

        gsap.fromTo(
          "[data-countdown-foreground]",
          { yPercent: 3, scale: 1.025 },
          {
            yPercent: -2,
            scale: 1.01,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "25% top",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );

        return () => {
          randomDrop?.kill();
          startRandomDrop?.kill();
          hoverHandlers.forEach((removeHandler) => removeHandler());
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [locale], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const count = dayCountRef.current;
      if (daysSinceChallenge === null || !count) return;

      const track = count.querySelector<HTMLElement>("[data-day-count-track]");
      const copies = count.querySelectorAll<HTMLElement>(
        "[data-day-count-copy]",
      );
      if (!track || copies.length === 0) return;

      const formatter = new Intl.NumberFormat(
        locale === "pt" ? "pt-BR" : "en-US",
      );
      const counter = { value: 0 };
      const updateCopies = (value: number) => {
        const formattedValue = formatter.format(Math.round(value));
        copies.forEach((copy) => {
          copy.textContent = formattedValue;
        });
      };
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        updateCopies(0);
        gsap
          .timeline({ delay: 3.95 })
          .set(count, { autoAlpha: 1 })
          .fromTo(
            count,
            {
              color: "rgba(255, 255, 255, 0.88)",
              marginInline: "0em",
              scale: 1,
            },
            {
              color: "#ffbf5e",
              marginInline: "0.45em",
              scale: 1.3,
              duration: 0.4,
              ease: "power2.out",
            },
            0,
          )
          .fromTo(
            track,
            { yPercent: -50 },
            { yPercent: 0, duration: 0.5, ease: "power2.out", force3D: false },
            0,
          )
          .to(
            counter,
            {
              value: daysSinceChallenge,
              duration: 2.2,
              ease: "power2.out",
              onUpdate: () => updateCopies(counter.value),
              onComplete: () => updateCopies(daysSinceChallenge),
            },
            0,
          )
          .to(
            count,
            {
              color: "rgba(255, 255, 255, 0.88)",
              marginInline: "0em",
              scale: 1,
              duration: 0.55,
              ease: "power2.inOut",
            },
            1.65,
          );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        updateCopies(daysSinceChallenge);
        gsap.set(count, {
          autoAlpha: 1,
          color: "rgba(255, 255, 255, 0.88)",
          marginInline: "0em",
          scale: 1,
        });
      });

      return () => media.revert();
    },
    {
      scope: dayCountRef,
      dependencies: [daysSinceChallenge, locale],
      revertOnUpdate: true,
    },
  );

  const formattedElapsedDays =
    daysSinceChallenge === null
      ? ""
      : new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US").format(
          daysSinceChallenge,
        );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="countdown-title"
    >
      <div className={styles.scene}>
        <Image
          data-countdown-background
          src="/images/bg/countdown/CENARIO_01.webp"
          alt=""
          fill
          priority
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.background}`}
          style={{
            backgroundImage: 'url("/images/bg/countdown/lq/CENARIO_01.webp")',
          }}
        />
        <FireAnimation />
        <Image
          src="/images/bg/countdown/ambient-glow-web.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.ambientGlow}`}
          style={{
            backgroundImage:
              'url("/images/bg/countdown/lq/ambient-glow-web.webp")',
          }}
        />
        <Image
          data-countdown-background
          src="/images/bg/countdown/luz.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.background} ${styles.ambientGlow}`}
          style={{
            backgroundImage: 'url("/images/bg/countdown/lq/luz.webp")',
          }}
        />
        <Image
          data-countdown-background
          data-statue-layer
          src="/images/bg/countdown/ESTATUA_sem_luz.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.statue}`}
          style={{
            backgroundImage:
              'url("/images/bg/countdown/lq/ESTATUA_sem_luz.webp")',
          }}
        />
        <Image
          data-countdown-background
          data-statue-layer
          src="/images/bg/countdown/ESTATUA_com_luz.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.statue} ${styles.statueLit}`}
          style={{
            backgroundImage:
              'url("/images/bg/countdown/lq/ESTATUA_com_luz.webp")',
          }}
        />
        <StatueEyes />
        <Image
          src="/images/bg/countdown/podium-web.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.podium}`}
          style={{
            backgroundImage: 'url("/images/bg/countdown/lq/podium-web.webp")',
          }}
        />
        <Image
          data-countdown-foreground
          src="/images/bg/countdown/foreground-web.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.foreground}`}
          style={{
            backgroundImage:
              'url("/images/bg/countdown/lq/foreground-web.webp")',
          }}
        />
        <Image
          data-countdown-foreground
          src="/images/bg/countdown/foreground-glow-web.webp"
          alt=""
          fill
          sizes="(orientation: portrait) 170vh, 100vw"
          className={`${styles.layer} ${styles.foregroundGlow}`}
          style={{
            backgroundImage:
              'url("/images/bg/countdown/lq/foreground-glow-web.webp")',
          }}
        />
      </div>

      <div className={styles.content}>
        <header className={styles.heading}>
          <p data-countdown-eyebrow className={styles.eyebrow}>
            <FallingWords text={t("v2.countdown.eyebrow")} />
          </p>
          <h2
            id="countdown-title"
            data-countdown-title
            className={`${bebasNeue.className} ${styles.title}`}
          >
            <FallingWords text={t("v2.countdown.title")} />
          </h2>
        </header>

        <p data-countdown-elapsed className={styles.elapsed}>
          <span aria-hidden="true">
            {t("v2.countdown.elapsedPrefix")}{" "}
            <span ref={dayCountRef} className={styles.dayCount}>
              <span data-day-count-track className={styles.dayCountTrack}>
                <span data-day-count-copy className={styles.dayCountCopy}>
                  0
                </span>
                <span data-day-count-copy className={styles.dayCountCopy}>
                  0
                </span>
              </span>
            </span>{" "}
            {t("v2.countdown.elapsedSuffix")}
          </span>
          {daysSinceChallenge === null ? null : (
            <span className="sr-only">
              {t("v2.countdown.elapsedPrefix")} {formattedElapsedDays}{" "}
              {t("v2.countdown.elapsedSuffix")}
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
