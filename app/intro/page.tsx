"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";
import Nerdinho from "@/public/images/nerdinho.svg";

gsap.registerPlugin(useGSAP);

export default function Intro() {
  // 1. Imitate intro from Balatro (e.g. https://www.youtube.com/watch?v=mzEy_uj1nNk from 00:00:00 to 00:00:19)
  // 2. Nerdinho appears in the middle of the screen
  // 3. Nerdinho starts to glow up
  // 4. A bunch of references all over Jovem Nerd's history come to the center of the screen in a spiral motion
  // 5. Nerdinho gets to glow up more until the screen is completely white
  // 6. The name of the project fades into the screen
  // 7. Maybe use public/images/jovem-nerd-azaghal.webp behind the logo
  // 8. Logo moves to the navigation position
  // 9. End of animation
  const container = useRef<HTMLElement | null>();

  useGSAP(
    () => {
      const nerdinho = document.getElementById("nerdinho");
      if (!nerdinho) return;

      gsap
        .timeline()
        .to(nerdinho, {
          rotationX: "random(-10, 10)",
          rotationY: "random(-10, 10)",
          rotationZ: "random(-5, 5)",
          duration: "random(1, 2)",
          ease: "bezier",
          repeatRefresh: true,
          repeat: -1,
          yoyo: true,
        })
        .to(
          nerdinho,
          {
            duration: 0.8,
            x: 0,
            y: 0,
            ease: "elastic.out(1, 0.8)",
          },
          0
        )
        .to(nerdinho, {
          // Change Nerdinho to white
          // WIll probably need to refactor and use a trick using mask-image to make it glow
          duration: 3,
          ease: "expo.in",
        })
        .to(
          "#white-dot",
          {
            width: "142cqmax",
            height: "142cqmax",
            duration: 4,
            ease: "expo.in",
          },
          2
        )
        .to(
          "#white-mask",
          {
            clipPath: "circle(50% at 50% 50%)", // Shrinks to reveal the image
            duration: 4,
            ease: "expo.in",
          },
          2
        );
    },
    { scope: container }
  );

  return (
    <div
      id="container"
      className="bg-gray-800 h-screen w-screen justify-center overflow-hidden relative"
      ref={container}
    >
      <div className="flex justify-center items-center h-full overflow-hidden">
        <Image
          id="nerdinho"
          style={{
            transform: "translate(0, 200%)",

            //   boxShadow: "inset 0 0 10px 15px rgba(255, 255, 255)",
          }}
          src="/images/nerdinho.webp"
          alt="Nerdinho"
          width={120}
          height={120}
        />
        <div
          id="white-mask"
          className="rounded-full bg-green-200 w-0 h-0 absolute"
          style={{
            clipPath: "circle(0% at 50% 50%)", // Starts fully clipped
          }}
        ></div>
      </div>

      <div
        id="white-dot"
        className="rounded-full bg-white w-0 h-0 absolute"
        style={{}}
      ></div>
    </div>
  );
}
