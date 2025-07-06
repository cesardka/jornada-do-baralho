"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationProvider } from "./components/AnimationContext";
import AboutTheAuthor from "./components/ui/about-the-author";
import AboutTheChallenge from "./components/ui/about-the-challenge";
import DeckList from "./components/ui/deck-list";
import Footer from "./components/ui/footer";
import NavMenu from "./components/ui/nav-menu";
import SplashScreen from "./components/ui/splash-screen";
import BouncingText from "./components/ui/bouncing-text";

export default function Card() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splashState, setSplashState] = useState<
    "loading" | "splash" | "content"
  >("loading");
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isLoadingFadingOut, setIsLoadingFadingOut] = useState(false);

  useEffect(() => {
    const splashSeen = localStorage.getItem("splashSeen");

    if (splashSeen === "true") {
      setSplashState("content");
    } else {
      // Start fade-out after 500ms
      const startFade = setTimeout(() => setIsLoadingFadingOut(true), 500);
      // Wait for fade to complete before transitioning
      const showSplash = setTimeout(() => setSplashState("splash"), 1500); // 1s fade duration

      return () => {
        clearTimeout(startFade);
        clearTimeout(showSplash);
      };
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
        <div
          className={`flex flex-col items-center space-y-4 transition-opacity duration-1000 ${
            isLoadingFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <BouncingText text="Carregando..." />
        </div>
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
