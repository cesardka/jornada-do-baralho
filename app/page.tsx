"use client";

import { useRef } from "react";
import { AnimationProvider } from "./components/AnimationContext";
import AboutTheAuthor from "./components/ui/about-the-author";
import AboutTheChallenge from "./components/ui/about-the-challenge";
import BackgroundPattern from "./components/ui/background-pattern";
import DeckList from "./components/ui/deck-list";
import Footer from "./components/ui/footer";

export default function Card() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimationProvider>
      <div id="container" ref={containerRef}>
        <BackgroundPattern isBalatro={false} />
        <DeckList />
        <AboutTheChallenge />
        <AboutTheAuthor />
        <Footer />
      </div>
    </AnimationProvider>
  );
}
