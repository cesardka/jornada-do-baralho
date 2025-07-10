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
    socialMedia: [
      {
        name: 'Site "Jovem Nerd"',
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/jovemnerd/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/jovemnerd",
      },
      {
        name: "Facebook",
        type: "facebook",
        link: "https://www.facebook.com/jovemnerd",
      },
    ],
  },
  {
    id: "card-02",
    name: "Azaghal",
    nickname: "Rei da Oceania, Máquina de Combate",
    quote: {
      message: "Essa é a grande realidade de hoje em dia",
      episode: "NC 459 - Sem Licença Para Dirigir",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-459-sem-licenca-para-dirigir",
    },
    suit: "♥",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-azaghal.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: 'Site "Jovem Nerd"',
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/azaghal/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/azaghal",
      },
    ],
  },
  {
    id: "card-03",
    name: "JP",
    nickname: "",
    quote: {
      message:
        "Só tem duas coisas que eu tenho medo, barata voadora e mulher maluca",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-459-sem-licenca-para-dirigir",
      episode: "",
    },
    suit: "♣",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-jp.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "Agência de Viagem 'Glad Vip Travel'",
        type: "insta",
        link: "https://www.instagram.com/gladviptravel/",
      },
      {
        name: 'Site "10 Jardas"',
        type: "football",
        link: "https://10jardas.com/",
      },
      {
        name: 'Podcast "PodNext"',
        type: "podcast",
        link: "https://www.instagram.com/podnext/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/JP_miguel",
      },
    ],
  },
  {
    id: "card-04",
    name: "Sr. K",
    nickname: "Fred, Carstens, Frederico",
    quote: {
      message: "Eu não sou rico... Sou irresponsável",
    },
    suit: "♦",
    value: "K",
    originalSrc: "/images/card/nerdcast-k-srk.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: 'Joalheria Virtual "FCarstens Jewelry"',
        type: "skull",
        link: "https://www.fcarstens.com.br/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/carstens/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/sr_k_",
      },
    ],
  },
  {
    id: "card-05",
    name: "Sra. Jovem Nerd",
    nickname: "Agatha Ottoni, Sra. Meu Amor",
    quote: {
      message: "Não pensa no diabo que ele aparece!",
    },
    suit: "♠",
    value: "Q",
    originalSrc: "/images/card/nerdcast-q-srajovemnerd.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: 'Podcast "Caneca de Mamicas"',
        type: "mug",
        link: "https://jovemnerd.com.br/podcasts/caneca-de-mamicas",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/agathaottoni/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/SraJovemNerd_NC",
      },
    ],
  },
  {
    id: "card-06",
    name: "Portuguesa",
    nickname: "Andréia Duboc",
    quote: {
      message: "Eu quero comer um doce do tamanho da minha cara!",
    },
    suit: "♠",
    value: "Q",
    originalSrc: "/images/card/nerdcast-q-portuguesa.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: 'Podcast "Caneca de Mamicas"',
        type: "mug",
        link: "https://jovemnerd.com.br/podcasts/caneca-de-mamicas",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/deiaduboc/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/Portuguesa_NC",
      },
    ],
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
    socialMedia: [
      {
        name: "Agência de Viagem 'Glad Vip Travel'",
        type: "insta",
        link: "https://www.instagram.com/gladviptravel/",
      },
    ],
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
    socialMedia: [
      {
        name: 'Site "Eduardo Spohr"',
        type: "book",
        link: "https://www.eduardospohr.com.br/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/eduardospohr",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/duduspohr/",
      },
    ],
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
    socialMedia: [
      {
        name: 'Podcast "Papo Furado"',
        type: "podcast",
        link: "https://papofuradopodcast.wordpress.com/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/gugassaur/",
      },
      {
        name: "Youtube",
        type: "youtube",
        link: "https://www.youtube.com/@forcapsi",
      },
    ],
  },
  {
    id: "card-12",
    name: "Tucano",
    nickname: "Fernando Russel, Cancer Jack, O Homem de Mãos Lindas",
    quote: {
      message: "Eu sou motoqueiro porra!",
    },
    suit: "♥",
    value: "J",
    originalSrc: "/images/card/nerdcast-j-tucano.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "Hamburgueria 'Seven Kings Burger'",
        type: "burger",
        link: "https://www.instagram.com/sevenkingsburger/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/cancerjack/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/cancerjack",
      },
    ],
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
    nickname:
      "Teatro de Bonecos, Grinch, Super-Homem, Buzz Lightyear, Freakazoid...",
    quote: {
      message: "",
    },
    suit: "♥",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-briggs.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "Dublapédia",
        type: "book",
        link: "https://dublagem.fandom.com/wiki/Guilherme_Briggs/",
      },
      {
        name: "Youtube",
        type: "youtube",
        link: "https://www.youtube.com/@GuilhermeBriggs/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/guilhermebriggs/",
      },
    ],
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
    socialMedia: [
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/carlosvoltor/",
      },
      {
        name: "Voltorama Cortes",
        type: "youtube",
        link: "https://www.youtube.com/voltorama",
      },
      {
        name: 'Podcast "Wrong Squadron"',
        type: "podcast",
        link: "https://tr.ee/nqf1-QlH6l",
      },
      {
        name: 'Podcast "Clube dos Cannolis"',
        type: "podcast",
        link: "https://creators.spotify.com/pod/show/clubedoscannolis",
      },
    ],
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
    socialMedia: [
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/nickellis/",
      },
      {
        name: "BlueSky",
        type: "bluesky",
        link: "https://bsky.app/profile/did:plc:tt5gfdyj3ucwmv3u4gpy5vd3",
      },
    ],
  },
  {
    id: "card-17",
    name: "Fabio Yabu",
    nickname: "Abu Fobiya",
    quote: {
      message: "",
    },
    suit: "",
    value: "Joker",
    originalSrc: "/images/card/nerdcast-joker-fabioyabu.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: 'Site "Princesas do Mar"',
        type: "princess",
        link: "https://princesasdomar.com.br/",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/fabioyabu/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/fabioyabu",
      },
    ],
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
    socialMedia: [
      {
        name: "Bunker X",
        type: "youtube",
        link: "https://www.youtube.com/@bunkerx",
      },
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/afonso3d/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/afonso3d",
      },
    ],
  },
  {
    id: "card-19",
    name: "Amigo Imaginário",
    nickname: "Andrés Ramos",
    quote: {
      message: "",
    },
    suit: "",
    value: "Bônus",
    originalSrc: "/images/card/nerdcast-amigoimaginario.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "Instagram",
        type: "insta",
        link: "https://www.instagram.com/renderia/",
      },
      {
        name: "Twitter",
        type: "twitter",
        link: "https://twitter.com/renderia",
      },
    ],
  },
];
