"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { FaMusic, FaPause } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import styles from "./about-the-challenge-section.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ASSET_ROOT = "/images/bg/about-the-challenge";
const RULE_KEYS = [
  "v2.challenge.rule1",
  "v2.challenge.rule2",
  "v2.challenge.rule3",
  "v2.challenge.rule4",
] as const;

type ParticleStyle = CSSProperties & {
  "--particle-size": string;
  "--particle-duration": string;
  "--particle-delay": string;
  "--particle-start-x": string;
  "--particle-start-y": string;
  "--particle-end-x": string;
  "--particle-end-y": string;
};

const PARTICLES: ParticleStyle[] = Array.from({ length: 42 }, (_, index) => {
  const distance = 90 + (index % 5) * 24;
  return {
    left: `${(index * 37 + 11) % 100}%`,
    top: `${-12 - (index % 5) * 5}%`,
    "--particle-size": `${2.25 + (index % 3)}px`,
    "--particle-duration": `${12 + (index % 7) * 1.3}s`,
    "--particle-delay": `${index * -0.83}s`,
    "--particle-start-x": `${distance}px`,
    "--particle-start-y": "-8vh",
    "--particle-end-x": `${distance * -1}px`,
    "--particle-end-y": "118vh",
  };
});

function Artwork({
  src,
  placeholder,
  className,
  depth,
}: {
  src: string;
  placeholder: string;
  className: string;
  depth: number;
}) {
  return (
    <Image
      src={`${ASSET_ROOT}/${src}`}
      alt=""
      fill
      sizes="106vw"
      data-challenge-depth={depth}
      className={`${styles.artwork} ${className}`}
      style={{ backgroundImage: `url("${ASSET_ROOT}/lq/${placeholder}")` }}
    />
  );
}

function ParticleField({
  className,
  depth,
}: {
  className: string;
  depth: number;
}) {
  return (
    <div
      data-challenge-depth={depth}
      className={`${styles.particleMask} ${className}`}
      aria-hidden="true"
    >
      {PARTICLES.map((particleStyle, index) => (
        <span key={index} className={styles.particle} style={particleStyle} />
      ))}
    </div>
  );
}

export default function AboutTheChallengeSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else {
      audio.volume = 0.3;
      void audio.play();
    }
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      const title = sectionRef.current?.querySelector<HTMLElement>(
        "[data-challenge-title]",
      );
      const audioControl = sectionRef.current?.querySelector<HTMLElement>(
        "[data-challenge-audio]",
      );
      const rules = gsap.utils.toArray<HTMLElement>("[data-challenge-rule]");
      const layers = gsap.utils.toArray<HTMLElement>("[data-challenge-depth]");

      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (!title) return;

        gsap.set([title, ...rules, audioControl], { autoAlpha: 0, y: 18 });
        const progress = { value: 0 };
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(progress, { value: 1, duration: 1, ease: "none" }, 0)
          .to(
            title,
            { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" },
            0.05,
          );
        layers.forEach((layer) => {
          timeline.to(
            layer,
            {
              yPercent: -Number(layer.dataset.challengeDepth),
              duration: 1,
              ease: "none",
            },
            0,
          );
        });
        rules.forEach((rule, index) => {
          timeline.to(
            rule,
            { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" },
            0.26 + index * 0.17,
          );
        });
        if (audioControl) {
          timeline.to(
            audioControl,
            { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" },
            0.94,
          );
        }
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        if (title)
          gsap.set([title, ...rules, audioControl], { autoAlpha: 1, y: 0 });
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="aboutTheChallenge"
      className={styles.section}
      aria-labelledby="challenge-title"
    >
      <div className={styles.stickyScene}>
        <div className={styles.scene} aria-hidden="true">
          <Artwork
            src="CENARIO_02_CHEGADA (1).webp"
            placeholder="scenario.webp"
            className={styles.scenario}
            depth={0.5}
          />
          <Artwork
            src="PODIUM (1).webp"
            placeholder="podium.webp"
            className={styles.podium}
            depth={2.2}
          />
          <Artwork
            src="LUZ_01.webp"
            placeholder="light-01.webp"
            className={`${styles.lightBeam} ${styles.lightOne}`}
            depth={3}
          />
          <Artwork
            src="LUZ_02.webp"
            placeholder="light-02.webp"
            className={`${styles.lightBeam} ${styles.lightTwo}`}
            depth={3.5}
          />
          <Artwork
            src="LUZ_03.webp"
            placeholder="light-03.webp"
            className={`${styles.lightBeam} ${styles.lightThree}`}
            depth={4}
          />
          <ParticleField
            className={`${styles.particleMaskOne} ${styles.particlePulseOne}`}
            depth={3}
          />
          <ParticleField
            className={`${styles.particleMaskTwo} ${styles.particlePulseTwo}`}
            depth={3.5}
          />
          <ParticleField
            className={`${styles.particleMaskThree} ${styles.particlePulseThree}`}
            depth={4}
          />
        </div>

        <div className={styles.content}>
          <h2
            id="challenge-title"
            data-challenge-title
            className={`${bebasNeue.className} ${styles.title}`}
          >
            {t("v2.challenge.title")}
          </h2>
          <ol className={styles.rules}>
            {RULE_KEYS.map((key, index) => (
              <li
                key={key}
                data-challenge-rule
                className={`${bebasNeue.className} ${styles.rule}`}
              >
                <span
                  aria-hidden="true"
                  className={`${bebasNeue.className} ${styles.ruleNumber}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
          <div data-challenge-audio className={styles.audioControl}>
            <button
              type="button"
              aria-pressed={isPlaying}
              data-playing={isPlaying}
              className={`${bebasNeue.className} ${styles.audioButton}`}
              onClick={toggleAudio}
            >
              {isPlaying ? (
                <FaPause aria-hidden="true" />
              ) : (
                <FaMusic aria-hidden="true" />
              )}
              <span className={styles.audioLabelMask}>
                <span
                  key={isPlaying ? "pause" : "listen"}
                  className={styles.audioLabel}
                >
                  {isPlaying
                    ? t("v2.challenge.audioPause")
                    : t("v2.challenge.audioListen")}
                </span>
              </span>
            </button>
            <audio
              ref={audioRef}
              src="/sounds/nc313_desafio_do_baralho.mp3"
              preload="metadata"
              onLoadedMetadata={(event) => {
                event.currentTarget.volume = 0.3;
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
