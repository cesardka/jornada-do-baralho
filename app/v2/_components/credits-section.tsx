"use client";

import { useEffect, useRef, useState } from "react";
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
const CREDIT_IDS = [
  "cesar",
  "lena",
  "leo",
  "kabuki",
  "luah",
  "dani",
  "andres",
  "pedro",
] as const;
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
const getCreditPlaceholder = (source: string) => {
  if (source.includes("/images/bg/credits/")) {
    return source.replace("/images/bg/credits/", "/images/bg/credits/lq/");
  }
  return `/images/credits/lq/${source.slice(source.lastIndexOf("/") + 1)}`;
};

function CreditPortrait({
  person,
  name,
  placeholdersReady,
  showAlternateLabel,
  showOriginalLabel,
}: {
  person: CreditPerson;
  name: string;
  placeholdersReady: boolean;
  showAlternateLabel: string;
  showOriginalLabel: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const circular = person.circularPortrait !== false;

  if (!person.alternateImageSrc) {
    return (
      <span
        data-circular={circular}
        className={styles.portraitFrame}
        style={{ backgroundColor: person.portraitBackground }}
      >
        <Image
          src={person.imageSrc}
          alt=""
          fill
          sizes="(max-width: 64rem) 5rem, 6rem"
          placeholder={placeholdersReady ? "blur" : "empty"}
          blurDataURL={
            placeholdersReady
              ? getCreditPlaceholder(person.imageSrc)
              : undefined
          }
          className={styles.portraitImage}
          style={{
            transform: `translateY(${person.portraitOffsetY ?? 0}%) scale(${person.portraitScale ?? 1})`,
          }}
        />
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={`${flipped ? showOriginalLabel : showAlternateLabel} ${name}`}
      aria-pressed={flipped}
      data-circular={circular}
      data-flipped={flipped}
      className={styles.portraitButton}
      onClick={() => setFlipped((current) => !current)}
    >
      <span className={styles.portraitInner}>
        <Image
          src={person.imageSrc}
          alt=""
          fill
          sizes="(max-width: 64rem) 5rem, 6rem"
          placeholder={placeholdersReady ? "blur" : "empty"}
          blurDataURL={
            placeholdersReady
              ? getCreditPlaceholder(person.imageSrc)
              : undefined
          }
          className={`${styles.portraitFace} ${styles.portraitFront}`}
          style={{ backgroundColor: person.portraitBackground }}
        />
        <Image
          src={person.alternateImageSrc}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 64rem) 5rem, 6rem"
          unoptimized
          placeholder={placeholdersReady ? "blur" : "empty"}
          blurDataURL={
            placeholdersReady
              ? getCreditPlaceholder(person.alternateImageSrc)
              : undefined
          }
          data-circular={person.alternateCircularPortrait}
          className={`${styles.portraitFace} ${styles.portraitBack}`}
          style={{ backgroundColor: person.alternatePortraitBackground }}
        />
      </span>
    </button>
  );
}

export default function CreditsSection() {
  const { t } = useI18n();
  const performanceTier = usePerformanceTier();
  const sectionRef = useRef<HTMLElement>(null);
  const [placeholdersReady, setPlaceholdersReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPlaceholdersReady(true);
        observer.disconnect();
      },
      { rootMargin: "50% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (performanceTier === "low") return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const foregroundLayers = gsap.utils.toArray<HTMLElement>(
          "[data-credits-foreground]",
        );
        const treeLayers = gsap.utils.toArray<HTMLElement>(
          "[data-credits-tree]",
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

        treeLayers.forEach((tree) => {
          gsap.to(tree, {
            xPercent: () => gsap.utils.random(-0.18, 0.18),
            rotation: () => gsap.utils.random(-0.22, 0.22),
            duration: () => gsap.utils.random(2.8, 5.2),
            delay: () => gsap.utils.random(0, 1.5),
            ease: "sine.inOut",
            repeat: -1,
            repeatRefresh: true,
            transformOrigin: "50% 100%",
            yoyo: true,
          });
        });
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
        {CREDIT_LAYERS.map((layer) => {
          const isTree =
            layer.src.endsWith("arvore_06.webp") ||
            layer.src.endsWith("ARVORES_02.webp") ||
            layer.src.endsWith("selva_01.webp");

          return (
            <div
              key={layer.src}
              data-credits-foreground={layer.depth > 0 ? "" : undefined}
              data-parallax-depth={layer.depth || undefined}
              className={styles.layerContainer}
            >
              <Image
                src={layer.src}
                alt=""
                fill
                loading="lazy"
                sizes="(orientation: portrait) 177vh, 100vw"
                placeholder={placeholdersReady ? "blur" : "empty"}
                blurDataURL={
                  placeholdersReady
                    ? getCreditPlaceholder(layer.src)
                    : undefined
                }
                data-credits-tree={isTree ? "" : undefined}
                className={`${styles.layer} ${layer.src.endsWith("luz_05.webp") ? styles.light : ""} ${layer.src.endsWith("nuvem_09.webp") ? styles.clouds : ""}`}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.content}>
        <h2
          id="credits-title"
          className={`${bebasNeue.className} ${styles.heading}`}
        >
          {t("aboutAuthor.title")}
        </h2>
        <p className={styles.subtitle}>{t("aboutAuthor.subtitle")}</p>

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
                <CreditPortrait
                  person={person}
                  name={name}
                  placeholdersReady={placeholdersReady}
                  showAlternateLabel={t("aboutAuthor.showAlternatePortrait")}
                  showOriginalLabel={t("aboutAuthor.showOriginalPortrait")}
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
