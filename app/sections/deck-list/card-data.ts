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
    nickname: "Alê, Alex André, Feijão, Agian, Thomas Faraday",
    quote: {
      message: "Lambda lambda lambda, nerds! 🖖",
      episode: "em praticamente todos os Nerdcasts",
      link: "https://jovemnerd.com.br/busca?type=podcast&category_podcast_product_slug=nerdcast&order_by=date&order_by_direction=ASC",
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
        name: "Jovem Nerd",
        type: "youtube",
        link: "https://www.youtube.com/@JovemNerd",
      },
      {
        name: "@jovemnerd",
        type: "insta",
        link: "https://www.instagram.com/jovemnerd/",
      },
      {
        name: "@jovemnerd",
        type: "twitter",
        link: "https://twitter.com/jovemnerd",
      },
      {
        name: "@jovemnerd",
        type: "facebook",
        link: "https://www.facebook.com/jovemnerd",
      },
    ],
  },
  {
    id: "card-02",
    name: "Azaghal",
    nickname: "Rei da Oceania, Máquina de Combate, Ruprest, Ozob, Don Azaghal",
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
        name: "Jovem Nerd",
        type: "youtube",
        link: "https://www.youtube.com/@JovemNerd",
      },
      {
        name: "@azaghal",
        type: "insta",
        link: "https://www.instagram.com/azaghal/",
      },
      {
        name: "@azaghal",
        type: "twitter",
        link: "https://twitter.com/azaghal",
      },
    ],
  },
  {
    id: "card-03",
    name: "JP",
    nickname: "João Paulo Miguel, Nilperto, Dr. Angus Silvana",
    quote: {
      message:
        "Só tem duas coisas que eu tenho medo, barata voadora e mulher maluca",
      episode: "NC 61 - Bikini Girls with Machine Guns",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-61-bikini-girls-with-machine-guns",
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
        name: "@JP_miguel",
        type: "twitter",
        link: "https://twitter.com/JP_miguel",
      },
    ],
  },
  {
    id: "card-04",
    name: "Sr. K",
    nickname: "Fred, Carstens, Frederico, Shimira Aisu, Von Basf",
    quote: {
      message:
        "Duzentos mil reais por mês eu acho que eu consigo viver com tranquilidade",
      episode: "NC 370 - E se... ganhássemos na loteria?",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-370-e-se-ganhassemos-na-loteria",
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
        name: "@carstens",
        type: "insta",
        link: "https://www.instagram.com/carstens/",
      },
      {
        name: "@sr_k_",
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
      episode: "NC 281 - Superstições, mandingas e farofa",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-281-supersticoes-mandingas-e-farofa",
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
        name: "@agathaottoni",
        type: "insta",
        link: "https://www.instagram.com/agathaottoni/",
      },
      {
        name: "@SraJovemNerd_NC",
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
      episode: "NC 494 - Desista da Dieta",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-494-desista-da-dieta",
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
        name: "@deiaduboc",
        type: "insta",
        link: "https://www.instagram.com/deiaduboc/",
      },
      {
        name: "@Portuguesa_NC",
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
      message:
        "Não basta você dar o endereço da amiga da sua amiga... Você tem que dar o telefone da sua amiga para receber as suas encomendas da China!",
      episode: "NC 625 - Permanentemente desgraçado da minha cabeça!",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/permanentemente-desgracado-da-minha-cabeca",
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
      message:
        "Se matar barata é R$5, botar remédio no cachorro devia ser R$100...!",
      episode: "NC 206 - Vou chamar o síndico!",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-206-vou-chamar-o-sindico",
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
    nickname: "Caio",
    quote: {
      message: "Serão os bicho preguiça alienígenas?",
      episode: "NC 181 - Nerdcast para Não-Humanos",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-181-nerdcast-para-nao-humanos",
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
    nickname: "Ártimus, #dudunojô",
    quote: {
      message: "Puta que pariu... Puta que pariiiu! Puta que pariu. ",
      episode:
        "NC 341 - RPG Ghanor 1: O Bruxo, a Princesa e o Dragão (pós-créditos)",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-251-rpg-o-bruxo-a-princesa-e-o-dragao",
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
        name: "@eduardospohr",
        type: "twitter",
        link: "https://twitter.com/eduardospohr",
      },
      {
        name: "@duduspohr",
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
      message:
        'Isso porque você não usa o mantra, né, que é infalível, que é: "Jesus, mamãe. Jesus, mamãe. Jesus, mamãe..."',
      episode: "NC 254 - Isso é uma vergonha!",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-254-isso-e-uma-vergonha",
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
        name: "@gugassaur",
        type: "insta",
        link: "https://www.instagram.com/gugassaur/",
      },
      {
        name: "Força Psi",
        type: "youtube",
        link: "https://www.youtube.com/@forcapsi",
      },
    ],
  },
  {
    id: "card-12",
    name: "Tucano",
    nickname:
      "Fernando Russel, Cancer Jack, O Homem de Mãos Lindas, Feldon, Oleg Korolenko, Jimmy O'Flannagan",
    quote: {
      message: "Eu sou motoqueiro porra!",
      episode: "NC 241 - Isso é uma furada!",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-241-isso-e-uma-furada",
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
        name: "@cancerjack",
        type: "insta",
        link: "https://www.instagram.com/cancerjack/",
      },
      {
        name: "@cancerjack",
        type: "twitter",
        link: "https://twitter.com/cancerjack",
      },
    ],
  },
  {
    id: "card-13",
    name: "Android",
    nickname: "Harald Stricker, NDR",
    quote: {
      message:
        "E O SENHOR DOS ANÉIS É UMA MEEEERRRRRDAAA! EU NÃO AGUENTO MAIS ESSE HOMEM FALANDO MAL DA FICÇÃO CIENTÍICA!",
      episode: "NC 298 - A gênese e os gênios da ficção científica",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-298-a-genese-e-os-genios-da-ficcao-cientifica",
    },
    suit: "♣",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-android.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "Nerdcast 594 - Blade Runner 2049: menos noir e mais futurista",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/blade-runner-2049-menos-noir-e-mais-futurista",
      },
      {
        name: "Nerdcast 590 - Rick and Morty: Não pense nisso!",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/rick-and-morty-nao-pense-nisso",
      },
      {
        name: "NerdCast 505 - Doctor… Who?",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-505-doctor-who",
      },
      {
        name: "NerdCast 498 - RPG Cyberpunk 3: Estrada para o inferno",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-498-rpg-cyberpunk-3-estrada-para-o-inferno",
      },
      {
        name: "NerdCast 482 - As dimensões de Interestelar",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-482-as-dimensoes-de-interestelar",
      },
      {
        name: "NerdCast 463 - Vingadores: A carência de Ultron",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-463-vingadores-a-carencia-de-ultron",
      },
      {
        name: "NerdCast 446 - RPG Cyberpunk 2: O Passageiro do Futuro",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-446-rpg-cyberpunk-2-o-passageiro-do-futuro",
      },
      {
        name: "NerdCast 439 - Marvel & DC 2020",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-439-marvel-dc-2020",
      },
      {
        name: "NerdCast 423 - Os sonhos perpétuos de Sandman",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-423-os-sonhos-perpetuos-de-sandman",
      },
      {
        name: "NerdCast 395 - RPG Cyberpunk 1: O grande assalto",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-395-rpg-cyberpunk-1-o-grande-assalto",
      },
      {
        name: "NerdCast 386 - A ciência e as metáforas de Gravidade",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-386-a-ciencia-e-as-metaforas-de-gravidade",
      },
      {
        name: "NerdCast 360 - A utopia dos futuros distópicos",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-360-a-utopia-dos-futuros-distopicos",
      },
      {
        name: "NerdCast 327 - Making of Independência ou Mortos",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-327-making-of-independencia-ou-mortos",
      },
      {
        name: "NerdCast 311 - Decifrando Donnie Darko (ou não)",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-311-decifrando-donnie-darko-ou-nao",
      },
      {
        name: "NerdCast 298 - A gênese e os gênios da ficção científica",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-298-a-genese-e-os-genios-da-ficcao-cientifica",
      },
      {
        name: "NerdCast 294 - Mas que final horrível!",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-294-mas-que-final-horrivel",
      },
      {
        name: "NerdCast 287 - Grandes inventores: Santos Dumont vs Irmãos Wright",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-287-grandes-inventores-santos-dumont-vs-irmaos-wright",
      },
      {
        name: "NerdCast 269 - Star Trek: A velha nova geração",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-269-star-trek-a-velha-nova-geracao",
      },
      {
        name: "NerdCast 261 - RPG: Uma arte de interpretação (ou não)",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-261-rpg-uma-arte-de-interpretacao-ou-nao",
      },
      {
        name: "NerdCast 239 - Tron: A realidade virtual e tudo mais",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-239-tron-a-realidade-virtual-e-tudo-mais",
      },
      {
        name: "NerdCast 235B - Battlestar Galactica: Deus ex machina",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-235b-battlestar-galactica-deus-ex-machina",
      },
      {
        name: "NerdCast 235A - Battlestar Galactica: Inteligência artificial emocional",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-235a-battlestar-galactica-inteligencia-artificial-emocional",
      },
      {
        name: "NerdCast 224 - A Origem: Me belisca que eu tô acordado",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-224-a-origem-me-belisca-que-eu-to-acordado",
      },
      {
        name: "NerdCast 219 - Lost: Desabafo",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-219-lost-desabafo",
      },
      {
        name: "NerdCast 186 - Isaac Asimov e seus escravos tchecos",
        type: "jovemnerd",
        link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-186-isaac-asimov-e-seus-escravos-tchecos",
      },
    ],
  },
  {
    id: "card-14",
    name: "Guilherme Briggs",
    nickname:
      "Teatro de Bonecos, Grinch, Super-Homem, Buzz Lightyear, Freakazoid...",
    quote: {
      message: "É melhor uma ervilha no chão do que uma berinjela na luminária",
      episode: "NC 265 - Era uma vez um Nerdcast... 2",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-265-era-uma-vez-um-nerdcast-2",
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
        name: "@GuilhermeBriggs",
        type: "youtube",
        link: "https://www.youtube.com/@GuilhermeBriggs/",
      },
      {
        name: "@guilhermebriggs",
        type: "insta",
        link: "https://www.instagram.com/guilhermebriggs/",
      },
    ],
  },
  {
    id: "card-15",
    name: "Carlos Voltor",
    nickname: "Caquinho, Royston Cave, Steven T. Durden, Stephen Venkman",
    quote: {
      message: "Tá todo mundo rindo, mas será que é pelo mesmo motivo?",
      episode: "NC 293 - Tintim, o macaco e o herege",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-293-tintim-o-macaco-e-o-herege",
    },
    suit: "♦",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-carlosvoltor.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "@carlosvoltor",
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
      message:
        "O Asimov escreveu várias histórias de detetive com fundo da ficção científica. - Hoje em dia essas histórias tão aí na televisão e chamam CSI.",
      episode: "NC 186 - Isaac Asimov e seus escravos tchecos.",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-186-isaac-asimov-e-seus-escravos-tchecos",
    },
    suit: "♠",
    value: "A",
    originalSrc: "/images/card/nerdcast-a-nickellis.webp",
    signedOn: null,
    signedLocation: null,
    signedSrc: null,
    socialMedia: [
      {
        name: "@nickellis",
        type: "insta",
        link: "https://www.instagram.com/nickellis/",
      },
      {
        name: "nickellis.bsky.social",
        type: "bluesky",
        link: "https://bsky.app/profile/did:plc:tt5gfdyj3ucwmv3u4gpy5vd3",
      },
      {
        name: "@NickEllis",
        type: "twitter",
        link: "https://twitter.com/NickEllis",
      },
    ],
  },
  {
    id: "card-17",
    name: "Fabio Yabu",
    nickname: "Abu Fobiya",
    quote: {
      message:
        "Heroes? Ah, eu adoro! Minha série favorita. (...) Eu não assisto na TV não, assisto na Internet! -- Yabu em 2007 enquanto falava com executiva da NBC",
      episode: "NC 105 - Fabio Yabu: O homem que matou o jovem nerd",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-105-fabio-yabu-o-homem-que-matou-o-jovem-nerd",
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
        name: "@fabioyabu",
        type: "insta",
        link: "https://www.instagram.com/fabioyabu/",
      },
      {
        name: "@fabioyabu",
        type: "twitter",
        link: "https://twitter.com/fabioyabu",
      },
    ],
  },
  {
    id: "card-18",
    name: "Tresdê",
    nickname: "Edsert, Ulib, Cigano Igor",
    quote: {
      message: "Information Society era o Locomia dos americanos",
      episode: "NC 275 - Era uma vez num Rock in Rio...",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-275-era-uma-vez-num-rock-in-rio",
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
        name: "@afonso3d",
        type: "insta",
        link: "https://www.instagram.com/afonso3d/",
      },
      {
        name: "@afonso3d",
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
      message:
        "Olha só, amigo, 1, 2 ou 3 legiões de demônio dá pra gente dar conta. Agora 3000, parceiro...",
      episode: "NC 197 - O sobrenatural ecziste! Ou não",
      link: "https://jovemnerd.com.br/podcasts/nerdcast/nerdcast-197-o-sobrenatural-ecziste-ou-nao",
    },
    suit: "",
    value: "Bônus",
    originalSrc: "/images/card/nerdcast-amigoimaginario.webp",
    signedOn: new Date("2025-07-29"),
    signedLocation: "Rio de Janeiro, RJ",
    signedSrc: "/images/signed-card/photo_2025-08-19 21.43.57.jpeg",
    socialMedia: [
      {
        name: "@renderia",
        type: "insta",
        link: "https://www.instagram.com/renderia/",
      },
      {
        name: "@renderia",
        type: "twitter",
        link: "https://twitter.com/renderia",
      },
    ],
  },
];
