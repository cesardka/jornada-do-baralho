"use client";

import React, { useRef, useEffect, useState } from "react";
import { FaFastForward } from "react-icons/fa";

interface SplashScreenProps {
  onVideoEnd: () => void;
}

export default function SplashScreen({ onVideoEnd }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.play().catch((err) => {
        console.error("Autoplay failed:", err);
      });
    }
  }, [isMuted]);

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
          autoPlay
          playsInline
          muted={isMuted}
          onEnded={handleVideoEnd}
          preload="auto"
        >
          <source src="/videos/JNB_V008.mp4" type="video/mp4" />
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
            Skip <FaFastForward size={10} />
          </button>
        )}

        {isMuted && (
          <button
            onClick={handleUnmute}
            className="absolute bottom-4 right-4 px-4 py-2 text-sm bg-white/80 hover:bg-white text-black rounded transition"
          >
            🔊 Unmute
          </button>
        )}
      </div>
    </div>
  );
}
