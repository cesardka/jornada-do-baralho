"use client";

import React, { useRef, useEffect, useState } from "react";

interface SplashScreenProps {
  onVideoEnd: () => void;
}

export default function SplashScreen({ onVideoEnd }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Start video playback after a small delay
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const timeout = setTimeout(() => {
        video.play().catch((err) => console.error("Autoplay failed:", err));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Handle video end by fading out
  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onVideoEnd(); // Switch to app content after fade out
    }, 1000); // Match this duration with Tailwind transition
  };

  return (
    <div
      className={`w-full h-screen flex items-center justify-center bg-black transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full h-auto aspect-video">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover landscape:object-contain max-w-none`}
          muted
          playsInline
          onEnded={handleVideoEnd}
          preload="auto"
        >
          <source src="/videos/JNB_V008.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
