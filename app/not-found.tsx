"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import MarchingCards from "../components/ui/marching-cards";
import { SocialMediaIcon } from "./sections/card-details/socialMediaIcon";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative">
      {/* Marching cards at top - left to right */}
      <MarchingCards direction="left" position="top" opacity={0.15} />

      {/* Marching cards at bottom - right to left */}
      <MarchingCards direction="right" position="bottom" opacity={0.15} />

      <div
        className={`text-center max-w-2xl mx-auto transition-all duration-1000 relative z-10 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 animate-pulse">
            {/* 404 */}
          </h1>
        </div>

        {/* Card-themed message */}
        <div className="mb-8 space-y-4">
          <div className="text-2xl md:text-3xl text-white font-semibold">
            {/* <BouncingText text="Carta não encontrada!" /> */}
          </div>
          <p className="text-gray-300 text-lg md:text-xl">
            Parece que esta página saiu do baralho... 🃏
          </p>
          <p className="text-gray-400 text-base md:text-lg">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Illustration - Flip Card */}
        <div className="mb-8 flex justify-center relative z-10 px-4">
          <div
            className="relative w-full max-w-sm h-48 md:max-w-none md:w-[40rem] md:h-[22.5rem] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-700 preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front - Illustration */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <Image
                  src="/images/illustrations/ilustra-nao_pensa_no_404.jpeg"
                  alt="Não pensa no 404..."
                  fill
                  className="rounded-lg shadow-xl object-cover"
                  priority
                />
              </div>

              {/* Back - Lena Franzz Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-2 md:p-6 flex flex-col justify-center items-center text-white overflow-hidden">
                <div className="text-center max-w-full px-1">
                  <Image
                    src="/images/NERDINHO_LENA.webp"
                    alt="Lena Franzz"
                    width={96}
                    height={96}
                    className="w-12 h-12 md:w-24 md:h-24 rounded-full mx-auto mb-2 md:mb-4 object-cover"
                  />
                  <h3 className="text-base md:text-2xl font-bold text-white mb-1 md:mb-2">
                    Lena Franzz
                  </h3>
                  <p className="text-xs md:text-base text-gray-300 mb-1 md:mb-3">
                    Animadora, ilustradora, diretora de animação
                  </p>
                  <p className="hidden md:block text-xs md:text-sm text-gray-400 leading-tight md:leading-relaxed mb-2 md:mb-3 px-1">
                    Gaúcha naturalizada carioca, sócia-fundadora do Studio
                    Chifrezz. Responsável pela ilustração &quotNão pensa no
                    404...&quot desta página e de todas as outras na Jornada do
                    Baralho.
                  </p>
                  <div className="flex justify-center gap-2 md:gap-4 mt-1 md:mt-4">
                    <a
                      href="https://www.studiochifrezz.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 text-white hover:text-yellow-400 transition-colors duration-200"
                    >
                      <SocialMediaIcon type="chifrezz" size={12} />
                      <span className="text-xs md:text-sm">
                        Studio Chifrezz
                      </span>
                    </a>
                    <a
                      href="https://www.instagram.com/studiochifrezz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 md:gap-2 text-white hover:text-yellow-400 transition-colors duration-200"
                    >
                      <SocialMediaIcon type="insta" size={12} />
                      <span className="text-xs md:text-sm">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200"
          >
            <Home size={20} className="text-white" />
            Voltar ao Início
          </Link>
        </div>

        {/* Fun message */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>💡 Dica: Que tal explorar as cartas do Nerdcast?</p>
        </div>
      </div>
    </div>
  );
}
