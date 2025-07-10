export interface CreditPerson {
  name: string;
  title: string;
  description: string;
  imageSrc: string;
  socialMedia: {
    link: string;
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
      | "github";
  }[];
  customSize?: number;
}
