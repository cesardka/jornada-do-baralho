"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaRepeat } from "react-icons/fa6";

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
  }, []);

  const handleResetSplash = () => {
    localStorage.removeItem("splashSeen");
    window.location.reload();
  };

  return (
    <header
      id="nav-menu"
      className={`w-full h-20 top-0 z-10 text-white transform transition-all sticky bg-[#016745] duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        style={{ margin: "0 auto" }}
        className={`relative flex items-center justify-center h-full w-4/5 px-5 text-3xl font-bold container lg transition-all duration-500 ${
          visible ? "text-md" : "invisible"
        }`}
      >
        {/* Debug-only reset button (you can remove condition if needed) */}
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={handleResetSplash}
            className="absolute left-0 text-white bg-[#016745] hover:text-[#016745] hover:bg-white text-sm px-3 py-1 rounded transition-all justify-start"
          >
            <FaRepeat size={30} className="" />
          </button>
        )}

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
