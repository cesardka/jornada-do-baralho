"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ImageIcon } from "lucide-react";
import { useState, useCallback, useEffect } from "react";

export default function BlogNavMenu() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const setInvisible = currentScrollPos > 80;

    if (setInvisible && currentScrollPos > prevScrollPos) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header className={`p-4 sticky top-0 z-10 transform-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      <nav className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            width={120}
            height={60}
            src="/images/jornada-do-baralho.png"
            alt="Jornada do Baralho logo"
            className="w-auto h-12"
          />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/galeria"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <ImageIcon size={20} />
            <span className="hidden md:inline">Galeria</span>
          </Link>
          <Link
            href="/blog"
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <BookOpen size={20} />
            <span className="hidden md:inline">Blog</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
