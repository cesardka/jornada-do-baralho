"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function NavMenu() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const setInvisible = currentScrollPos > 80;

    if (setInvisible && currentScrollPos > prevScrollPos) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <header
      id="nav-menu"
      className={`w-full h-20 top-0 z-10 text-white transform transition-all sticky bg-[#016745] duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } `}
    >
      <div
        style={{ margin: "0 auto" }}
        className={`flex items-center justify-center h-full w-4/5 px-5 text-3xl font-bold container lg transform transition-all duration-500 ${
          visible ? "text-md" : "invisible"
        }`}
      >
        <Image
          width={100}
          height={50}
          src="/images/jornada-do-baralho.png"
          alt="Jornada do Baralho logo"
          className="w-auto h-16"
        />
      </div>
    </header>
  );
}
