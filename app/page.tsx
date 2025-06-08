"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef, useEffect } from "react";
import { AnimationProvider } from "./components/AnimationContext";
import AboutTheAuthor from "./components/ui/about-the-author";
import AboutTheChallenge from "./components/ui/about-the-challenge";
import BackgroundPattern from "./components/ui/background-pattern";
import DeckList from "./components/ui/deck-list";

gsap.registerPlugin(ScrollTrigger);

export default function Card() {
  const containerRef = useRef<HTMLDivElement>(null);

  // TBD if I will use this or not...
  useEffect(() => {
    const sections = gsap.utils.toArray(".segment") as HTMLElement[];

    sections.forEach((section, _) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: true,
          snap: 1 / (sections.length - 1), // Creates smooth snap effect
        },
      });
    });
  }, []);

  return (
    <AnimationProvider>
      <div id="container" ref={containerRef}>
        <BackgroundPattern />
        <DeckList />
        <AboutTheChallenge />
        <AboutTheAuthor />
      </div>
    </AnimationProvider>
  );
}
