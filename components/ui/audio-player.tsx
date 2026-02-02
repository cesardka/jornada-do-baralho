"use client";

import { useRef, useState, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

interface AudioPlayerProps {
  src: string;
  label?: string;
  className?: string;
}

export default function AudioPlayer({ src, label, className = "" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const DEFAULT_VOLUME = 0.5;

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }
  }, []);

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      <button
        onClick={toggleAudio}
        className={`w-full inline-flex items-center justify-center gap-2 font-bold text-base uppercase px-6 py-3 border-2 rounded-full transition-all duration-300 ${
          isPlaying
            ? "bg-blue-600 text-white border-blue-600 shadow-md animate-pulse"
            : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
      >
        {isPlaying ? (
          <FaPause className="text-lg" />
        ) : (
          <FaPlay className="text-lg" />
        )}
        <span className="text-lg leading-none">
          {label || (isPlaying ? "Pausar" : "Ouvir áudio")}
        </span>
      </button>

      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      />
    </div>
  );
}
