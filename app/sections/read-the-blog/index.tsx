"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/app/contexts/I18nContext";
import { bebasNeue } from "@/app/fonts";
import NewsletterForm from "@/components/ui/newsletter-form/newsletter-form";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Final rotations for each side card (match the previous static rotate-[Xdeg]
// classes). Positive = tilted clockwise, negative = counter-clockwise.
const CARD_TILTS = {
  alottoni: 5,
  azaghal: 15,
  sraJovemNerd: -5,
  portuguesa: -15,
} as const;

export default function ReadTheBlog() {
  const { t } = useI18n();
  const router = useRouter();

  const sectionRef = useRef<HTMLElement>(null);
  const alottoniRef = useRef<HTMLImageElement>(null);
  const azaghalRef = useRef<HTMLImageElement>(null);
  const sraJovemNerdRef = useRef<HTMLImageElement>(null);
  const portuguesaRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      // A single scrubbed timeline drives all four cards. Timeline progress
      // is tied to the user's scroll position through the section:
      //   • starts when the section's top enters the viewport bottom
      //   • ends when 75% of the section has scrolled into view
      // ScrollTrigger automatically reverses the timeline on scroll-up.
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "75% bottom",
          scrub: 0.6, // small smoothing so scroll → animation feels fluid
        },
      });

      // Left-side cards swing in from the left (start rotated far CCW, tilt
      // clockwise into their final positive angle). Origin at the bottom-left
      // makes them pivot off the floor.
      const leftCards: Array<[React.RefObject<HTMLImageElement>, number]> = [
        [alottoniRef, CARD_TILTS.alottoni],
        [azaghalRef, CARD_TILTS.azaghal],
      ];
      leftCards.forEach(([ref, targetRot], i) => {
        if (!ref.current) return;
        tl.fromTo(
          ref.current,
          {
            rotation: -90,
            xPercent: -30,
            yPercent: 40,
            opacity: 0,
            transformOrigin: "bottom left",
          },
          {
            rotation: targetRot,
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            duration: 1,
          },
          i * 0.15,
        );
      });

      // Right-side cards mirror: swing in from the right.
      const rightCards: Array<[React.RefObject<HTMLImageElement>, number]> = [
        [sraJovemNerdRef, CARD_TILTS.sraJovemNerd],
        [portuguesaRef, CARD_TILTS.portuguesa],
      ];
      rightCards.forEach(([ref, targetRot], i) => {
        if (!ref.current) return;
        tl.fromTo(
          ref.current,
          {
            rotation: 90,
            xPercent: 30,
            yPercent: 40,
            opacity: 0,
            transformOrigin: "bottom right",
          },
          {
            rotation: targetRot,
            xPercent: 0,
            yPercent: 0,
            opacity: 1,
            duration: 1,
          },
          i * 0.15,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="readTheBlog"
      className="segment relative w-full min-h-screen overflow-hidden bg-[url('/images/bg/paper-texture-bg2.jpg')] bg-cover bg-center"
    >
      {/* Background Card Images — rotation is now driven by GSAP, so we drop
          the static rotate-[Xdeg] Tailwind classes on these images. */}
      <div className="absolute -left-10 bottom-0 pointer-events-none">
        {/* Alottoni Card - positioned further left */}
        <Image
          ref={alottoniRef}
          src="/images/card/nerdcast-k-alottoni.webp"
          alt="Nerdcast Alottoni Card"
          width={200}
          height={300}
          className="absolute bottom-3 left-0 w-32 md:w-72 h-auto max-w-72 border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
        {/* Azaghal Card - positioned slightly to the right and overlapping */}
        <Image
          ref={azaghalRef}
          src="/images/card/nerdcast-k-azaghal.webp"
          alt="Nerdcast Azaghal Card"
          width={200}
          height={300}
          className="absolute -bottom-12 left-32 w-32 md:w-72 h-auto max-w-72 border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
      </div>

      <div className="absolute -right-10 bottom-0 pointer-events-none">
        {/* Sra Jovem Nerd Card - positioned further right */}
        <Image
          ref={sraJovemNerdRef}
          src="/images/card/nerdcast-q-srajovemnerd.webp"
          alt="Nerdcast Alottoni Card"
          width={200}
          height={300}
          className="absolute bottom-3 right-0 w-32 md:w-72 h-auto max-w-72 border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
        {/* Portuguesa Card - positioned slightly to the left and overlapping */}
        <Image
          ref={portuguesaRef}
          src="/images/card/nerdcast-q-portuguesa.webp"
          alt="Nerdcast Portuguesa Card"
          width={200}
          height={300}
          className="absolute -bottom-12 right-32 w-32 md:w-72 h-auto max-w-72 border-solid rounded-md border-gray-500 shadow-lg shadow-gray-200"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-32 py-12 md:py-20 relative z-10">
        <h2
          className={`${bebasNeue.className} text-[64px] md:text-[28px] lg:text-[64px] xl:text-[128px] leading-none font-extrabold mb-2 uppercase tracking-wide text-black drop-shadow-[-3px_6px_2px_#CCCCCC] text-center`}
        >
          {t("readTheBlog.title")} <br /> {t("readTheBlog.title1")}
        </h2>

        <div className="flex flex-col items-center justify-center mb-6 mt-0">
          <p className="text-sm italic text-center">
            {t("readTheBlog.description_1_quote_rebelde")}
          </p>
        </div>

        <div className="pt-4 space-y-6 text-lg text-center">
          <div className="flex flex-col items-center justify-center space-y-0">
            <p>{t("readTheBlog.description_2_lento_e_espacado")}</p>
            <p>{t("readTheBlog.description_21_jornada_thanos")}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-0">
            <p>{t("readTheBlog.description_3_apesar_disso")}</p>
            <p>{t("readTheBlog.description_3_vem_ai")}</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 py-4 font-extrabold text-center">
            <p className="text-2xl md:text-5xl">
              {t("readTheBlog.description_4_curtiu")}
            </p>
            <p className="text-xl md:text-2xl">
              {t("readTheBlog.description_6_quer_saber")}
            </p>
            <p className="text-lg md:text-xl">
              {t("readTheBlog.description_5_curiosidade")}
            </p>
          </div>

          {/* Blog Button */}
          <p className="md:w-2/3 flex justify-center mx-auto pb-24 md:pb-0">
            <button
              onClick={() => router.push("/blog")}
              className={`${bebasNeue.className} w-full inline-flex items-center justify-center bg-[url('/images/bg/washi-tape-texture4.webp')] bg-cover bg-center gap-2 font-bold text-3xl md:text-5xl uppercase px-6 py-6 md:py-12 transition-all duration-300 text-black hover:brightness-110 hover:drop-shadow-md hover:shadow-gray-400`}
            >
              {t("readTheBlog.readBlogButton")}
            </button>
          </p>

          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
