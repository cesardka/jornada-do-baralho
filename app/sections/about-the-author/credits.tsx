import { useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { bebasNeue } from "@/app/fonts";
import { PROJECT_AUTHORS } from "./author-data";
import { SocialMediaIcon } from "../card-details/socialMediaIcon";

gsap.registerPlugin(useGSAP);

export default function Credits() {
  const creditsContainer = useRef<HTMLDivElement | null>(null);
  useGSAP(
    () => {
      const authors = gsap.utils.toArray(".project-author") as HTMLElement[];

      gsap.timeline().to(authors, {
        rotationX: "random(-10, 10)",
        rotationY: "random(-10, 10)",
        rotationZ: "random(-2, 2)",
        duration: "random(1, 4)",
        ease: "bezier",
        repeatRefresh: true,
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: creditsContainer }
  );

  return (
    <div
      ref={creditsContainer}
      className={`py-12 px-6 md:px-16 flex flex-col md:flex-row flex-wrap gap-y-12 md:gap-x-16 items-center md:items-start justify-around w-full h-full`}
    >
      {PROJECT_AUTHORS.map((person) => (
        <div
          key={person.name}
          className="w-full md:w-1/3 max-w-full md:max-w-[20vw] flex flex-col items-center md:items-start"
        >
          <span className="relative w-full group inline-block">
            {/* Lena's exclusive hover effect */}
            <div className={`${person.name !== "Lena Franzz" ? "hidden" : ""}`}>
              <div className="absolute bottom-28 left-40 translate-x-0 group-hover:-translate-x-44 transition-all duration-300 ease-out flex">
                <Image
                  src="/images/kale2.png"
                  width={250}
                  height={400}
                  alt="Kale, protagonista da animação Kale do Museu Assustador"
                  className="w-20 h-auto origin-center rotate-[-55deg]"
                />
              </div>
              <div className="absolute bottom-5 left-28 translate-x-0 group-hover:-translate-x-28 transition-all duration-300 ease-out flex">
                <Image
                  src="/images/kiza.png"
                  width={250}
                  height={400}
                  alt="Kiza, protagonista da animação Kale do Museu Assustador"
                  className="w-20 h-auto origin-center rotate-[-55deg]"
                />
              </div>
            </div>

            <div className="flex justify-center w-full">
              <Image
                src={person.imageSrc}
                alt={person.name}
                width={300}
                height={300}
                className={`project-author rounded-xl object-cover w-4/5 max-w-xs h-auto drop-shadow-md justify-self-center`}
              />
            </div>
          </span>

          <div className="flex flex-col gap-2 mt-2 pt-2 px-0 text-center md:text-left text-white drop-shadow-md">
            <div
              className={`${bebasNeue.className} flex flex-row items-center justify-center md:justify-start font-extrabold text-2xl xl:text-5xl pt-4 border-t-2 border-b-white`}
            >
              {person.name}
              <ul className="inline-flex items-center space-x-2 ml-4">
                {person.socialMedia.map((social, index) => (
                  <li key={index}>
                    {social.link && (
                      <Link
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-blue-800 transition-all duration-300 ease-out"
                      >
                        <SocialMediaIcon type={social.type} size={30} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="italic font-semibold text-sm md:text-xs lg:text-sm xl:text-base -mt-1 mb-3">
              {person.title}
            </div>

            <div className="text-justify text-base md:text-sm lg:text-base xl:text-lg">
              {person.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
