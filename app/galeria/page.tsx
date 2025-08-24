"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play } from "lucide-react";
import MarchingCards from "../../components/ui/marching-cards";
import { SocialMediaIcon } from "../sections/card-details/socialMediaIcon";

const illustrations = [
  {
    src: "/videos/JNB_V008.mp4",
    alt: "Vídeo de Abertura - A Jornada do Baralho",
    title: "Vídeo de Abertura",
    description: "Assista ao vídeo de introdução da Jornada do Baralho!",
    type: "video",
  },
  {
    src: "/images/illustrations/ilustra-sem_assinatura.png",
    alt: "Sem Assinatura - Ilustração",
    title: "Sem Assinatura",
    description: "Ilustração para quando uma carta ainda não foi assinada",
    type: "image",
  },
  {
    src: "/images/illustrations/ilustra-sem_redes.png",
    alt: "Sem Redes - Ilustração",
    title: "Sem Redes",
    description:
      "Ilustração para os Nerdcasters que não possuem redes sociais públicas",
    type: "image",
  },
  {
    src: "/images/illustrations/ilustra-nao_pensa_no_404.jpeg",
    alt: "Não pensa no 404 - Ilustração",
    title: "Não pensa no 404...",
    description:
      "Ilustração temática para página de erro 404 lembrando da Portuguesa e Sra. Jovem Nerd dormindo na casa da vó",
    type: "image",
  },
  {
    src: "/images/illustrations/ilustra-harald_stricker.jpeg",
    alt: "Homenagem a Harald Stricker - Ilustração",
    title: "Harald Stricker",
    description:
      "Ilustração em homenagem ao Harald Stricker, o Android, nosso saudoso nerdcaster e todo um elenco de personagens que marcaram a passagem dele pelo universo Jovem Nerd",
    type: "image",
  },
];

export default function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleVideoClick = () => {
    setShowVideoModal(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
      {/* Marching cards at top - left to right */}
      <MarchingCards direction="left" position="top" opacity={0.1} />

      {/* Marching cards at bottom - right to left */}
      <MarchingCards direction="right" position="bottom" opacity={0.1} />

      <div className="relative z-10 p-4 md:p-8">
        {/* Header with back button */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} />
            Voltar ao Início
          </Link>
        </div>

        {/* Banner highlighting Lena Franzz */}
        <div className="max-w-7xl mx-auto mb-12">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="w-full max-w-6xl mx-auto bg-gradient-to-r from-purple-900 via-blue-900 to-purple-800 rounded-xl shadow-2xl p-6 md:p-8 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Artist Photo */}
                <div className="flex-shrink-0">
                  <Image
                    width={100}
                    height={100}
                    src="/images/NERDINHO_LENA.webp"
                    alt="Lena Franzz"
                    className="w-24 h-24 md:w-32 md:h-32 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                    Galeria de Ilustrações
                  </h1>
                  <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-2">
                    Lena Franzz
                  </h2>
                  <p className="text-sm md:text-base text-gray-300 mb-2">
                    Animadora, ilustradora, diretora de animação
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 max-w-2xl">
                    Gaúcha naturalizada carioca, sócia-fundadora do Studio
                    Chifrezz. Responsável por todas as ilustrações da Jornada do
                    Baralho, trazendo vida e personalidade única para cada
                    personagem e situação.
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center md:justify-start gap-4 md:gap-6">
                    <a
                      href="https://www.studiochifrezz.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors duration-200"
                    >
                      <SocialMediaIcon type="chifrezz" size={16} />
                      <span className="text-sm md:text-base">
                        Studio Chifrezz
                      </span>
                    </a>
                    <a
                      href="https://www.instagram.com/studiochifrezz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors duration-200"
                    >
                      <SocialMediaIcon type="insta" size={16} />
                      <span className="text-sm md:text-base">Instagram</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-5xl mx-auto">
          <div
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {illustrations.map((illustration, index) => (
              <div
                key={index}
                className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div
                  className="aspect-square overflow-hidden relative"
                  onClick={() => {
                    if (illustration.type === "video") {
                      handleVideoClick();
                    } else {
                      setSelectedImage(illustration.src);
                    }
                  }}
                >
                  {illustration.type === "video" ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <Image
                        src="/images/jovem-nerd-azaghal.webp"
                        alt="Video thumbnail"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play size={48} className="text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-bold text-sm drop-shadow-lg">
                          Vídeo de Abertura
                        </h4>
                        <p className="text-white/90 text-xs drop-shadow-lg">
                          Jornada do Baralho
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={illustration.src}
                      alt={illustration.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-bold text-white mb-1">
                    {illustration.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400">
                    {illustration.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <div className="text-gray-400 text-sm">
            <p>
              🎨 Todas as ilustrações são fruto do esforço humano da Lena Franzz
              e Studio Chifrezz, <br /> como homenagem a esse universo de
              conteúdo feito por pessoas incríveis ao longo dos últimos 20 anos.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for enlarged image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-auto animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div
              className="relative max-w-5xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Ilustração ampliada"
                width={1200}
                height={800}
                className="w-full h-auto object-contain rounded-xl shadow-2xl"
              />

              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white text-black w-10 h-10 rounded-full hover:bg-gray-200 transition-all duration-200 flex items-center justify-center shadow-lg font-bold text-lg"
              >
                ✕
              </button>

              {/* Image info overlay */}
              {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <div className="text-white text-center">
                  <p className="text-sm text-gray-300 mb-1">Ilustração por</p>
                  <p className="text-xl font-bold text-yellow-400">
                    Lena Franzz
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Studio Chifrezz</p>
                </div>
              </div> */}

              {/* Backdrop hint */}
              {/* <div className="absolute top-4 left-4 text-white/70 text-sm bg-black/30 px-3 py-1 rounded-full">
                Clique fora da imagem para fechar
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-auto animate-in fade-in duration-300"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="min-h-full flex items-center justify-center p-4 py-8">
            <div
              className="relative max-w-4xl w-full animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                controls
                autoPlay
                className="w-full h-auto rounded-xl shadow-2xl"
                poster="/images/jornada-do-baralho.png"
              >
                <source src="/videos/JNB_V008.mp4" type="audio/mpeg" />
                Seu navegador não suporta o elemento de vídeo.
              </video>

              {/* Close button */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-4 -right-4 bg-white text-black w-10 h-10 rounded-full hover:bg-gray-200 transition-all duration-200 flex items-center justify-center shadow-lg font-bold text-lg"
              >
                ✕
              </button>

              {/* Backdrop hint */}
              <div className="absolute top-4 left-4 text-white/70 text-sm bg-black/30 px-3 py-1 rounded-full">
                Clique fora do vídeo para fechar
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
