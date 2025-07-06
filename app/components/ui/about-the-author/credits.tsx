import { bebasNeue } from "@/app/fonts";
import Image from "next/image";

interface CreditPerson {
  name: string;
  description: string;
  imageSrc: string;
  socialMedia: {
    url: string;
    type:
      | "site"
      | "insta"
      | "twitter"
      | "facebook"
      | "podcast"
      | "youtube"
      | "jovemnerd"
      | "football"
      | "skull"
      | "mug"
      | "book"
      | "burger"
      | "bluesky"
      | "princess";
  }[];
}

const credits: CreditPerson[] = [
  {
    name: "Cesar Hoffmann",
    description: "This is the description for person 1.",
    imageSrc: "/images/NERDINHO_CESAR.png",
    socialMedia: [],
  },
  {
    name: "Lena Franzz",
    description: "This is the description for person 2.",
    imageSrc: "/images/NERDINHO_LENA.png",
    socialMedia: [],
  },
  {
    name: "Leo Brasil",
    description: "This is the description for person 3.",
    imageSrc: "/images/NERDINHO_LEO.png",
    socialMedia: [],
  },
];

export default function Credits() {
  return (
    <div className="space-y-6 px-4 md:px-12 py-10 flex flex-col w-full h-full items-center">
      {credits.map((person, index) => (
        <div
          key={person.name}
          className={`flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          <Image
            src={person.imageSrc}
            alt={person.name}
            width={150}
            height={150}
            className="rounded-xl object-cover w-full max-w-xs h-auto"
          />
          <div
            className={`${bebasNeue.className} flex flex-col w-fit flex-grow gap-2 mt-6 px-0 text-center md:text-left drop-shadow-md text-white`}
          >
            <div className="font-extrabold text-4xl">{person.name}</div>
            <div className="text-lg text-gray-700">{person.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
