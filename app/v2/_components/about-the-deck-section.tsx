"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import { SocialMediaIcon } from "@/app/sections/card-details/socialMediaIcon";
import styles from "./about-the-deck-section.module.css";

const TinBox = dynamic(() => import("@/app/sections/tin-box"), {
  ssr: false,
});

export default function AboutTheDeckSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [showModel, setShowModel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [runtimeFirstFrame, setRuntimeFirstFrame] = useState<string | null>(
    null,
  );
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleModelReady = useCallback((firstFrame: string | null) => {
    const revealModel = () => {
      if (firstFrame && firstFrame.length > 1000) {
        setRuntimeFirstFrame(firstFrame);
      }
      revealTimerRef.current = setTimeout(() => setModelReady(true), 400);
    };

    if (!firstFrame || firstFrame.length <= 1000) {
      revealModel();
      return;
    }

    const frameImage = new window.Image();
    frameImage.src = firstFrame;
    frameImage.decode().then(revealModel, revealModel);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShowModel(true);
        observer.disconnect();
      },
      { rootMargin: "35% 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    },
    [],
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="about-the-deck-title"
    >
      <div className={styles.layout}>
        <div className={styles.copy}>
          <h2
            id="about-the-deck-title"
            className={`${bebasNeue.className} ${styles.title}`}
          >
            {t("v2.aboutDeck.title")}
          </h2>
          <div className={styles.prose}>
            <p>
              {t("aboutJourney.deck_p1_before_ep")}
              <Link
                href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-312-nercast-do-baralho"
                target="_blank"
                rel="noopener noreferrer"
              >
                #312 - Nerdcast do Baralho
              </Link>
              {t("aboutJourney.deck_p1_between_links")}
              <Link
                href="https://web.archive.org/web/20121214093601/http://www.nerdstore.com.br/produto/baralho-jn.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baralho Nerdcast
              </Link>
              {t("aboutJourney.deck_p1_after_product")}{" "}
              <Link
                href="https://www.instagram.com/caducarvalho"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineSocial}
              >
                Cadu Carvalho <SocialMediaIcon type="insta" size={16} />
              </Link>
            </p>
            <p>
              {t("aboutJourney.deck_p2_before_ep")}
              <Link
                href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-313-hq-os-velhos-novos-52"
                target="_blank"
                rel="noopener noreferrer"
              >
                #313 - HQ: Os Velhos Novos 52
              </Link>
              {t("aboutJourney.deck_p2_after_ep")}
            </p>
          </div>
        </div>

        <div
          className={styles.model}
          role="img"
          aria-label={t("v2.aboutDeck.modelLabel")}
        >
          <Image
            src="/images/tinbox-initial-frame-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            className={`${styles.placeholder} ${styles.placeholderMobile} ${
              modelReady ? styles.placeholderHidden : ""
            }`}
          />
          <Image
            src="/images/tinbox-initial-frame-tablet.webp"
            alt=""
            fill
            sizes="100vw"
            className={`${styles.placeholder} ${styles.placeholderTablet} ${
              modelReady ? styles.placeholderHidden : ""
            }`}
          />
          <Image
            src="/images/tinbox-initial-frame.webp"
            alt=""
            fill
            sizes="56vw"
            className={`${styles.placeholder} ${styles.placeholderDesktop} ${
              modelReady ? styles.placeholderHidden : ""
            }`}
          />
          {runtimeFirstFrame ? (
            <Image
              unoptimized
              src={runtimeFirstFrame}
              alt=""
              fill
              sizes="100vw"
              className={`${styles.placeholder} ${styles.runtimePlaceholder} ${
                modelReady ? styles.placeholderHidden : ""
              }`}
            />
          ) : null}
          {showModel ? (
            <TinBox
              embedded
              autoRotate
              interactiveLid={false}
              loadingLabel=""
              modelScale={3}
              overscanPercent={18}
              spinEaseDuration={2}
              spinStartDelay={2.5}
              onReady={handleModelReady}
              className={`${styles.modelCanvas} ${
                modelReady ? styles.modelCanvasReady : ""
              }`}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
