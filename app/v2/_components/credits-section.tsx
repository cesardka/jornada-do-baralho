"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import { PROJECT_AUTHORS } from "@/app/sections/about-the-author/author-data";
import { SocialMediaIcon } from "@/app/sections/card-details/socialMediaIcon";
import type { CreditPerson } from "@/app/sections/about-the-author/types";
import { usePerformanceTier } from "../_hooks/use-performance-tier";
import styles from "./credits-section.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CREDIT_LAYERS = [
  { src: "/images/bg/credits/FUNDO_10.webp", depth: 0 },
  { src: "/images/bg/credits/nuvem_09.webp", depth: 0 },
  { src: "/images/bg/credits/plaqntas_07.webp", depth: 0 },
  { src: "/images/bg/credits/arvore_06.webp", depth: 0 },
  { src: "/images/bg/credits/luz_05.webp", depth: 0 },
  { src: "/images/bg/credits/penhasco_04.webp", depth: 0 },
  { src: "/images/bg/credits/planta_03.webp", depth: 1 },
  { src: "/images/bg/credits/ARVORES_02.webp", depth: 2 },
  { src: "/images/bg/credits/selva_01.webp", depth: 3 },
] as const;
const CREDIT_IDS = ["cesar", "lena", "leo"] as const;
const SOCIAL_LABELS: Record<
  CreditPerson["socialMedia"][number]["type"],
  string
> = {
  site: "Website",
  insta: "Instagram",
  twitter: "X / Twitter",
  facebook: "Facebook",
  podcast: "Podcast",
  youtube: "YouTube",
  jovemnerd: "Jovem Nerd",
  football: "Football",
  skull: "Skull",
  mug: "Mug",
  book: "Book",
  burger: "Burger",
  bluesky: "Bluesky",
  princess: "Princess",
  linkedin: "LinkedIn",
  chifrezz: "Studio Chifrezz",
  spotify: "Spotify",
  github: "GitHub",
};
const CREDIT_PEOPLE = CREDIT_IDS.flatMap((id) => {
  const person = PROJECT_AUTHORS.find((candidate) => candidate.id === id);
  return person ? [person] : [];
});

export default function CreditsSection() {
  const { t } = useI18n();
  const performanceTier = usePerformanceTier();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (performanceTier === "low") return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const foregroundLayers = gsap.utils.toArray<HTMLElement>(
          "[data-credits-foreground]",
        );

        gsap.fromTo(
          foregroundLayers,
          {
            yPercent: (_, layer) =>
              Number((layer as HTMLElement).dataset.parallaxDepth) * 1.2,
            scale: (_, layer) =>
              1 + Number((layer as HTMLElement).dataset.parallaxDepth) * 0.02,
          },
          {
            yPercent: (_, layer) =>
              Number((layer as HTMLElement).dataset.parallaxDepth) * -1,
            scale: (_, layer) =>
              1 + Number((layer as HTMLElement).dataset.parallaxDepth) * 0.02,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
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
    <section
      ref={sectionRef}
      className={styles.section}
      data-performance-tier={performanceTier}
      aria-labelledby="credits-title"
    >
      <div className={styles.scene} aria-hidden="true">
        {CREDIT_LAYERS.map((layer) => (
          <Image
            key={layer.src}
            src={layer.src}
            alt=""
            fill
            loading="lazy"
            sizes="(orientation: portrait) 177vh, 100vw"
            data-credits-foreground={layer.depth > 0 ? "" : undefined}
            data-parallax-depth={layer.depth || undefined}
            className={`${styles.layer} ${layer.src.endsWith("luz_05.webp") ? styles.light : ""} ${layer.src.endsWith("nuvem_09.webp") ? styles.clouds : ""}`}
          />
        ))}
      </div>

      <div className={styles.content}>
        <h2
          id="credits-title"
          className={`${bebasNeue.className} ${styles.heading}`}
        >
          {t("aboutAuthor.title")}
        </h2>

        <ul className={styles.list}>
          {CREDIT_PEOPLE.map((person) => {
            const nameKey = `aboutAuthor.people.${person.id}.name`;
            const titleKey = `aboutAuthor.people.${person.id}.title`;
            const translatedName = t(nameKey);
            const translatedTitle = t(titleKey);
            const name =
              translatedName === nameKey ? person.name : translatedName;
            const title =
              translatedTitle === titleKey ? person.title : translatedTitle;

            return (
              <li key={person.id} className={styles.person}>
                <Image
                  src={person.imageSrc}
                  alt=""
                  width={112}
                  height={112}
                  sizes="(max-width: 64rem) 5rem, 6rem"
                  className={styles.portrait}
                />
                <div className={styles.personText}>
                  <div className={styles.nameRow}>
                    <h3 className={`${bebasNeue.className} ${styles.name}`}>
                      {name}
                    </h3>
                    <ul
                      className={styles.socials}
                      aria-label={`${t("cardDetails.social")}: ${name}`}
                    >
                      {person.socialMedia.map((social) => (
                        <li key={`${social.type}-${social.link}`}>
                          <Link
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label={`${name} — ${SOCIAL_LABELS[social.type]}`}
                          >
                            <span aria-hidden="true">
                              <SocialMediaIcon type={social.type} size={24} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className={styles.role}>{title}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
