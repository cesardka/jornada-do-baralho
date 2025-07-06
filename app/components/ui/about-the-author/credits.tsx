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
      className={`py-28 px-28 flex flex-row w-full h-full items-start justify-around`}
    >
      {PROJECT_AUTHORS.map((person) => (
        <div
          key={person.name}
          className={`flex md:flex-col flex-row justify-center items-center w-full`}
        >
          <span className="relative group inline-block text-green-400">
            <div className={`${person.name !== "Lena Franzz" ? "hidden" : ""}`}>
              <div className="absolute bottom-28 left-10 translate-x-0 group-hover:-translate-x-24 transition-all duration-300 ease-out flex">
                <img
                  src="/images/kale2.png"
                  alt="Kale"
                  className="w-20 h-auto origin-center rotate-[-55deg]"
                />
              </div>
              <div className="absolute bottom-5 left-10 translate-x-0 group-hover:-translate-x-20 transition-all duration-300 ease-out flex">
                <img
                  src="/images/kiza.png"
                  alt="Kiza"
                  className="w-20 h-auto origin-center rotate-[-55deg]"
                />
              </div>
            </div>

            <Image
              src={person.imageSrc}
              alt={person.name}
              width={300}
              height={300}
              className={`project-author rounded-xl object-cover max-w-xs h-auto drop-shadow-md`}
            />
          </span>
          <div
            className={`flex flex-col w-fit flex-grow gap-2 mt-6 px-0 text-center md:text-left drop-shadow-md text-white`}
          >
            <div
              className={`${bebasNeue.className} font-extrabold text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] pt-2 border-t-2 border-b-white w-[400px]`}
            >
              {person.name}
              <ul className="inline-flex items-center space-x-2 ml-4 -mb-1">
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

            <div className="italic font-semibold text-[0.85rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem] text-white w-[400px] -mt-5 mb-3">
              {person.title}
            </div>

            <div className="text-justify text-[1.25rem] md:text-[1rem] lg:text-[1.3rem] xl:text-[1.35rem] text-white w-[400px]">
              {person.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
