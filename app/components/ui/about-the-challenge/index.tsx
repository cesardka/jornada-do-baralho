import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { bebasNeue } from "@/app/fonts";
import { useAnimation } from "../../AnimationContext";

gsap.registerPlugin(useGSAP);

export default function AboutTheChallenge() {
  const { animationEnded } = useAnimation();
  const sectionRef = useRef(null);
  const azaghalRef = useRef(null);
  const alottoniRef = useRef(null);

  // TODO:
  // - Add a description of the challenge
  // - Add a link to the challenge's website
  // - Add a description of what is Jovem Nerd and Azaghal, and their history

  useEffect(() => {
    if (!animationEnded) return;

    const ctx = gsap.context(() => {
      gsap.set([azaghalRef.current, alottoniRef.current], {
        x: 300,
        opacity: 0,
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
        backgroundSize: "145%",
        ease: "expo.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", // starts when section enters
          end: "bottom center", // ends when section leaves
          scrub: true, // smooth sync with scroll
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [animationEnded]);

  return (
    <section
      id="aboutTheChallenge"
      ref={sectionRef}
      className={`segment flex flex-row gap-10 md:gap-5 pl-10 pt-20 pb-0 relative overflow-hidden bg-[#FFB206] bg-[url('/images/bg/ed876c85-bd92-4bb9-beee-89eca7253e81.jpg')] bg-[length:100%_auto] bg-no-repeat bg-center ${
        animationEnded ? "h-screen w-screen z-10 mt-5" : "hidden"
      }`}
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
          className={`${bebasNeue.className} list-decimal list-inside space-y-10 md:space-y-5 md:pb-20 leading-tight drop-shadow-[-5px_4px_2px_#330000]`}
        >
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Consiga o autógrafo em todas cartas de{" "}
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
              bônus
              <div className="absolute top-0 left-0 xl:translate-x-5  -translate-y-full mt-[-1rem] opacity-0 group-hover:opacity-100 group-hover:-translate-y-[110%] transition-all duration-300 ease-out pointer-events-none flex">
                <img
                  src="/images/card/nerdcast-amigoimaginario.webp"
                  alt="Carta Amigo Imaginário"
                  className="w-20 h-auto z-10"
                />
              </div>
            </span>
            .
          </li>
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Registre o momento de cada carta sendo autografada.
          </li>
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Envie o baralho assinado para o Jovem Nerd.
          </li>
          <li className="text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] font-bold">
            Ganhe o iPad lançado mais recentemente!
          </li>
        </ol>
      </div>

      {/* RIGHT IMAGES */}
      <div className="flex-grow relative flex items-center justify-end pr-10 h-full">
        {/* Image 1 — Azaghal (slightly above center) */}
        <img
          ref={azaghalRef}
          src="/images/azaghal-esquerdo.webp"
          alt="Azaghal"
          className="absolute right-40 xl:right-40 bottom-0 h-full max-h-[90vh] w-auto object-contain"
        />

        {/* Image 2 — Jovem Nerd (slightly below center) */}
        <img
          ref={alottoniRef}
          src="/images/jovem-nerd-esquerdo.webp"
          alt="Jovem Nerd"
          className="absolute -right-20 -bottom-10 h-full max-h-[90vh] w-auto object-contain z-10"
        />
      </div>
    </section>
  );
}
