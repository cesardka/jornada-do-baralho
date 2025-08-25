"use client";

import { useI18n } from "@/app/contexts/I18nContext";
import { useScreenWidth } from "@/app/hooks/useScreenWidth";
import React, { useRef, useEffect, useState } from "react";
import { FaFastForward } from "react-icons/fa";
import { MdAudiotrack } from "react-icons/md";

interface SplashScreenProps {
  onVideoEnd: () => void;
}

export default function SplashScreen({ onVideoEnd }: SplashScreenProps) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);

  const isMobile = useScreenWidth();
  const videoToBePlayed = isMobile
    ? "/videos/JNB_vertical.mp4"
    : "/videos/JNB_horizontal.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.play().catch((err) => {
        console.error("Autoplay failed:", err);
      });
    }
  }, [isMuted]);

  // Ensure the correct source is actually loaded and played when the device classification changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      // Reload the element so the updated <source> is taken into account
      try {
        video.pause();
        video.load();
      } catch (e) {
        // no-op
        console.warn("Error reloading video element:", e);
      }
      video
        .play()
        .catch((err) =>
          console.error("Autoplay after source change failed:", err)
        );
    }
  }, [videoToBePlayed, isMuted]);

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onVideoEnd();
    }, 1000);
  };

  const handleUnmute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleSkip = () => {
    handleVideoEnd();
  };

  const handleUserInteraction = () => {
    if (!showSkipButton) {
      setShowSkipButton(true);
    }
  };

  return (
    <div
      className={`w-full h-screen flex items-center justify-center bg-black transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <div className="w-auto h-full md:h-full aspect-video relative overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover landscape:object-contain max-w-none"
          key={isMobile ? "mobile" : "desktop"}
          autoPlay
          playsInline
          muted={isMuted}
          onEnded={handleVideoEnd}
          preload="auto"
        >
          <source src={videoToBePlayed} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Blur overlay for top and bottom edges */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {showSkipButton && (
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 px-4 py-2 text-sm bg-white/80 hover:bg-white text-black rounded transition-all duration-500 animate-in fade-in flex items-center justify-center gap-2"
          >
            {t("common.skip")} <FaFastForward size={10} />
          </button>
        )}

        {isMuted && (
          <button
            onClick={handleUnmute}
            className="absolute bottom-4 right-4 px-4 py-2 text-sm bg-white/80 hover:bg-white text-black rounded transition-all duration-500 animate-in fade-in flex items-center justify-center gap-2"
          >
            {t("common.unmute")} <MdAudiotrack size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
