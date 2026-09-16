"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import { SocialMediaIcon } from "@/app/sections/card-details/socialMediaIcon";
import DeckRadialBackground from "./deck-radial-background";
import styles from "./about-the-deck-section.module.css";

const TinBox = dynamic(() => import("@/app/sections/tin-box"), {
  ssr: false,
});

const PLACEHOLDER_LQ = {
  desktop:
    "data:image/webp;base64,UklGRhgBAABXRUJQVlA4WAoAAAAQAAAAHwAAFQAAQUxQSHsAAAARR6CobSM2VQr33/siIiA+FH8Mt7W2rckTrT1pdYAEL6mo6ZjARqB21rbvhXNYIKL/Ctu2bSS54xX+Y7SdOpLq9ngcV4nch5vOznpwIXpOGcJa7JNe4wF3iQtcJQ5wUhwAevUt+ZYLyBYYl58FAGA72JlKwWeuhj7jNwEAVlA4IHYAAAAQBACdASogABYAPxl0sFEspqSisAgBkCMJYwDJEB9qlhkqRTeeVlwb4AD9HFhkJW+eR5UOs4TeWJG0kW7DTSuOkyrfR1aBdOhGZzOO+D5p1jWQpUHi2zRSKrpdPuhH6aY+b3AIeC9wtp+1PkgldL47ok4hHVAA",
  tablet:
    "data:image/webp;base64,UklGRi4BAABXRUJQVlA4WAoAAAAQAAAAHwAAFwAAQUxQSIUAAAARR6CmbSQ2dhx+7D/1iAi4Z7E/wW1ra29ynV3a5DKHHtFTIUZwSQcDxD5+g//fMxILRPRfYdIGjB3H8KdsYq26mO27LTOz0zzyc3lsI6jepnKAp8mc4aU1rbeGozaCnVbCWMuBi/KIgEp1DUD18hIAqN6hBgDVPOT7iBzXtVjYRKPq8lsAAFZQOCCCAAAAMAQAnQEqIAAYAD8ZdrFRLKckorAIAZAjCWMNt4V58Kfj6M+gLZk0BwYAAP0fh2i5II9zdxDIPJy17zVp6tD3ZhncpeCp4CbnZpWvpHT9iWjgCsvkb02rBTna6f0qVDWm+VO+Jf6XAA7o9tieFJtwGJPYJ87qTZeFWtkbnXZHwMbAAA==",
  mobile:
    "data:image/webp;base64,UklGRjIBAABXRUJQVlA4WAoAAAAQAAAAHwAAIwAAQUxQSH8AAAARR6CgbRs2VRzt/omIQD5PVQOnkmS7yr7wAWRsDvIpCpvBZpDUU+iMzLD//e7dq0BH9H8C8J9Gy6xW+pLrrJD6MDn2Tak3rSM/8aLaBvbUATp6Llfgre2Ah7YBbk5brQikjpIPAEehBePB5psQmzqwx4ZAwJTkBHKXDDVENfxmAFZQOCCMAAAAkAQAnQEqIAAkAD8VcrZQrKalorAaqqmQIolAGUAxdfAkTLRRnfpfGr7YyagAAP71Zbph156WaCyokO5Ni7iZFcC7c/mrE9z5N3f6H40cf/rsjjCnQ6GR/Q7KORrtPjvICwIQeDr/xYeXlvq3wUzRsZNPlFJFQq/z3U3/Kj4CgAi1HNllJm+aVrNa2AA=",
} as const;

export default function AboutTheDeckSection() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const shaderOriginRef = useRef<HTMLSpanElement>(null);
  const [showModel, setShowModel] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [placeholderLoaded, setPlaceholderLoaded] = useState({
    mobile: false,
    tablet: false,
    desktop: false,
  });
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

  const markPlaceholderLoaded = (viewport: keyof typeof placeholderLoaded) => {
    setPlaceholderLoaded((current) => ({ ...current, [viewport]: true }));
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="about-the-deck-title"
    >
      <DeckRadialBackground
        originRef={shaderOriginRef}
        contentRef={copyRef}
        className={styles.shaderBackground}
      />
      <div className={styles.layout}>
        <div ref={copyRef} className={styles.copy}>
          <h2
            id="about-the-deck-title"
            className={`${bebasNeue.className} ${styles.title}`}
          >
            {t("v2.aboutDeck.title")}
          </h2>
          <div className={styles.prose}>
            <p>
              {t("v2.aboutDeck.historyP1BeforeEpisode")}
              <Link
                href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-312-nercast-do-baralho"
                target="_blank"
                rel="noopener noreferrer"
              >
                #312 - Nerdcast do Baralho
              </Link>
              {t("v2.aboutDeck.historyP1BetweenLinks")}
              <Link
                href="https://web.archive.org/web/20121214093601/http://www.nerdstore.com.br/produto/baralho-jn.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Baralho Nerdcast
              </Link>
              {t("v2.aboutDeck.historyP1BeforeAuthor")}
              <Link
                href="https://www.instagram.com/caducarvalho"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineSocial}
              >
                Cadu Carvalho. <SocialMediaIcon type="insta" size={16} />
              </Link>
            </p>
            <p>
              {t("v2.aboutDeck.historyP2BeforeEpisode")}
              <Link
                href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-313-hq-os-velhos-novos-52"
                target="_blank"
                rel="noopener noreferrer"
              >
                #313 - HQ: Os Velhos Novos 52
              </Link>
              {t("v2.aboutDeck.historyP2AfterEpisode")}
            </p>
          </div>
        </div>

        <div
          className={styles.model}
          role="group"
          aria-label={t("v2.aboutDeck.modelLabel")}
        >
          <span
            ref={shaderOriginRef}
            className={styles.shaderOrigin}
            aria-hidden="true"
          />
          <Image
            unoptimized
            src={PLACEHOLDER_LQ.mobile}
            alt=""
            fill
            sizes="100vw"
            className={`${styles.placeholder} ${styles.placeholderMobile} ${styles.lqPlaceholder} ${
              placeholderLoaded.mobile || modelReady
                ? styles.placeholderHidden
                : ""
            }`}
          />
          <Image
            src="/images/tinbox-shadowfree-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            onLoad={() => markPlaceholderLoaded("mobile")}
            className={`${styles.placeholder} ${styles.placeholderMobile} ${styles.fullPlaceholder} ${
              modelReady ? styles.placeholderHidden : ""
            }`}
          />
          <Image
            unoptimized
            src={PLACEHOLDER_LQ.tablet}
            alt=""
            fill
            sizes="100vw"
            className={`${styles.placeholder} ${styles.placeholderTablet} ${styles.lqPlaceholder} ${
              placeholderLoaded.tablet || modelReady
                ? styles.placeholderHidden
                : ""
            }`}
          />
          <Image
            src="/images/tinbox-shadowfree-tablet.webp"
            alt=""
            fill
            sizes="100vw"
            onLoad={() => markPlaceholderLoaded("tablet")}
            className={`${styles.placeholder} ${styles.placeholderTablet} ${styles.fullPlaceholder} ${
              modelReady ? styles.placeholderHidden : ""
            }`}
          />
          <Image
            unoptimized
            src={PLACEHOLDER_LQ.desktop}
            alt=""
            fill
            sizes="56vw"
            className={`${styles.placeholder} ${styles.placeholderDesktop} ${styles.lqPlaceholder} ${
              placeholderLoaded.desktop || modelReady
                ? styles.placeholderHidden
                : ""
            }`}
          />
          <Image
            src="/images/tinbox-shadowfree-desktop.webp"
            alt=""
            fill
            sizes="56vw"
            onLoad={() => markPlaceholderLoaded("desktop")}
            className={`${styles.placeholder} ${styles.placeholderDesktop} ${styles.fullPlaceholder} ${
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
              draggable
              interactiveLid
              lidBounce
              interactionLabel={t("v2.aboutDeck.modelInteraction")}
              groundShadow={false}
              loadingLabel=""
              modelScale={3}
              mobileModelScale={2.1}
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
