"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import { usePerformanceTier } from "../_hooks/use-performance-tier";
import styles from "./read-the-blog-section.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SCENE = "/images/bg/read-the-blog/CENARIO_110_120_RJ (1).webp";
const SCENE_PLACEHOLDER = "/images/bg/read-the-blog/lq/scenario.webp";
const CLOUDS = {
  foregroundLeft: {
    src: "/images/bg/read-the-blog/cloud-foreground-left.webp",
    placeholder: "/images/bg/read-the-blog/lq/cloud-foreground-left.webp",
  },
  foregroundSides: {
    src: "/images/bg/read-the-blog/cloud-foreground-sides.webp",
    placeholder: "/images/bg/read-the-blog/lq/cloud-foreground-sides.webp",
  },
  midgroundCenter: {
    src: "/images/bg/read-the-blog/cloud-midground-center.webp",
    placeholder: "/images/bg/read-the-blog/lq/cloud-midground-center.webp",
  },
  backgroundTopRight: {
    src: "/images/bg/read-the-blog/cloud-background-top-right.webp",
    placeholder: "/images/bg/read-the-blog/lq/cloud-background-top-right.webp",
  },
  backgroundSides: {
    src: "/images/bg/read-the-blog/cloud-background-sides.webp",
    placeholder: "/images/bg/read-the-blog/lq/cloud-background-sides.webp",
  },
} as const;

function Artwork({ src, placeholder }: { src: string; placeholder: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="110vw"
      className={styles.artwork}
      style={{ backgroundImage: `url("${placeholder}")` }}
    />
  );
}

export default function ReadTheBlogSection() {
  const { t } = useI18n();
  const performanceTier = usePerformanceTier();
  const sectionRef = useRef<HTMLElement>(null);
  const planeOneRef = useRef<HTMLDivElement>(null);
  const planeTwoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const cloudParts = gsap.utils.toArray<HTMLElement>("[data-cloud-part]");
      const content = gsap.utils.toArray<HTMLElement>("[data-blog-content]");

      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (performanceTier === "low") {
          gsap.set(content, { autoAlpha: 1 });
          return;
        }
        gsap.set(content, { autoAlpha: 0 });

        gsap
          .timeline({
            defaults: { duration: 1, ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            '[data-cloud-part="foreground-left"]',
            {
              xPercent: () =>
                window.matchMedia("(min-width: 64.01rem)").matches ? 8 : 14,
            },
            { xPercent: 0 },
            0,
          )
          .fromTo(
            '[data-cloud-part="foreground-sides-left"]',
            {
              xPercent: () =>
                window.matchMedia("(min-width: 64.01rem)").matches ? 6 : 11,
            },
            { xPercent: 0 },
            0,
          )
          .fromTo(
            '[data-cloud-part="foreground-sides-right"]',
            {
              xPercent: () =>
                window.matchMedia("(min-width: 64.01rem)").matches ? -6 : -11,
            },
            { xPercent: 0 },
            0,
          )
          .fromTo(
            '[data-cloud-part="midground-center"]',
            { xPercent: -4 },
            { xPercent: 0 },
            0,
          )
          .fromTo(
            '[data-cloud-part="background-top-right"]',
            { xPercent: -2 },
            { xPercent: 0 },
            0,
          )
          .fromTo(
            '[data-cloud-part="background-sides-left"]',
            { xPercent: 0.75 },
            { xPercent: 0 },
            0,
          )
          .fromTo(
            '[data-cloud-part="background-sides-right"]',
            { xPercent: -0.75 },
            { xPercent: 0 },
            0,
          )
          .to(
            content,
            { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
            0.3,
          );
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cloudParts, { autoAlpha: 0 });
        gsap.set(content, { autoAlpha: 1 });
      });

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [performanceTier],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const planeOne = planeOneRef.current;
      const planeTwo = planeTwoRef.current;
      if (!section || !planeOne || !planeTwo) return;
      if (performanceTier === "low") {
        gsap.set([planeOne, planeTwo], { autoAlpha: 0 });
        return;
      }

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const planes = [planeOne, planeTwo];
        let sectionVisible = false;
        let queuedFlight: gsap.core.Tween | null = null;
        let activeFlight: gsap.core.Timeline | null = null;

        const resetPlanes = () => {
          gsap.set(planes, { autoAlpha: 0 });
        };

        const scheduleNext = () => {
          if (!sectionVisible || queuedFlight || activeFlight) return;
          queuedFlight = gsap.delayedCall(gsap.utils.random(6, 30), () => {
            queuedFlight = null;
            if (!sectionVisible || document.visibilityState !== "visible") {
              scheduleNext();
              return;
            }
            if (Math.random() < 0.5) flyPlaneOne();
            else flyPlaneTwo();
          });
        };

        const finishFlight = () => {
          activeFlight = null;
          resetPlanes();
          scheduleNext();
        };

        const getFlightLane = () =>
          Math.random() < 0.5
            ? { start: -30, middle: -38, end: -50 }
            : { start: 50, middle: 42, end: 34 };

        const flyPlaneOne = () => {
          const lane = getFlightLane();
          gsap.set(planeOne, {
            autoAlpha: 0,
            x: `${lane.start}vw`,
            xPercent: -50,
            y: "4vh",
            yPercent: -50,
            scale: 0.03,
            rotation: gsap.utils.random(-4, 4),
            zIndex: 1,
          });
          activeFlight = gsap
            .timeline({ onComplete: finishFlight })
            .to(planeOne, { autoAlpha: 1, duration: 0.2 }, 0)
            .to(
              planeOne,
              {
                x: `${lane.middle}vw`,
                y: "1vh",
                scale: 0.14,
                duration: 1.4,
                ease: "power1.in",
              },
              0,
            )
            .set(planeOne, { zIndex: 4 })
            .to(planeOne, {
              x: `${(lane.middle + lane.end) / 2}vw`,
              y: "8vh",
              scale: 0.48,
              duration: 1.15,
              ease: "power2.in",
            })
            .set(planeOne, { zIndex: 5 })
            .to(planeOne, {
              x: `${lane.end}vw`,
              y: "24vh",
              scale: 1.05,
              rotation: gsap.utils.random(-2, 2),
              autoAlpha: 0,
              duration: 0.85,
              ease: "power3.in",
            });
        };

        const flyPlaneTwo = () => {
          const lane = getFlightLane();
          gsap.set(planeTwo, {
            autoAlpha: 0,
            x: `${lane.start}vw`,
            xPercent: -50,
            y: "-30vh",
            yPercent: -50,
            scale: 0.3,
            rotation: gsap.utils.random(-5, 5),
            zIndex: 1,
          });
          activeFlight = gsap
            .timeline({ onComplete: finishFlight })
            .to(planeTwo, { autoAlpha: 1, duration: 0.2 }, 0)
            .to(
              planeTwo,
              {
                x: `${lane.middle}vw`,
                y: "8vh",
                scale: 0.42,
                duration: 1.05,
                ease: "power1.in",
              },
              0,
            )
            .set(planeTwo, { zIndex: 4 })
            .to(planeTwo, {
              x: `${(lane.middle + lane.end) / 2}vw`,
              y: "58vh",
              scale: 0.58,
              duration: 1.25,
              ease: "none",
            })
            .set(planeTwo, { zIndex: 5 })
            .to(planeTwo, {
              x: `${lane.end}vw`,
              y: "125vh",
              scale: 0.78,
              rotation: gsap.utils.random(-8, 8),
              autoAlpha: 0,
              duration: 1.2,
              ease: "power1.in",
            });
        };

        const stopFlights = () => {
          queuedFlight?.kill();
          activeFlight?.kill();
          queuedFlight = null;
          activeFlight = null;
          resetPlanes();
        };

        const sectionObserver = new IntersectionObserver(
          ([entry]) => {
            sectionVisible = entry.isIntersecting;
            if (sectionVisible) scheduleNext();
            else stopFlights();
          },
          { threshold: 0.1 },
        );

        const handleVisibilityChange = () => {
          if (document.visibilityState === "visible") scheduleNext();
          else stopFlights();
        };

        resetPlanes();
        sectionObserver.observe(section);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
          sectionObserver.disconnect();
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );
          stopFlights();
        };
      });

      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [performanceTier],
      revertOnUpdate: true,
    },
  );

  return (
    <section ref={sectionRef} id="readTheBlog" className={styles.section}>
      <div className={styles.stickyScene}>
        <div className={styles.scenario} aria-hidden="true">
          <Artwork src={SCENE} placeholder={SCENE_PLACEHOLDER} />
        </div>

        <div
          ref={planeOneRef}
          data-plane="1"
          className={`${styles.plane} ${styles.planeOne}`}
          aria-hidden="true"
        >
          <Image
            src="/images/bg/read-the-blog/AVIAO_1.webp"
            alt=""
            fill
            sizes="(max-width: 64rem) 45vw, 38vw"
            className="object-contain"
          />
        </div>
        <div
          ref={planeTwoRef}
          data-plane="2"
          className={`${styles.plane} ${styles.planeTwo}`}
          aria-hidden="true"
        >
          <Image
            src="/images/bg/read-the-blog/AVIAO_2.webp"
            alt=""
            fill
            sizes="(max-width: 64rem) 30vw, 16vw"
            className="object-contain"
          />
        </div>

        <div
          data-cloud-part="background-sides-left"
          className={`${styles.cloud} ${styles.leftHalf} ${styles.cloudBackgroundSides} ${styles.cloudBackgroundSidesLeft}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.backgroundSides} />
        </div>
        <div
          data-cloud-part="background-sides-right"
          className={`${styles.cloud} ${styles.rightHalf} ${styles.cloudBackgroundSides} ${styles.cloudBackgroundSidesRight}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.backgroundSides} />
        </div>
        <div
          data-cloud-part="background-top-right"
          className={`${styles.cloud} ${styles.cloudBackgroundTopRight}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.backgroundTopRight} />
        </div>
        <div
          data-cloud-part="foreground-sides-left"
          className={`${styles.cloud} ${styles.leftHalf} ${styles.cloudForegroundSides}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.foregroundSides} />
        </div>
        <div
          data-cloud-part="foreground-sides-right"
          className={`${styles.cloud} ${styles.rightHalf} ${styles.cloudForegroundSides}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.foregroundSides} />
        </div>
        <div
          data-cloud-part="midground-center"
          className={`${styles.cloud} ${styles.cloudMidgroundCenter}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.midgroundCenter} />
        </div>
        <div
          data-cloud-part="foreground-left"
          className={`${styles.cloud} ${styles.cloudForegroundLeft}`}
          aria-hidden="true"
        >
          <Artwork {...CLOUDS.foregroundLeft} />
        </div>

        <div data-blog-content className={styles.content}>
          <h2 className={`${bebasNeue.className} ${styles.title}`}>
            {t("v2.readTheBlog.title")}
          </h2>
          <Link href="/blog" className={`${bebasNeue.className} ${styles.cta}`}>
            {t("v2.readTheBlog.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
