"use client";

import Image from "next/image";
import { NerdcastCard } from "../deck-list/card-data";
import CardSuit from "./cardSuit";
import CloseButton from "./closeButton";
import Link from "next/link";
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
  // If no card, nothing should be rendered
  if (card === null) return;

  const isAndroidCard = card.id === "card-13";

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

      {isAndroidCard && (
        <>
          {/* Android Illustration */}
          <div className="mt-8 flex items-center justify-center">
            <Image
              width={960}
              height={640}
              src="/images/illustrations/ilustra-harald_stricker.jpeg"
              alt="Harald Stricker Android Illustration"
              className="w-full max-w-2xl h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Nerdcast Episodes */}
          <h3 className="mt-6 text-2xl font-semibold text-gray-800">
            Episódios do Nerdcast
          </h3>
          {card.socialMedia && card.socialMedia.length > 0 ? (
            <div className="mt-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              <ul className="space-y-2">
                {card.socialMedia.map((episode, index) => (
                  <li key={index}>
                    {episode.link && (
                      <Link
                        href={episode.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-2 text-sm"
                      >
                        <SocialMediaIcon type={episode.type} />
                        {episode.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-gray-600">Nenhum episódio disponível</p>
          )}
        </>
      )}

      {/* Social media */}
      {!isAndroidCard && (
        <>
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
                src="/images/illustrations/ilustra-sem-redes.png"
                alt="Não encontramos as redes"
                className="w-full h-auto transition duration-300 ease-in-out group-hover:blur-md"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                <div
                  className={`${bebasNeue.className} text-white text-2xl font-semibold px-4 py-2 drop-shadow-[-3px_2px_2px_#330000] flex flex-col items-center`}
                >
                  <p className="text-4xl">Sem redes disponíveis</p>
                  <p className="text-xl">I want to believe</p>
                </div>
              </div>
            </div>
          )}

          {/* Card signed details */}
          <h3 className="mt-6 text-2xl font-semibold text-gray-800">
            Assinado em
          </h3>
          {card.signedOn !== null && (
            <div className="mt-2 text-gray-600">
              <span className="font-semibold">
                {card.signedOn.toLocaleDateString("pt-BR")}
              </span>{" "}
              em <span className="font-semibold">{card.signedLocation}</span>
            </div>
          )}

          {/* Photo of card being signed */}
          {/* Image of card signed */}
          {card.signedSrc ? (
            <>
              <div className="mt-4">
                <Image
                  src={card.signedSrc}
                  alt={`Carta assinada por ${card.name}`}
                  width={400}
                  height={600}
                  className="w-full rounded-md shadow-md"
                />
              </div>
              {/* Location of card signed */}
              {/* <div className="text-gray-600">
              <SignedLocationMap signedLocation={card.signedLocation} />
            </div> */}
            </>
          ) : (
            <div className="mt-4 relative group w-full max-w-xl mx-auto">
              <Image
                width={960}
                height={540}
                src="/images/illustrations/ilustra-sem-assinatura.png"
                alt="Carta pendente assinatura"
                className="w-full h-auto transition duration-300 ease-in-out group-hover:blur-md"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                <div
                  className={`${bebasNeue.className} text-white font-semibold px-4 py-2 drop-shadow-[-3px_2px_2px_#330000] flex flex-col items-center`}
                >
                  <p className="text-4xl">Assinatura pendente</p>
                  <p className="text-xl">Que fim levou...?</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default CardDetails;
