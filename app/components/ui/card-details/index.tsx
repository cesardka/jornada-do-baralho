"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

import { NerdcastCard } from "../deck-list/consts";
import CardSuit from "./cardSuit";
import CloseButton from "./closeButton";

const CardDetails = ({
  card,
  isMobile,
  closeModal,
}: {
  card: NerdcastCard | null;
  isMobile: boolean;
  closeModal: () => void;
}) => {
  // If no card, nothing should be rendered
  if (card === null) return;

  const SignedLocationMap = useMemo(
    () =>
      dynamic(() => import("@/app/components/ui/card-details/signedLocation"), {
        ssr: false,
      }),
    []
  );

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
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
        {card.name}
        <CardSuit suit={card.suit} value={card.value} />
      </h2>

      <h4 className="text-lg text-gray-700 font-medium">{card.nickname}</h4>

      {/* Brief famous quote, and episode number */}
      <p className="mt-4 text-gray-600 italic">
        <q className="text-4xl text-gray-500">{card.quote.message}</q>
        <a
          href={card.quote.link}
          className="text-blue-500 underline ml-2 hover:text-blue-700"
        >
          {card.quote.episode}
        </a>
      </p>

      {/* Social media */}
      <h3 className="mt-6 text-2xl font-semibold text-gray-800">
        Redes Sociais
      </h3>
      {card.socialMedia && card.socialMedia.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {card.socialMedia.map((social, index) => (
            <li key={index}>
              <a
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
              >
                {/* Placeholder for icon */}
                <span className="inline-block w-5 h-5 bg-gray-200 rounded-full"></span>
                {social.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-2">
          <p className="text-center text-gray-400">... 🛸 ...</p>
          <p className="text-center text-gray-400">... 🐄 ...</p>
        </div>
      )}

      {/* Card signed details */}
      <h3 className="mt-6 text-2xl font-semibold text-gray-800">Assinado em</h3>
      <p className="mt-2 text-gray-600">
        {card.signedOn !== null
          ? card.signedOn.toLocaleDateString()
          : "?? / ?? / ????"}
      </p>

      {/* Photo of card being signed */}

      {/* Location of card signed */}
      <p className="text-gray-600">
        <SignedLocationMap signedLocation={card.signedLocation} />
      </p>

      {/* Image of card signed */}
      {card.signedSrc && (
        <div className="mt-4">
          <img
            src={card.signedSrc}
            alt={`Card signed by ${card.name}`}
            className="w-full rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default CardDetails;
