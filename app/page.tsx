"use client";

import { useEffect, useRef, useState } from "react";
import { AnimationProvider } from "./contexts/AnimationContext";
import { I18nProvider, useI18n } from "./contexts/I18nContext";
import AboutTheAuthor from "./sections/about-the-author";
import AboutTheChallenge from "./sections/about-the-challenge";
import AboutTheJourney from "./sections/about-the-journey";
import DeckList from "./sections/deck-list";
import Footer from "./sections/footer";
import NavMenu from "./sections/nav-menu";
import SplashScreen from "./sections/splash-screen";
import BouncingText from "../components/ui/bouncing-text";
import { TooltipProvider } from "@radix-ui/react-tooltip";

function LoadingView({ isLoadingFadingOut }: { isLoadingFadingOut: boolean }) {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div
        className={`flex flex-col items-center space-y-4 transition-opacity duration-1000 ${
          isLoadingFadingOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <BouncingText text={t("common.loading")} />
      </div>
    </div>
  );
}

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

  return (
    <I18nProvider>
      {splashState === "loading" ? (
        <LoadingView isLoadingFadingOut={isLoadingFadingOut} />
      ) : splashState === "splash" ? (
        <SplashScreen onVideoEnd={handleVideoEnd} />
      ) : (
        <AnimationProvider>
          <TooltipProvider>
            <div
              className={`transition-opacity duration-1000 ${
                isFadingIn ? "opacity-100" : "opacity-0"
              }`}
            >
              <NavMenu />
              <div id="container" ref={containerRef}>
                <DeckList />
                <AboutTheChallenge />
                <AboutTheJourney />
                <AboutTheAuthor />
                <Footer />
              </div>
            </div>
          </TooltipProvider>
        </AnimationProvider>
      )}
    </I18nProvider>
  );
}
