"use client";

import React, { useRef, useEffect, useState } from "react";

interface SplashScreenProps {
  onVideoEnd: () => void;
}

export default function SplashScreen({ onVideoEnd }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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

  return (
    <div
      className={`w-full h-screen flex items-center justify-center bg-black transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full h-auto aspect-video relative">
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
