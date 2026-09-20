"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import {
  type PerformanceTier,
  usePerformanceTier,
} from "../_hooks/use-performance-tier";
import styles from "./countdown-section.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TINBOX_SPRITESHEET = "/images/bg/countdown/tinbox-spritesheet.webp";
const TINBOX_FIRST_FRAME_LQ = "/images/bg/countdown/tinbox-first-frame-lq.webp";
const TINBOX_FRAME_COUNT = 12;
const TINBOX_HINT_DELAY_MS = 3000;
const TINBOX_INTERACTION_ENABLED = true;
const TINBOX_SPRITESHEET_COLUMNS = 4;
const TINBOX_SPRITESHEET_ROWS = 3;
const TREASURE_VIDEO_URL =
  "https://www.youtube-nocookie.com/embed/bqqp98dW_-E?rel=0";

const CHALLENGE_START = Date.UTC(2012, 5, 1);
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const FIRE_FPS = 12;
const FIRE_FRAME_COUNT = 9;
const FIRE_SHEETS = {
  mobile: "/images/bg/countdown/fire/spritesheet-mobile.webp",
  desktop: "/images/bg/countdown/fire/spritesheet-desktop.webp",
} as const;

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

function FireAnimation({
  tier,
  entranceComplete,
  onReady,
}: {
  tier: PerformanceTier;
  entranceComplete: boolean;
  onReady: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetRef = useRef<HTMLImageElement | null>(null);
  const [sheetReady, setSheetReady] = useState(false);

  useEffect(() => {
    if (sheetRef.current) return;

    let cancelled = false;
    let idleCallback: number | undefined;
    const loadSheet = async () => {
      const source = window.matchMedia("(max-width: 40rem)").matches
        ? FIRE_SHEETS.mobile
        : FIRE_SHEETS.desktop;
      const sheet = new window.Image();
      sheet.src = source;
      try {
        await sheet.decode();
      } catch {
        return;
      }
      if (cancelled) return;
      sheetRef.current = sheet;
      setSheetReady(true);
      onReady();
    };
    const timer = window.setTimeout(
      () => {
        if ("requestIdleCallback" in window) {
          idleCallback = window.requestIdleCallback(() => void loadSheet(), {
            timeout: 1200,
          });
        } else {
          void loadSheet();
        }
      },
      tier === "high" ? 900 : tier === "standard" ? 1300 : 1800,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (idleCallback !== undefined) window.cancelIdleCallback(idleCallback);
    };
  }, [onReady, tier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sheet = sheetRef.current;
    if (!canvas || !sheet || !sheetReady || !entranceComplete) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const frameWidth = sheet.naturalWidth / 3;
    const frameHeight = sheet.naturalHeight / 3;
    const frameRate = tier === "low" ? 8 : FIRE_FPS;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let currentFrame = -1;
    let animationFrame = 0;
    let startedAt = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        tier === "low" ? 1 : tier === "standard" ? 1.25 : 1.5,
      );
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      currentFrame = -1;
    };
    const drawFrame = (index: number) => {
      if (index === currentFrame) return;
      const scale = Math.max(width / frameWidth, height / frameHeight);
      const renderedWidth = frameWidth * scale * 0.95;
      const renderedHeight = frameHeight * scale * 0.95;
      const sourceX = (index % 3) * frameWidth;
      const sourceY = Math.floor(index / 3) * frameHeight;
      context.clearRect(0, 0, width, height);
      context.drawImage(
        sheet,
        sourceX,
        sourceY,
        frameWidth,
        frameHeight,
        (width - renderedWidth) / 2,
        (height - renderedHeight) / 2 + height * 0.02,
        renderedWidth,
        renderedHeight,
      );
      canvas.dataset.frame = String(index);
      currentFrame = index;
    };
    const tick = (time: number) => {
      if (document.visibilityState === "visible") {
        const elapsed = time - startedAt;
        drawFrame(Math.floor(elapsed / (1000 / frameRate)) % FIRE_FRAME_COUNT);
      }
      animationFrame = requestAnimationFrame(tick);
    };
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      startedAt = performance.now();
      currentFrame = -1;
    };
    const handleResize = () => {
      resize();
      drawFrame(currentFrame < 0 ? 0 : currentFrame);
    };
    const resizeObserver = new ResizeObserver(handleResize);

    resize();
    drawFrame(0);
    if (!reducedMotion.matches) animationFrame = requestAnimationFrame(tick);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [entranceComplete, sheetReady, tier]);

  return (
    <div
      ref={containerRef}
      data-countdown-background
      data-visible={entranceComplete && sheetReady}
      className={styles.fire}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.fireCanvas} />
    </div>
  );
}

function StatueEyes({
  active,
  trackPointer,
}: {
  active: boolean;
  trackPointer: boolean;
}) {
  const { t } = useI18n();
  const layerRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const blinkRef = useRef<HTMLDivElement>(null);
  const triggerBlinkRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      if (!active) return;

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
        function openEyes() {
          blinkTween?.kill();
          gsap.set(blink, {
            autoAlpha: 0.2,
            scaleY: 0.02,
            transformOrigin: "50% 46%",
          });
          blinkTween = gsap.to(blink, {
            autoAlpha: 1,
            scaleY: 1,
            duration: 0.85,
            ease: "power3.out",
            onComplete: scheduleBlink,
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

        if (trackPointer) {
          section.addEventListener("pointermove", handlePointerMove, {
            passive: true,
          });
          section.addEventListener("pointerleave", resetPosition);
        }
        openEyes();

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
    {
      scope: layerRef,
      dependencies: [active, trackPointer],
      revertOnUpdate: true,
    },
  );

  const handleStatueInteraction = () => {
    if (
      !active ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

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
            loading="lazy"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/images/bg/countdown/lq/olhos_estatua.webp"
            className={styles.eyesImage}
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

function TreasureVideoDialog({
  open,
  title,
  closeLabel,
  onClose,
}: {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className={styles.videoDialog}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.videoDialogPanel}>
        <button
          type="button"
          autoFocus
          aria-label={closeLabel}
          className={styles.videoDialogClose}
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className={styles.videoFrame}>
          {open ? (
            <iframe
              src={TREASURE_VIDEO_URL}
              title={title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

export default function CountdownSection() {
  const { t, locale } = useI18n();
  const performanceTier = usePerformanceTier();
  const performanceTierRef = useRef(performanceTier);
  const sectionRef = useRef<HTMLElement>(null);
  const dayCountRef = useRef<HTMLSpanElement>(null);
  const tinBoxCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const tinBoxAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const tinBoxHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tinBoxFrameRef = useRef(0);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [fireReady, setFireReady] = useState(false);
  const [tinBoxRequested, setTinBoxRequested] = useState(false);
  const [tinBoxPlaceholderReady, setTinBoxPlaceholderReady] = useState(false);
  const [tinBoxReady, setTinBoxReady] = useState(false);
  const [tinBoxFrame, setTinBoxFrame] = useState(0);
  const [tinBoxOpen, setTinBoxOpen] = useState(false);
  const [tinBoxHintVisible, setTinBoxHintVisible] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const handleFireReady = useCallback(() => setFireReady(true), []);
  const animateTinBox = useCallback(
    (open: boolean, onComplete?: () => void) => {
      if (tinBoxAnimationTimerRef.current) {
        clearTimeout(tinBoxAnimationTimerRef.current);
      }
      const targetFrame = open ? TINBOX_FRAME_COUNT - 1 : 0;
      const direction = open ? 1 : -1;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tinBoxFrameRef.current = targetFrame;
        setTinBoxFrame(targetFrame);
        onComplete?.();
        return;
      }
      const advanceFrame = () => {
        const nextFrame = tinBoxFrameRef.current + direction;
        tinBoxFrameRef.current = nextFrame;
        setTinBoxFrame(nextFrame);
        if (nextFrame === targetFrame) {
          tinBoxAnimationTimerRef.current = null;
          onComplete?.();
          return;
        }
        tinBoxAnimationTimerRef.current = setTimeout(advanceFrame, 64);
      };
      if (tinBoxFrameRef.current === targetFrame) {
        onComplete?.();
      } else {
        advanceFrame();
      }
    },
    [],
  );
  const handleTinBoxActivation = useCallback(() => {
    if (tinBoxHintTimerRef.current) {
      clearTimeout(tinBoxHintTimerRef.current);
      tinBoxHintTimerRef.current = null;
    }
    setTinBoxHintVisible(false);
    if (tinBoxCloseTimerRef.current) {
      clearTimeout(tinBoxCloseTimerRef.current);
      tinBoxCloseTimerRef.current = null;
    }
    if (tinBoxOpen) {
      setVideoOpen(true);
      return;
    }
    setTinBoxOpen(true);
    animateTinBox(true, () => setVideoOpen(true));
  }, [animateTinBox, tinBoxOpen]);
  const closeTreasureVideo = useCallback(() => {
    setVideoOpen(false);
    setTinBoxHintVisible(false);
    if (tinBoxHintTimerRef.current) clearTimeout(tinBoxHintTimerRef.current);
    tinBoxHintTimerRef.current = setTimeout(() => {
      tinBoxHintTimerRef.current = null;
      setTinBoxHintVisible(true);
    }, TINBOX_HINT_DELAY_MS);
    if (tinBoxCloseTimerRef.current) clearTimeout(tinBoxCloseTimerRef.current);
    tinBoxCloseTimerRef.current = setTimeout(() => {
      tinBoxCloseTimerRef.current = null;
      setTinBoxOpen(false);
      animateTinBox(false);
    }, 2000);
  }, [animateTinBox]);
  const [daysSinceChallenge, setDaysSinceChallenge] = useState<number | null>(
    null,
  );
  performanceTierRef.current = performanceTier;

  useEffect(() => {
    setDaysSinceChallenge(getElapsedDays());
    return () => {
      if (tinBoxCloseTimerRef.current) {
        clearTimeout(tinBoxCloseTimerRef.current);
      }
      if (tinBoxAnimationTimerRef.current) {
        clearTimeout(tinBoxAnimationTimerRef.current);
      }
      if (tinBoxHintTimerRef.current) {
        clearTimeout(tinBoxHintTimerRef.current);
      }
    };
  }, []);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const eyebrow = sectionRef.current?.querySelector<HTMLElement>(
          "[data-countdown-eyebrow]",
        );
        const title = sectionRef.current?.querySelector<HTMLElement>(
          "[data-countdown-title]",
        );
        const elapsed = sectionRef.current?.querySelector<HTMLElement>(
          "[data-countdown-elapsed]",
        );
        if (!eyebrow || !title || !elapsed) return;

        const wordTracks = gsap.utils.toArray<HTMLElement>("[data-word-track]");
        let cancelled = false;
        let randomDrop: gsap.core.Tween | undefined;
        let startRandomDrop: gsap.core.Tween | undefined;
        let previousWord = -1;

        setEntranceComplete(false);
        gsap.set([eyebrow, title, elapsed], { autoAlpha: 0 });
        gsap.set(title, { willChange: "opacity" });

        const dropWord = (track: HTMLElement) => {
          gsap.killTweensOf(track);
          gsap.fromTo(
            track,
            { yPercent: -50, willChange: "transform" },
            {
              yPercent: 0,
              duration: 0.5,
              ease: "power2.out",
              force3D: false,
              onComplete: () => {
                gsap.set(track, {
                  y: 0,
                  yPercent: 0,
                  force3D: false,
                  willChange: "auto",
                });
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

        const finishEntrance = () => {
          setEntranceComplete(true);
          gsap.set(title, { willChange: "auto" });
          if (performanceTierRef.current === "low") return;

          const criticalImages = Array.from(
            sectionRef.current?.querySelectorAll<HTMLImageElement>(
              "[data-countdown-critical-image]",
            ) ?? [],
          );
          void Promise.allSettled(
            criticalImages.map((image) => image.decode()),
          ).then(() => {
            if (cancelled) return;
            startRandomDrop = gsap.delayedCall(0.8, queueRandomDrop);
          });
        };

        const hoverHandlers = wordTracks.map((track) => {
          const word = track.closest<HTMLElement>("[data-falling-word]");
          const handlePointerEnter = () => {
            if (performanceTierRef.current !== "low") dropWord(track);
          };
          word?.addEventListener("pointerenter", handlePointerEnter);
          return () =>
            word?.removeEventListener("pointerenter", handlePointerEnter);
        });

        gsap.set(wordTracks, { yPercent: 0 });

        gsap
          .timeline({ delay: 0.15, onComplete: finishEntrance })
          .to(eyebrow, {
            autoAlpha: 1,
            duration: 0.35,
            ease: "power2.out",
          })
          .to(
            title,
            { autoAlpha: 1, duration: 0.9, ease: "power2.out" },
            "+=0.1",
          )
          .to(
            elapsed,
            { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
            "+=0.1",
          );

        return () => {
          cancelled = true;
          randomDrop?.kill();
          startRandomDrop?.kill();
          hoverHandlers.forEach((removeHandler) => removeHandler());
        };
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            "[data-countdown-eyebrow]",
            "[data-countdown-title]",
            "[data-countdown-elapsed]",
          ],
          { autoAlpha: 1, willChange: "auto" },
        );
        setEntranceComplete(true);
      });

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [locale],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (performanceTier === "low") return;

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
    },
    {
      scope: sectionRef,
      dependencies: [performanceTier],
      revertOnUpdate: true,
    },
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
          .timeline({ delay: 2.15 })
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
  const effectsActive = entranceComplete && fireReady;
  const tinBoxColumn = tinBoxFrame % TINBOX_SPRITESHEET_COLUMNS;
  const tinBoxRow = Math.floor(tinBoxFrame / TINBOX_SPRITESHEET_COLUMNS);
  const tinBoxBackgroundPosition = `${
    (tinBoxColumn / (TINBOX_SPRITESHEET_COLUMNS - 1)) * 100
  }% ${(tinBoxRow / (TINBOX_SPRITESHEET_ROWS - 1)) * 100}%`;

  useEffect(() => {
    if (!effectsActive || tinBoxRequested) return;
    const delay = performanceTier === "low" ? 1400 : 650;
    const timer = window.setTimeout(() => setTinBoxRequested(true), delay);
    return () => window.clearTimeout(timer);
  }, [effectsActive, performanceTier, tinBoxRequested]);

  useEffect(() => {
    if (!tinBoxRequested || tinBoxPlaceholderReady) return;
    let active = true;
    const firstFrame = new window.Image();
    firstFrame.onload = () => {
      if (active) setTinBoxPlaceholderReady(true);
    };
    firstFrame.src = TINBOX_FIRST_FRAME_LQ;
    return () => {
      active = false;
    };
  }, [tinBoxPlaceholderReady, tinBoxRequested]);

  useEffect(() => {
    if (!tinBoxPlaceholderReady || tinBoxReady) return;
    let active = true;
    const spritesheet = new window.Image();
    spritesheet.onload = () => {
      if (active) setTinBoxReady(true);
    };
    spritesheet.src = TINBOX_SPRITESHEET;
    return () => {
      active = false;
    };
  }, [tinBoxPlaceholderReady, tinBoxReady]);

  useEffect(() => {
    if (!TINBOX_INTERACTION_ENABLED || !tinBoxReady) return;
    setTinBoxHintVisible(false);
    if (tinBoxHintTimerRef.current) clearTimeout(tinBoxHintTimerRef.current);
    tinBoxHintTimerRef.current = setTimeout(() => {
      tinBoxHintTimerRef.current = null;
      setTinBoxHintVisible(true);
    }, TINBOX_HINT_DELAY_MS);
    return () => {
      if (tinBoxHintTimerRef.current) {
        clearTimeout(tinBoxHintTimerRef.current);
        tinBoxHintTimerRef.current = null;
      }
    };
  }, [tinBoxReady]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-effects-active={effectsActive}
      data-entrance-complete={entranceComplete}
      data-performance-tier={performanceTier}
      aria-labelledby="countdown-title"
    >
      <div className={styles.scene}>
        <Image
          data-countdown-background
          data-countdown-critical-image
          src="/images/bg/countdown/CENARIO_01.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/images/bg/countdown/lq/CENARIO_01.webp"
          className={`${styles.layer} ${styles.background}`}
        />
        <FireAnimation
          tier={performanceTier}
          entranceComplete={entranceComplete}
          onReady={handleFireReady}
        />
        <div
          className={`${styles.illuminationLayer} ${styles.illuminationAmbient}`}
          aria-hidden="true"
        >
          <Image
            src="/images/bg/countdown/ambient-glow-web.webp"
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/images/bg/countdown/lq/ambient-glow-web.webp"
            className={`${styles.layer} ${styles.ambientGlow}`}
          />
          <Image
            data-countdown-background
            src="/images/bg/countdown/luz.webp"
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/images/bg/countdown/lq/luz.webp"
            className={`${styles.layer} ${styles.background} ${styles.ambientGlow}`}
          />
        </div>
        <Image
          data-countdown-background
          data-statue-layer
          data-countdown-critical-image
          src="/images/bg/countdown/ESTATUA_sem_luz.webp"
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/images/bg/countdown/lq/ESTATUA_sem_luz.webp"
          className={`${styles.layer} ${styles.statue}`}
        />
        <div
          className={`${styles.illuminationLayer} ${styles.illuminationStatue}`}
          aria-hidden="true"
        >
          <Image
            data-countdown-background
            data-statue-layer
            src="/images/bg/countdown/ESTATUA_com_luz.webp"
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/images/bg/countdown/lq/ESTATUA_com_luz.webp"
            className={`${styles.layer} ${styles.statue} ${styles.statueLit}`}
          />
        </div>
        <StatueEyes
          active={effectsActive}
          trackPointer={performanceTier !== "low"}
        />
        <Image
          data-countdown-critical-image
          src="/images/bg/countdown/podium-web.webp"
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/images/bg/countdown/lq/podium-web.webp"
          className={`${styles.layer} ${styles.podium}`}
        />
        {tinBoxRequested ? (
          <div
            data-visible={tinBoxPlaceholderReady}
            data-ready={tinBoxReady}
            data-open={tinBoxOpen}
            data-hint-visible={tinBoxHintVisible}
            className={styles.treasureBox}
          >
            <div className={styles.treasureAura} aria-hidden="true" />
            <div className={styles.treasureSparkles} aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            {TINBOX_INTERACTION_ENABLED ? (
              <span
                id="countdown-treasure-hint"
                className={styles.treasureHint}
              >
                {t("v2.countdown.treasureHint")}
              </span>
            ) : null}
            <button
              type="button"
              disabled={!TINBOX_INTERACTION_ENABLED || !tinBoxReady}
              tabIndex={TINBOX_INTERACTION_ENABLED ? 0 : -1}
              aria-hidden={!TINBOX_INTERACTION_ENABLED}
              aria-describedby={
                TINBOX_INTERACTION_ENABLED
                  ? "countdown-treasure-hint"
                  : undefined
              }
              aria-label={
                TINBOX_INTERACTION_ENABLED
                  ? t("v2.countdown.treasureInteraction")
                  : undefined
              }
              aria-busy={TINBOX_INTERACTION_ENABLED && !tinBoxReady}
              className={styles.treasureButton}
              onClick={
                TINBOX_INTERACTION_ENABLED ? handleTinBoxActivation : undefined
              }
            >
              <span aria-hidden="true" className={styles.treasurePlaceholder} />
              {tinBoxPlaceholderReady ? (
                <span
                  aria-hidden="true"
                  className={styles.treasureFrame}
                  style={{ backgroundPosition: tinBoxBackgroundPosition }}
                />
              ) : null}
            </button>
          </div>
        ) : null}
        <Image
          data-countdown-foreground
          data-countdown-critical-image
          src="/images/bg/countdown/foreground-web.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="/images/bg/countdown/lq/foreground-web.webp"
          className={`${styles.layer} ${styles.foreground}`}
        />
        <div
          className={`${styles.illuminationLayer} ${styles.illuminationForeground}`}
          aria-hidden="true"
        >
          <Image
            data-countdown-foreground
            src="/images/bg/countdown/foreground-glow-web.webp"
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL="/images/bg/countdown/lq/foreground-glow-web.webp"
            className={`${styles.layer} ${styles.foregroundGlow}`}
          />
        </div>
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

      <TreasureVideoDialog
        open={videoOpen}
        title={t("v2.countdown.treasureVideoTitle")}
        closeLabel={t("v2.countdown.closeTreasureVideo")}
        onClose={closeTreasureVideo}
      />
    </section>
  );
}
