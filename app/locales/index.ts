export type SupportedLocale = "pt" | "en";
export type NestedMessages = { [key: string]: string | NestedMessages };

export const messages: Record<SupportedLocale, NestedMessages> = {
  pt: {
    common: {
      loading: "Carregando...",
    },
    nav: {
      reset_splash: "Assistir a abertura de novo",
      gallery: "Galeria",
      gallery_tooltip: "Ver galeria de ilustrações da Lena Franzz",
      lang_pt: "PT 🇧🇷",
      lang_en: "EN 🇺🇸",
      lang_label: "Idioma",
    },
    aboutJourney: {
      titleWhoAmI: "Quem sou eu",
      titleDeck: "O Baralho",
      myJourney: "Minha Jornada",
      listenChallenge: "Ouça o desafio",
      pauseAudio: "Pausar áudio",
      imgBgAlt: "Imagem da Jornada (fundo)",
      imgTopAlt: "Imagem da Jornada (topo com animação)",
      p1_begin: "Esta é uma iniciativa minha, ",
      p1_afterName:
        ", para documentar e completar o Desafio do Baralho para conseguir o iPad que há ",
      p1_afterYears: " anos ainda não foi conquistado.",
      p2_begin:
        "Sou ouvinte do Nerdcast desde 2007, quando tinha 14 anos, e me lembro de ter começado pelo episódio ",
      p2_end:
        " na casa de um amigo. Desde então, virei fã do Jovem Nerd e acompanho quase diariamente o conteúdo, sendo membro do grupo que ouve Nerdcast pra dormir hahah",
      deck_p1_before_ep: "Em 25 de maio de 2012, durante o episódio ",
      deck_p1_between_links: ", o Jovem Nerd lançou o ",
      deck_p1_after_product:
        ", um baralho temático em parceria com a Copag ilustrando vários Nerdcasters da época.",
      deck_p2_before_ep: "No Nerdcast seguinte, ",
      deck_p2_after_ep:
        ", foi lançado o Desafio do Baralho ao final da leitura de e-mails:",
      my_p1_before_link:
        "Em 11 de outubro de 2024, faltando 47 episódios para o #1000, decidi embarcar nesta jornada comprando um Baralho do Nerdcast para chamar de meu no ",
      my_p1_after_link: ".",
      my_p2:
        "Ele já tinha algumas assinaturas, mas tinha em mente que iria atrás de todas ainda assim para completar o desafio seguindo as regras estabelecidas.",
      my_p3: "... O pacote foi extraviado durante o transporte... 🤡",
      my_p4_before_first_date:
        "Mesmo assim decidi começar o código do projeto ",
      my_p4_after_first_date_before_link: " em ",
      my_p4_after_link_before_second_date:
        " e depois dia 13 de novembro de 2024 achei ",
      my_p4_after_second_link: " e consegui comprar outro baralho, este ",
      my_p4_end: "completo e lacrado!!",
    },
    aboutAuthor: {
      title: "Créditos",
      lenaKaleAlt: "Kale, protagonista da animação Kale do Museu Assustador",
      lenaKizaAlt: "Kiza, protagonista da animação Kale do Museu Assustador",
      people: {
        lena: {
          name: "Lena Franzz",
          title: "Animadora, ilustradora, diretora de animação e atriz de voz",
          description:
            "Artista responsável pelas ilustrações da Jornada do Baralho. Gaúcha naturalizada carioca desde 2013, acompanha o Nerdcast de muitos anos, já enviou artes dos fãs, fez tour gastronômico do Eskimó ao Majórica para deixar o Senhor K. com orgulho. Atualmente é sócia-fundadora do Studio Chifrezz, onde já animou projetos premiados internacionalmente e está trabalhando em mais obras para serem lançadas futuramente!",
        },
        cesar: {
          name: "César Hoffmann",
          title:
            "Desenvolvedor, falso designer e pessoa que está trilhando a Jornada do Baralho",
          description:
            "Morador de Porto Alegre - RS, é um aspirante a mestre Pokémon durante a noite, e pedreiro de código durante o dia. É ouvinte e espectador do universo Jovem Nerd durante uma vida toda quase, desde os seus 14 anos (2007). Tomou como objetivo de vida não deixar o Nerdcast acabar sem alguém concluir esse desafio que perdura há mais de década.",
        },
        leo: {
          name: "Leo Brasil",
          title: "Compositor de trilhas, Sound Designer e Roteirista",
          description:
            "É o nosso mineirin musicista favorito que deu sonoridade à Jornada do Baralho, da música aos pequenos efeitos sonoros escondidos pelo site. Não tem nada contra o Nerdcast, mas acho que nunca foi ouvinte também hahaha",
        },
      },
    },
    aboutChallenge: {
      title: "DESAFIO DO BARALHO",
      rule1_prefix: "Conseguir o autógrafo em todas cartas de",
      figures: "figuras",
      jokers: "coringas",
      reserve: "reserva",
      rule2: "Registrar o momento de cada carta sendo autografada.",
      rule3: "Enviar o baralho assinado para o Jovem Nerd.",
      rule4: "Ganhe o iPad lançado mais recentemente!",
      cartaSrKAlt: "Carta Sr. K",
      cartaFrancineAlt: "Carta Francine",
      cartaGugaFerrariAlt: "Carta Guga Ferrari",
      cartaNickEllisAlt: "Carta Nick Ellis",
      cartaFabioYabuAlt: "Carta Fabio Yabu",
      cartaTresdeAlt: "Carta Tresdê",
      cartaAmigoImaginarioAlt: "Carta Amigo Imaginário",
      azaghalAlt: "Azaghal",
      jovemNerdAlt: "Jovem Nerd",
    },
    deckList: {
      prev: "Carta anterior",
      next: "Próxima carta",
      cardFrontAltPrefix: 'Carta do Nerdcaster "',
      cardFrontAltSuffix: '"',
      cardBackAlt: "Verso do baralho Nerdcast",
    },
    cardDetails: {
      nerdcastEpisodes: "Episódios do Nerdcast",
      noneEpisodes: "Nenhum episódio disponível",
      social: "Redes Sociais",
      noSocialAlt: "Não encontramos as redes",
      noSocialTitle: "Sem redes disponíveis",
      noSocialSubtitle: "I want to believe",
      signedOn: "Assinado em",
      atPreposition: "em",
      signedCardAltPrefix: "Carta assinada por",
      noSignatureAlt: "Carta pendente assinatura",
      signaturePendingTitle: "Assinatura pendente",
      signaturePendingSubtitle: "Que fim levou...?",
      signedLocation: {
        popupTitle: "Bar Lagoa",
        popupDesc: "Esse é apenas um exemplo, mas espero um dia ir lá!",
      },
    },
  },
  en: {
    common: {
      loading: "Loading...",
    },
    nav: {
      reset_splash: "Watch opening again",
      gallery: "Gallery",
      gallery_tooltip: "See Lena Franzz's illustration gallery",
      lang_pt: "PT 🇧🇷",
      lang_en: "EN 🇺🇸",
      lang_label: "Language",
    },
    aboutJourney: {
      titleWhoAmI: "Who am I",
      titleDeck: "The Deck",
      myJourney: "My Journey",
      listenChallenge: "Listen to the challenge",
      pauseAudio: "Pause audio",
      imgBgAlt: "Journey image (background)",
      imgTopAlt: "Journey image (top with animation)",
      p1_begin: "This is my personal initiative, ",
      p1_afterName:
        ", to document and complete The Deck Challenge to get the iPad that for ",
      p1_afterYears: " years has still not been claimed.",
      p2_begin:
        "I've been a Nerdcast listener since 2007, when I was 14, and I remember starting with episode ",
      p2_end:
        ". Since then, I've become a fan of Jovem Nerd and follow the content almost daily, being one of those who listens to Nerdcast to fall asleep haha",
      deck_p1_before_ep: "On May 25, 2012, during episode ",
      deck_p1_between_links: ", Jovem Nerd launched the ",
      deck_p1_after_product:
        ", a themed deck in partnership with Copag, featuring several Nerdcasters of that time.",
      deck_p2_before_ep: "In the next Nerdcast, ",
      deck_p2_after_ep:
        ", the Deck Challenge was launched at the end of the email reading:",
      my_p1_before_link:
        "On October 11, 2024, with 47 episodes left until #1000, I decided to embark on this journey by buying a Nerdcast Deck of my own on ",
      my_p1_after_link: ".",
      my_p2:
        "It already had some signatures, but I intended to pursue all of them to complete the challenge by following the established rules.",
      my_p3: "... The package was lost during transport... 🤡",
      my_p4_before_first_date: "Even so, I decided to start the project code ",
      my_p4_after_first_date_before_link: " on ",
      my_p4_after_link_before_second_date:
        " and then on November 13, 2024 I found ",
      my_p4_after_second_link: " and managed to buy another deck, this one ",
      my_p4_end: "complete and sealed!!",
    },
    aboutAuthor: {
      title: "Credits",
      lenaKaleAlt:
        "Kale, protagonist of the animation Kale do Museu Assustador",
      lenaKizaAlt:
        "Kiza, protagonist of the animation Kale do Museu Assustador",
      people: {
        lena: {
          name: "Lena Franzz",
          title: "Animator, illustrator, animation director and voice actress",
          description:
            "The artist commissioned to illustrate and animate the art in Jornada do Baralho. A gaucha who became a carioca in 2013, she's been listening to Nerdcast for many years, has sent fan art, and did the gastronomic tour from Eskimó to Majórica to make Senhor K proud. She's currently a co-founder of Studio Chifrezz, has animated internationally awarded projects and is working on more to be released in the future!",
        },
        cesar: {
          name: "César Hoffmann",
          title:
            "Developer, fake designer, and the person trekking the Deck Journey",
          description:
            "Living in Porto Alegre - RS, is an emerging Pokemon master by night and code developer by day. Has been imersed into Jovem Nerd's universe over the course of his life since he was a 14yo (2007).",
        },
        leo: {
          name: "Leo Brasil",
          title: "Composer, Sound Designer and Screenwriter",
          description:
            "He's our favorite musician from Minas who gave sound to the Deck Journey, from the music to the small sound effects hidden across the site. He has nothing against Nerdcast, but I don't think he's ever been a listener hahaha",
        },
      },
    },
    aboutChallenge: {
      title: "THE DECK CHALLENGE",
      rule1_prefix: "Get the autograph on all",
      figures: "face cards",
      jokers: "jokers",
      reserve: "reserve",
      rule2: "Record the moment of each card being signed.",
      rule3: "Send the signed deck to Jovem Nerd.",
      rule4: "Win the most recently launched iPad!",
      cartaSrKAlt: "Sr. K card",
      cartaFrancineAlt: "Francine card",
      cartaGugaFerrariAlt: "Guga Ferrari card",
      cartaNickEllisAlt: "Nick Ellis card",
      cartaFabioYabuAlt: "Fabio Yabu card",
      cartaTresdeAlt: "Tresdê card",
      cartaAmigoImaginarioAlt: "Imaginary Friend card",
      azaghalAlt: "Azaghal",
      jovemNerdAlt: "Jovem Nerd",
    },
    deckList: {
      prev: "Previous card",
      next: "Next card",
      cardFrontAltPrefix: 'Nerdcaster card "',
      cardFrontAltSuffix: '"',
      cardBackAlt: "Nerdcast deck back",
    },
    cardDetails: {
      nerdcastEpisodes: "Nerdcast Episodes",
      noneEpisodes: "No episodes available",
      social: "Social Media",
      noSocialAlt: "We couldn't find social networks",
      noSocialTitle: "No social available",
      noSocialSubtitle: "I want to believe",
      signedOn: "Signed on",
      atPreposition: "at",
      signedCardAltPrefix: "Card signed by",
      noSignatureAlt: "Card pending signature",
      signaturePendingTitle: "Signature pending",
      signaturePendingSubtitle: "Where did it go...?",
      signedLocation: {
        popupTitle: "Bar Lagoa",
        popupDesc: "This is just an example, but I hope to go there someday!",
      },
    },
  },
};
