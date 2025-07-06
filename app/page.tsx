"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationProvider } from "./components/AnimationContext";
import AboutTheAuthor from "./components/ui/about-the-author";
import AboutTheChallenge from "./components/ui/about-the-challenge";
import DeckList from "./components/ui/deck-list";
import Footer from "./components/ui/footer";
import NavMenu from "./components/ui/nav-menu";
import SplashScreen from "./components/ui/splash-screen";

export default function Card() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splashState, setSplashState] = useState<
    "loading" | "splash" | "content"
  >("loading");
  const [isFadingIn, setIsFadingIn] = useState(false);

  useEffect(() => {
    const splashSeen = localStorage.getItem("splashSeen");

    if (splashSeen === "true") {
      setSplashState("content");
    } else {
      setTimeout(() => setSplashState("splash"), 500);
    }
  }, []);

  const handleVideoEnd = () => {
    localStorage.setItem("splashSeen", "true");
    setSplashState("content");
  };

  // Trigger fade-in after layout is mounted
  useEffect(() => {
    if (splashState === "content") {
      // Delay to let content mount before fading
      const timeout = setTimeout(() => setIsFadingIn(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [splashState]);

  if (splashState === "loading") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (splashState === "splash") {
    return <SplashScreen onVideoEnd={handleVideoEnd} />;
  }

  return (
    <AnimationProvider>
      <div
        className={`transition-opacity duration-1000 ${
          isFadingIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <NavMenu />
        <div id="container" ref={containerRef}>
          <DeckList />
          <AboutTheChallenge />
          <AboutTheAuthor />
          <Footer />
        </div>
      </div>
    </AnimationProvider>
  );
}
