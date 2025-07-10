import {
  FaBook,
  FaFacebook,
  FaFootballBall,
  FaGithub,
  FaHamburger,
  FaHandSpock,
  FaInstagram,
  FaLinkedin,
  FaMugHot,
  FaOctopusDeploy,
  FaPager,
  FaPodcast,
  FaSkull,
  FaSpotify,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { PiButterflyFill } from "react-icons/pi";
import StudioChifrezz from "./studio_chifrezz.svg";
import { FaFootball } from "react-icons/fa6";

export const SocialMediaIcon = ({
  type,
  size = 20,
}: {
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
    | "princess"
    | "linkedin"
    | "chifrezz"
    | "spotify"
    | "football"
    | "github";
  size?: number;
}) => {
  switch (type) {
    case "site":
      return <FaPager size={size} />;
    case "insta":
      return <FaInstagram size={size} />;
    case "twitter":
      return <FaTwitter size={size} />;
    case "facebook":
      return <FaFacebook size={size} />;
    case "podcast":
      return <FaPodcast size={size} />;
    case "youtube":
      return <FaYoutube size={size} />;
    case "jovemnerd":
      return <FaHandSpock size={size} />;
    case "football":
      return <FaFootballBall size={size} />;
    case "skull":
      return <FaSkull size={size} />;
    case "mug":
      return <FaMugHot size={size} />;
    case "book":
      return <FaBook size={size} />;
    case "burger":
      return <FaHamburger size={size} />;
    case "bluesky":
      return <PiButterflyFill size={size} />;
    case "princess":
      return <FaOctopusDeploy size={size} />;
    case "linkedin":
      return <FaLinkedin size={size} />;
    case "chifrezz":
      return <StudioChifrezz className="w-8 h-8" />;
    case "spotify":
      return <FaSpotify size={size} />;
    case "football":
      return <FaFootball size={size} />;
    case "github":
      return <FaGithub size={size} />;
    default:
      return (
        <span
          className={`inline-block w-${size} h-${size} bg-gray-200 rounded-full`}
        />
      );
  }
};
