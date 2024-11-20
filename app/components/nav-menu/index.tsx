"use client";

import { useState, useEffect } from "react";

export default function NavMenu() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > prevScrollPos) {
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
      className={`w-full h-20 top-0 z-10 sticky transform transition-all duration-500 ${
        visible ? "opacity-100" : "opacity-80 text-transparent"
      } `}
      style={{
        background:
          "linear-gradient(180deg, rgba(85, 0, 0,1) 0%, rgba(192,41,66,0) 100%)",
      }}
    >
      <div
        style={{ margin: "0 auto" }}
        className="flex items-center justify-between h-full w-4/6 px-5 text-3xl font-bold container lg"
      >
        test
      </div>
    </header>
  );
}
