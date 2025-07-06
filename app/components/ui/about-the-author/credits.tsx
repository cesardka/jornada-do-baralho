import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { bebasNeue } from "@/app/fonts";
import Image from "next/image";
import { PROJECT_AUTHORS } from "./data";
import { useRef } from "react";
import { SocialMediaIcon } from "../card-details/socialMediaIcon";
import Link from "next/link";
import { useAnimation } from "../../AnimationContext";

gsap.registerPlugin(useGSAP);

export default function Credits() {
  const { animationEnded } = useAnimation();
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
      className={`py-28 px-28 flex flex-row w-full h-full items-center justify-around`}
    >
      {PROJECT_AUTHORS.map((person) => (
        <div
          key={person.name}
          className={`flex md:flex-col flex-row justify-center items-center w-full`}
        >
          <Image
            src={person.imageSrc}
            alt={person.name}
            width={300}
            height={300}
            className={`project-author rounded-xl object-cover max-w-xs h-auto drop-shadow-md`}
          />
          <div
            className={`${bebasNeue.className} flex flex-col w-fit flex-grow gap-2 mt-6 px-0 text-center md:text-left drop-shadow-md text-white`}
          >
            <div className="font-extrabold text-[24px] md:text-[16px] lg:text-[32px] xl:text-[56px] border-t-2 border-b-white w-[400px]">
              {person.name}
            </div>

            <ul className="flex flex-row space-x-2 -mt-4">
              {person.socialMedia.map((social, index) => (
                <li key={index}>
                  {social.link && (
                    <Link
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-blue-800 transition-all duration-300 ease-out"
                    >
                      {/* Placeholder for icon */}
                      <SocialMediaIcon type={social.type} size={30} />
                      {/* {social.name} */}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="text-lg text-white">{person.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
