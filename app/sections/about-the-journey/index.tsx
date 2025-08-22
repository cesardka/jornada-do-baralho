"use client";

import Image from "next/image";
import Link from "next/link";
import { bebasNeue } from "@/app/fonts";
import { SocialMediaIcon } from "../card-details/socialMediaIcon";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaMusic } from "react-icons/fa";
import { useI18n } from "@/app/contexts/I18nContext";

export default function AboutTheJourney() {
  const { t } = useI18n();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const DEFAULT_VOLUME = 0.3;

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }
  }, []);

  return (
    <section
      id="aboutTheJourney"
      className="segment relative w-full min-h-screen overflow-hidden"
    >
      {/* Desktop layout: side-by-side. Mobile: stacked (text on top, image bottom) */}
      <div className="relative flex flex-col md:flex-row w-full h-full">
        {/* RIGHT PANEL (on desktop): Text content with animated galaxy background */}
        <div className="order-2 md:order-2 relative w-full md:w-1/2 min-h-[60vh] md:min-h-screen text-white bg-[#0a0a12]">
          {/* Left-edge fade to merge with image on desktop; bottom fade on mobile */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-24 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,18,0) 0%, rgba(10,10,18,0.6) 40%, rgba(10,10,18,1) 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 md:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,18,0) 0%, rgba(10,10,18,0.6) 40%, rgba(10,10,18,1) 100%)",
            }}
          />

          {/* Content container */}
          <div className="relative z-10 px-6 md:px-12 lg:px-16 xl:px-32 py-12 md:py-20">
            <h2
              className={`${bebasNeue.className} text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide uppercase mb-6`}
            >
              {t("aboutJourney.titleWhoAmI")}
            </h2>

            <div className="space-y-6 text-base md:text-xl leading-relaxed text-white/90 max-w-4xl">
              <p>
                {t("aboutJourney.p1_begin")}
                <Link
                  href="https://www.linkedin.com/in/c%C3%A9sar-hoffmann/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  César Hoffmann
                </Link>
                {t("aboutJourney.p1_afterName")}
                {new Date().getFullYear() - 2012}
                {t("aboutJourney.p1_afterYears")}
              </p>

              <p>
                {t("aboutJourney.p2_begin")}
                <Link
                  href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-70-harry-potter-70-mas-nao-aguenta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  #70 - Harry Potter: 70 mas não agüenta!
                </Link>
                {t("aboutJourney.p2_end")}
              </p>

              <h2
                className={`${bebasNeue.className} text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide uppercase mb-6`}
              >
                {t("aboutJourney.titleDeck")}
              </h2>

              <p>
                {t("aboutJourney.deck_p1_before_ep")}
                <Link
                  href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-312-nercast-do-baralho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  #312 - Nerdcast do Baralho
                </Link>
                {t("aboutJourney.deck_p1_between_links")}
                <Link
                  href="https://web.archive.org/web/20121214093601/http://www.nerdstore.com.br/produto/baralho-jn.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  Baralho Nerdcast
                </Link>
                {t("aboutJourney.deck_p1_after_product")}
              </p>
              <p>
                {t("aboutJourney.deck_p2_before_ep")}
                <Link
                  href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-313-hq-os-velhos-novos-52"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  #313 - HQ: Os Velhos Novos 52
                </Link>
                {t("aboutJourney.deck_p2_after_ep")}
              </p>

              <div
                id="audio-controls"
                className="-mt-4 py-2 md:pt-0 md:pb-0 flex flex-col items-center md:items-start w-full"
              >
                <button
                  onClick={toggleAudio}
                  className={`${
                    bebasNeue.className
                  } w-full inline-flex items-center justify-center gap-2 font-bold text-lg uppercase px-6 py-4 border-2 rounded-full transition-all animation-duration-[3000ms] ${
                    isPlaying
                      ? "bg-white text-black border-white shadow-sm shadow-gray-400 animate-pulse"
                      : "text-white border-white hover:bg-white hover:text-black"
                  }`}
                >
                  {isPlaying ? (
                    <FaPause className="text-xl" />
                  ) : (
                    <FaMusic className="text-xl" />
                  )}
                  <span className="text-xl leading-none">
                    {isPlaying
                      ? t("aboutJourney.pauseAudio")
                      : t("aboutJourney.listenChallenge")}
                  </span>
                </button>

                {/* <p className="mt-2 text-xs text-white/80 italic w-full flex-inline items-center justify-center">
                  Trecho da leitura de e-mail do{" "}
                  <Link
                    href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-313-hq-os-velhos-novos-52"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white inline-flex break-words"
                  >
                    Nerdcast 313 &ndash; HQ: Os Velhos Novos 52
                  </Link>
                  , publicado em 1º de junho de 2012
                </p> */}

                <audio
                  ref={audioRef}
                  src="/sounds/nc313_desafio_do_baralho.mp3"
                  preload="auto"
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                />
              </div>

              <h2
                className={`${bebasNeue.className} text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide uppercase mb-6`}
              >
                {t("aboutJourney.myJourney")}
              </h2>
              <p>
                {t("aboutJourney.my_p1_before_link")}
                <Link
                  href="https://www.enjoei.com.br/p/baralho-nerdcast-rpg-algumas-cartas-autografadas-93103206?vid=332492ff-e6b9-4f26-8667-90f70376512d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300"
                >
                  Enjoei
                </Link>
                {t("aboutJourney.my_p1_after_link")}
              </p>

              <p>{t("aboutJourney.my_p2")}</p>

              <p>{t("aboutJourney.my_p3")}</p>

              <p>
                {t("aboutJourney.my_p4_before_first_date")}
                <span className="text-green-300 font-extrabold">
                  Jornada do Baralho 🃏
                </span>
                {t("aboutJourney.my_p4_after_first_date_before_link")}
                <Link
                  href="https://github.com/cesardka/jornada-do-baralho/commit/346d55275c024ff711102a24a728b02069a67069"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300 inline-flex items-center gap-1"
                >
                  6 de novembro de 2024{" "}
                  <SocialMediaIcon type="github" size={14} />
                </Link>
                {t("aboutJourney.my_p4_after_link_before_second_date")}
                <Link
                  href="https://produto.mercadolivre.com.br/MLB-4649269134-baralho-nerdcast-jovem-nerd-_JM?quantity=1&variation_id=182642369255"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-yellow-400 transition-colors duration-300 inline-flex items-center gap-1"
                >
                  outro anúncio
                </Link>
                {t("aboutJourney.my_p4_after_second_link")}{" "}
                <strong>{t("aboutJourney.my_p4_end")}</strong>
              </p>

              <p>
                Resta agora conseguir as assinaturas possíveis e encerrar esse
                ciclo... Vamos nessa?
              </p>
            </div>
          </div>
        </div>

        {/* LEFT PANEL (on desktop): Full image placeholder */}
        <div className="order-1 md:order-1 relative w-full md:w-1/2 min-h-[40vh] md:min-h-screen">
          {/* Bottom image: fully visible */}
          <Image
            src={"/images/cesar-hoffmann-baralho-2024.webp"}
            alt={t("aboutJourney.imgBgAlt")}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Top image: diagonal mask fade to reveal the one below */}
          <Image
            src={"/images/cesar-hoffmann-baralho-velho-2024.webp"}
            alt={t("aboutJourney.imgTopAlt")}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover diagonal-fader diagonal-fader-top"
          />
        </div>
      </div>
    </section>
  );
}
