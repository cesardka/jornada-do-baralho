import {
  FaBook,
  FaFacebook,
  FaFootballBall,
  FaHamburger,
  FaHandSpock,
  FaInstagram,
  FaMugHot,
  FaOctopusDeploy,
  FaPager,
  FaPodcast,
  FaSkull,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { PiButterflyFill } from "react-icons/pi";

export const SocialMediaIcon = ({
  type,
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
    | "princess";
}) => {
  switch (type) {
    case "site":
      return <FaPager />;
    case "insta":
      return <FaInstagram />;
    case "twitter":
      return <FaTwitter />;
    case "facebook":
      return <FaFacebook />;
    case "podcast":
      return <FaPodcast />;
    case "youtube":
      return <FaYoutube />;
    case "jovemnerd":
      return <FaHandSpock />;
    case "football":
      return <FaFootballBall />;
    case "skull":
      return <FaSkull />;
    case "mug":
      return <FaMugHot />;
    case "book":
      return <FaBook />;
    case "burger":
      return <FaHamburger />;
    case "bluesky":
      return <PiButterflyFill />;
    case "princess":
      return <FaOctopusDeploy />;
    default:
      return (
        <span className="inline-block w-5 h-5 bg-gray-200 rounded-full"></span>
      );
  }
};
