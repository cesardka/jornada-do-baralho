"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRepeat } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa";
import { ImageIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/app/contexts/I18nContext";

export default function NavMenu() {
  const { t, locale, setLocale } = useI18n();
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

  const handleResetSplash = () => {
    localStorage.removeItem("splashSeen");
    window.location.reload();
  };

  return (
    <header
      id="nav-menu"
      className={`w-full h-20 top-0 z-30 text-white transform transition-all sticky bg-[#016745] duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        style={{ margin: "0 auto" }}
        className={`relative flex items-center justify-between md:justify-center h-full w-4/5 px-5 text-3xl font-bold container lg transition-all duration-500 ${
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

        {/* Both buttons on the right side */}
        <div className="absolute -right-10 flex items-center gap-0 md:gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#016745] rounded overflow-hidden border border-white/20">
            <button
              aria-label={t("nav.lang_label")}
              onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
              className="text-white hover:text-[#016745] hover:bg-white text-sm px-3 py-1 transition-all"
            >
              {locale === "pt" ? t("nav.lang_pt") : t("nav.lang_en")}
            </button>
          </div>

          {/* Reset Animation Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleResetSplash}
                className="text-white bg-[#016745] hover:text-[#016745] hover:bg-white text-sm px-3 py-1 rounded transition-all"
              >
                <FaRepeat size={20} className="" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("nav.reset_splash")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Gallery link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/galeria"
                className="text-white bg-[#016745] hover:text-[#016745] hover:bg-white text-sm px-3 py-1 rounded transition-all flex items-center gap-2"
              >
                <ImageIcon size={20} />
                <span className="hidden md:inline">{t("nav.gallery")}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("nav.gallery_tooltip")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Blog link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Link
                  href="/blog"
                  className="text-white bg-[#016745] hover:text-[#016745] hover:bg-white text-sm px-3 py-1 rounded transition-all flex items-center gap-2"
                >
                  <FaBookOpen size={20} />
                  <span className="hidden md:inline">{t("nav.blog")}</span>
                </Link>
                {/* NEW Badge */}
                <div className="absolute -top-3 -right-4 transform rotate-12 bg-red-500 hidden md:flex items-center justify-center text-white px-2 py-1 rounded-sm shadow-lg border-2 border-white z-10 starburst duration-[10s] ease-in-out animate-pulse">
                  <span className="block text-[0.5rem] leading-none">
                    {t("common.new")}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("nav.blog_tooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
