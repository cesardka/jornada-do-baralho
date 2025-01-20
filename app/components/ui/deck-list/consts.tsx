export type NerdcastCard = {
  id: string;
  name: string;
  nickname: string;
  quote: {
    message: string;
    episode?: string;
    link?: string;
  };
  suit: "♠" | "♣" | "♥" | "♦" | "";
  value: "K" | "Q" | "J" | "A" | "Joker" | "Bônus";
  originalSrc: string;
  signedOn: Date | null;
  signedLocation: string | null;
  signedSrc: string | null;
  socialMedia?: {
    name: string;
    link?: string;
  }[];
};

export const DECK_LIST: NerdcastCard[] = [
  {
    id: "card-01",
    name: "Alottoni",
    nickname: "Alê, Alex André, Feijão",
    quote: {
      message: "Lambda lambda lambda, nerds! 🖖",
    },
    suit: "♠",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-alottoni.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-02",
    name: "Azaghal",
    nickname: "Rei da Oceania, Máquina de Combate",
    quote: {
      message: "",
    },
    suit: "♥",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-azaghal.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-03",
    name: "JP",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♣",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-jp.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-04",
    name: "Sr. K",
    nickname: "Fred, Carstens, Frederico",
    quote: {
      message: "Milhões!!!!",
    },
    suit: "♦",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-srk.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-05",
    name: "Sra. Jovem Nerd",
    nickname: "Agatha, Sra. Meu Amor",
    quote: {
      message: "",
    },
    suit: "♠",
    value: "Q",
    originalSrc: "/images/card/nerdcast-q-srajovemnerd.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-06",
    name: "Portuguesa",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♠",
    value: "Q",
    originalSrc: "/images/card/nerdcast-q-portuguesa.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-07",
    name: "Francine",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♣",
    value: "Q",
    originalSrc: "/images/card/nerdcast-q-francine.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-08",
    name: "Ruiva",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♦",
    value: "Q",
    originalSrc: "/images/card/nerdcast-q-ruiva.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-09",
    name: "Blue Hand",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♠",
    value: "J",
    originalSrc: "/images/card/nerdcast-j-bluehand.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-10",
    name: "Eduardo Spohr",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♦",
    value: "J",
    originalSrc: "/images/card/nerdcast-j-eduardospohr.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-11",
    name: "Guga Ferrari",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♣",
    value: "J",
    originalSrc: "/images/card/nerdcast-j-gugaferrari.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-12",
    name: "Tucano",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♥",
    value: "J",
    originalSrc: "/images/card/nerdcast-j-tucano.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-13",
    name: "Android",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♣",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-android.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-14",
    name: "Guilherme Briggs",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♥",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-briggs.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-15",
    name: "Carlos Voltor",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♦",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-carlosvoltor.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-16",
    name: "Nick Ellis",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "♠",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-nickellis.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-17",
    name: "Fabio Yabu",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "",
    value: "Joker",
    originalSrc: "/images/card/nerdcast-joker-fabioyabu.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-18",
    name: "Tresdê",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "",
    value: "Joker",
    originalSrc: "/images/card/nerdcast-joker-tresde.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
  {
    id: "card-19",
    name: "Amigo Imaginário",
    nickname: "",
    quote: {
      message: "",
    },
    suit: "",
    value: "Bônus",
    originalSrc: "/images/card/nerdcast-amigoimaginario.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
  },
];
