"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import { NerdcastCard } from "../deck-list/card-data";
import CardSuit from "./cardSuit";
import CloseButton from "./closeButton";
import Link from "next/link";
import Image from "next/image";
import { SocialMediaIcon } from "./socialMediaIcon";
import { bebasNeue } from "@/app/fonts";

const CardDetails = ({
  card,
  isMobile,
  closeModal,
}: {
  card: NerdcastCard | null;
  isMobile: boolean;
  closeModal: () => void;
}) => {
  const SignedLocationMap = useMemo(
    () =>
      dynamic(() => import("@/app/sections/card-details/signedLocation"), {
        ssr: false,
      }),
    []
  );

  // If no card, nothing should be rendered
  if (card === null) return;

  //  If card exists,
  //    If isMobile is true, render the card details popping from the bottom
  //    If isMobile is false, render the card details popping from the right
  //
  // Data to be displayed:
  //    Person name / alias
  //    Card suit and value
  //    Brief famous quote, and episode number (link?)
  //    Social media (Instagram, Twitter, Facebook, TikTok...)
  //    Date of card signed (dd/mm/yyyy)
  //    Image of card signed
  //    Location of card signed (on a map)
  return (
    <div
      className={`bg-white ${
        isMobile ? "w-full fixed bottom overflow-scroll" : ""
      } h-full z-50 p-6 md:p-16 shadow-lg overflow-auto`}
    >
      {/* Close button */}
      <CloseButton onClick={closeModal} size={10} />

      {/* Person name / alias */}
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-4">
        {card.name}
        <CardSuit suit={card.suit} value={card.value} />
      </h2>

      <h4 className="text-sm mt-1 text-gray-700">{card.nickname}</h4>

      {/* Brief famous quote, and episode number */}
      <p className="mt-4 text-gray-600 italic">
        <q className="text-xl text-gray-500">{card.quote.message}</q>
        {card.quote.link && (
          <Link
            href={card.quote.link}
            target="_blank"
            className="text-blue-500 text-sm underline ml-2 hover:text-blue-700"
          >
            {card.quote.episode}
          </Link>
        )}
      </p>

      {/* Social media */}
      <h3 className="mt-6 text-2xl font-semibold text-gray-800">
        Redes Sociais
      </h3>
      {card.socialMedia && card.socialMedia.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {card.socialMedia.map((social, index) => (
            <li key={index}>
              {social.link && (
                <Link
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                >
                  {/* Placeholder for icon */}
                  <SocialMediaIcon type={social.type} />
                  {social.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 relative group w-full max-w-xl mx-auto">
          <Image
            width={960}
            height={540}
            src="/images/ilustra-sem-redes.png"
            alt="Não encontramos as redes"
            className="w-full h-auto transition duration-300 ease-in-out group-hover:blur-md"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
            <div
              className={`${bebasNeue.className} text-white text-2xl font-semibold uppercase px-4 py-2 drop-shadow-[-3px_2px_2px_#330000] flex flex-col items-center`}
            >
              <p className="text-2xl">Sem redes disponíveis</p>
              <p className="text-lg">I want to believe</p>
            </div>
          </div>
        </div>
      )}

      {/* Card signed details */}
      <h3 className="mt-6 text-2xl font-semibold text-gray-800">Assinado em</h3>
      {card.signedOn !== null && (
        <div className="mt-2 text-gray-600">
          card.signedOn.toLocaleDateString()
        </div>
      )}

      {/* Photo of card being signed */}
      {/* Image of card signed */}
      {card.signedSrc ? (
        <>
          <div className="mt-4">
            <img
              src={card.signedSrc}
              alt={`Carta assinada por ${card.name}`}
              className="w-full rounded-md shadow-md"
            />
          </div>
          {/* Location of card signed */}
          <div className="text-gray-600">
            <SignedLocationMap signedLocation={card.signedLocation} />
          </div>
        </>
      ) : (
        <div className="mt-4 relative group w-full max-w-xl mx-auto">
          <Image
            width={960}
            height={540}
            src="/images/ilustra-sem-assinatura.png"
            alt="Carta pendente assinatura"
            className="w-full h-auto transition duration-300 ease-in-out group-hover:blur-md"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
            <div
              className={`${bebasNeue.className} text-white font-semibold uppercase px-4 py-2 drop-shadow-[-3px_2px_2px_#330000] flex flex-col items-center`}
            >
              <p className="text-2xl">Assinatura pendente</p>
              <p className="text-lg">Que fim levou...?</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetails;
