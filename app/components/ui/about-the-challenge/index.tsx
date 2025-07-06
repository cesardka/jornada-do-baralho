import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { bebasNeue } from "@/app/fonts";
import { useAnimation } from "../../AnimationContext";
import { FaMusic, FaPause } from "react-icons/fa";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutTheChallenge() {
  const { animationEnded } = useAnimation();
  const sectionRef = useRef(null);
  const azaghalRef = useRef(null);
  const alottoniRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // TODO:
  // -[x] Add a description of the challenge
  // -[x] Add a link to the challenge's website
  // -[ ] Add a description of what and who is Jovem Nerd and Azaghal, and their history

  useEffect(() => {
    if (!animationEnded) return;

    const ctx = gsap.context(() => {
      gsap.set([azaghalRef.current, alottoniRef.current], {
        x: 300,
        opacity: 0,
      });

      gsap.set([sectionRef.current], {
        backgroundSize: "100%",
      });

      gsap.to(azaghalRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      gsap.to(alottoniRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=50",
          end: "center center",
          scrub: true,
        },
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      gsap.to(sectionRef.current, {
        backgroundSize: "125%",
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top right",
          end: "center center",
          scrub: true, // smooth sync with scroll
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [animationEnded]);

  if (!animationEnded) {
    return null;
  }

  return (
    <section
      id="aboutTheChallenge"
      ref={sectionRef}
      className={`segment flex flex-row gap-10 md:gap-5 pl-10 pt-20 pb-0 relative overflow-hidden bg-[#FFB206] bg-[url('/images/bg/rainbow-vortex2.svg')] bg-cover bg-no-repeat bg-top-right h-auto w-full z-10`}
    >
      {/* LEFT COLUMN: Challenge Rules */}
      <div className="flex flex-col justify-center h-full w-1/2 text-white pl-20 z-20">
        {/* Massive, bold title */}
        <h2
          className={`${bebasNeue.className} text-[64px] md:text-[28px] lg:text-[64px] xl:text-[128px] leading-none font-extrabold mb-12 md:mb-6 lg:mb-8 xl:mb-16 uppercase tracking-wide drop-shadow-[-3px_6px_2px_#330000]`}
        >
          DESAFIO <br /> DO BARALHO
        </h2>

        {/* Enlarged and stylized rules list */}
        <ol
          className={`${bebasNeue.className} list-decimal list-inside space-y-10 md:space-y-5 md:pb-10 leading-tight drop-shadow-[-5px_4px_2px_#330000]`}
        >
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Conseguir o autógrafo em todas cartas de{" "}
            <span className="relative group inline-block cursor-pointer text-green-400">
              figuras{" "}
              <div className="absolute top-0 -left-10 -translate-x-1/2 xl:-translate-x-5 -translate-y-full mt-[-1rem] opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] transition-all duration-300 ease-out pointer-events-none flex">
                <img
                  src="/images/card/nerdcast-k-srk.webp"
                  alt="Carta Sr. K"
                  className="w-20 h-auto origin-bottom-right rotate-[-10deg] z-10"
                />
                <img
                  src="/images/card/nerdcast-q-francine.webp"
                  alt="Carta Francine"
                  className="w-20 h-auto origin-bottom-right rotate-[-5deg] z-10 -ml-4"
                />
                <img
                  src="/images/card/nerdcast-j-gugaferrari.webp"
                  alt="Carta Guga Ferrari"
                  className="w-20 h-auto origin-bottom-left rotate-[5deg] z-10 -ml-4"
                />
                <img
                  src="/images/card/nerdcast-a-nickellis.webp"
                  alt="Carta Nick Ellis"
                  className="w-20 h-auto origin-bottom-left rotate-[10deg] z-10 -ml-4"
                />
              </div>
            </span>
            ,{" "}
            <span className="relative group inline-block cursor-pointer text-red-400">
              coringas{" "}
              <div className="absolute top-0 left-0 xl:translate-x-5 -translate-y-full mt-[-1rem] opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] transition-all duration-300 ease-out pointer-events-none flex">
                <img
                  src="/images/card/nerdcast-joker-fabioyabu.webp"
                  alt="Carta Fabio Yabu"
                  className="w-20 h-auto rotate-[-5deg] z-10"
                />
                <img
                  src="/images/card/nerdcast-joker-tresde.webp"
                  alt="Carta Tresdê"
                  className="w-20 h-auto rotate-[5deg] z-10 -ml-4"
                />
              </div>
            </span>{" "}
            e{" "}
            <span className="relative group inline-block  cursor-pointer text-blue-400">
              reserva
              <div className="absolute top-0 left-0 xl:translate-x-5 -translate-y-full mt-[-1rem] opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] transition-all duration-300 ease-out pointer-events-none flex z-10">
                <img
                  src="/images/card/nerdcast-amigoimaginario.webp"
                  alt="Carta Amigo Imaginário"
                  className="w-20 h-auto z-10 ml-4"
                />
              </div>
            </span>
            .
          </li>
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Registrar o momento de cada carta sendo autografada.
          </li>
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Enviar o baralho assinado para o Jovem Nerd.
          </li>
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Ganhe o iPad lançado mais recentemente!
          </li>
        </ol>

        <div className="-mt-4 mb-16 flex flex-col w-full">
          <button
            onClick={toggleAudio}
            className={`${
              bebasNeue.className
            } inline-flex items-center justify-center gap-2 font-bold text-lg uppercase px-6 py-2 border-2 rounded-full transition-all animation-duration-[3000ms] ${
              isPlaying
                ? "bg-white text-black border-white shadow-lg shadow-yellow-400 animate-pulse"
                : "text-white border-white hover:bg-white hover:text-black"
            }`}
          >
            {isPlaying ? (
              <FaPause className="text-xl" />
            ) : (
              <FaMusic className="text-xl" />
            )}
            <span className="text-xl leading-none">
              {isPlaying ? "Pausar áudio" : "Ouça o desafio"}
            </span>
          </button>

          <p className="mt-2 text-xs text-white/80 italic">
            Trecho da leitura de e-mail do{" "}
            <a
              href="https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-313-hq-os-velhos-novos-52"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Nerdcast 313 – HQ: Os Velhos Novos 52
            </a>
            , publicado em 1º de junho de 2012
          </p>

          <audio
            ref={audioRef}
            src="/sounds/nc313_desafio_do_baralho.mp3"
            preload="auto"
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>
      </div>

      {/* RIGHT IMAGES */}
      <div className="flex-grow relative flex items-end justify-end h-full mt-16">
        {/* Image 1 — Azaghal (slightly above center) */}
        <img
          ref={azaghalRef}
          src="/images/azaghal-esquerdo.webp"
          alt="Azaghal"
          className="absolute right-40 xl:right-52 -bottom-0 h-full max-h-[90vh] w-auto object-contain"
        />

        {/* Image 2 — Jovem Nerd (slightly below center) */}
        <img
          ref={alottoniRef}
          src="/images/jovem-nerd-esquerdo.webp"
          alt="Jovem Nerd"
          className="relative -right-10 h-auto max-h-[90vh] w-auto z-10"
        />
      </div>
    </section>
  );
}
