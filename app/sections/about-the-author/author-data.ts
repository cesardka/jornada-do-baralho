import { CreditPerson } from "./types";

export const PROJECT_AUTHORS: CreditPerson[] = [
  {
    id: "lena",
    name: "Lena Franzz",
    title: "Animadora, ilustradora, diretora de animação e atriz de voz",
    description:
      "Gaúcha naturalizada carioca desde 2013, acompanha o Nerdcast de muitos anos, já enviou artes dos fãs, fez tour gastronômico do Eskimó ao Majórica para deixar o Senhor K. com orgulho. Atualmente é sócia-fundadora do Studio Chifrezz, onde já animou projetos premiados internacionalmente e está trabalhando em mais obras para serem lançadas futuramente!",
    imageSrc: "/images/NERDINHO_LENA.webp",
    alternateImageSrc: "/images/credits/lena-franzz-alternate.webp",
    circularPortrait: false,
    socialMedia: [
      {
        link: "https://www.studiochifrezz.com/",
        type: "chifrezz",
      },
      {
        link: "https://www.instagram.com/studiochifrezz",
        type: "insta",
      },
      {
        link: "https://www.linkedin.com/in/lenafranzz/",
        type: "linkedin",
      },
    ],
  },
  {
    id: "cesar",
    name: "César Hoffmann",
    title:
      "Desenvolvedor, CEO, COO, CFO e CTO da Jornada do Baralho. O faz tudo.",
    description:
      'Morador de Porto Alegre - RS, é ouvinte do Nerdcast desde 2007, quando conheceu na casa de um amigo o episódio 70 - "Harry Potter: 70 mas não agüenta!" e desde então não viveu mais sem o programa no ouvido. Tomou como objetivo de vida não deixar o Nerdcast acabar sem alguém concluir esse desafio que perdura há mais de década.',
    imageSrc: "/images/NERDINHO_CESAR.webp",
    circularPortrait: false,
    socialMedia: [
      {
        link: "https://github.com/cesardka",
        type: "github",
      },
      {
        link: "https://www.instagram.com/cesardka/",
        type: "insta",
      },
      {
        link: "https://www.linkedin.com/in/c%C3%A9sar-hoffmann/",
        type: "linkedin",
      },
    ],
  },
  {
    id: "leo",
    name: "Leo Brasil",
    title: "Compositor de trilhas, Sound Designer e Roteirista",
    description:
      "É o nosso mineirin musicista favorito que deu sonoridade à Jornada do Baralho, da música aos pequenos efeitos sonoros escondidos pelo site. Não tem nada contra o Nerdcast, mas acho que nunca foi ouvinte também hahaha",
    imageSrc: "/images/NERDINHO_LEO.webp",
    circularPortrait: false,
    socialMedia: [
      {
        link: "https://open.spotify.com/artist/3H3zNDzX52sPpG6fxisgf1?si=9_rjqp7nTv67SFcGREK-Gw&nd=1&dlsi=87726bb642b34ca6",
        type: "spotify",
      },
      {
        link: "https://www.instagram.com/leo.brasil/",
        type: "insta",
      },
    ],
  },
  {
    id: "kabuki",
    name: "Kabuki Sonic",
    title: "Compositor de trilha e sound designer",
    description: "",
    imageSrc: "/images/credits/kabuki-sonic.webp",
    alternateImageSrc: "/images/credits/kabuki-sonic-alternate.webp",
    alternatePortraitBackground: "#efe69f",
    socialMedia: [],
  },
  {
    id: "luah",
    name: "Luah Garcia",
    title: "Produção e rigging 2D",
    description: "",
    imageSrc: "/images/credits/luah-garcia.webp",
    portraitBackground: "#efe69f",
    portraitScale: 1.14,
    socialMedia: [],
  },
  {
    id: "dani",
    name: "Dani Smith-Fischer",
    title: "Storyboard e animatic",
    description: "",
    imageSrc: "/images/credits/dani-smith-fischer.webp",
    socialMedia: [],
  },
  {
    id: "andres",
    name: "Andres Ramos",
    title: "Diretor de arte e ilustrador de cenários",
    description: "",
    imageSrc: "/images/credits/andres-ramos.webp",
    portraitBackground: "#efe69f",
    portraitScale: 1.16,
    portraitOffsetY: 4,
    socialMedia: [],
  },
  {
    id: "pedro",
    name: "Pedro Azevedo",
    title: "Locução e voz original",
    description: "",
    imageSrc: "/images/credits/pedro-azevedo.webp",
    socialMedia: [
      {
        link: "https://www.instagram.com/pedroazevedodub/",
        type: "insta",
      },
    ],
  },
];
