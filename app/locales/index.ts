export type SupportedLocale = "pt" | "en";
export type NestedMessages = { [key: string]: string | NestedMessages };

export const messages: Record<SupportedLocale, NestedMessages> = {
  pt: {
    common: {
      loading: "Falta pouco...",
      unmute: "Ligar som",
      skip: "Pular intro",
      new: "Novo!",
    },
    v2: {
      nav: {
        primary: "Navegação principal",
        home: "Página inicial da Jornada do Baralho",
        openMenu: "Abrir menu",
        closeMenu: "Fechar menu",
        menuTitle: "Navegação",
        countdown: "Progresso",
        deck: "O baralho",
        challenge: "O desafio",
        signedCards: "As assinaturas",
        journey: "Quem é o autor",
        blogSection: "Saiba mais",
        credits: "Créditos",
        gallery: "Galeria",
        blog: "Blog",
      },
      countdown: {
        eyebrow: "A Jornada ainda aguarda um herói",
        title: "QUEM RESGATARÁ O TESOURO?",
        elapsedPrefix: "Já fazem",
        elapsedSuffix: "dias desde o início do Desafio",
        statueInteraction: "Fazer a estátua piscar",
        treasureInteraction: "Abrir a caixa e revelar o tesouro",
        treasureVideoTitle: "O tesouro da Jornada do Baralho",
        closeTreasureVideo: "Fechar vídeo",
      },
      aboutDeck: {
        title: "O Baralho",
        historyP1BeforeEpisode: "Em 25 de maio de 2012, durante o episódio ",
        historyP1BetweenLinks: ", o Jovem Nerd lançou o ",
        historyP1BeforeAuthor:
          ", um produto temático em parceria com a Copag que incluía 19 ilustrações de Nerdcasters, feitas pelo ",
        historyP2BeforeEpisode: "No Nerdcast seguinte, ",
        historyP2AfterEpisode:
          ", nascia despretensiosamente o Desafio do Baralho ao final da leitura de e-mails...",
        modelLabel: "Modelo 3D da caixa do Baralho Nerdcast",
        modelInteraction:
          "Arraste para girar ou toque para fazer a tampa pular",
        modelLoading: "Carregando o modelo do baralho…",
      },
      challenge: {
        title: "O DESAFIO",
        rule1: "Consiga todos os autógrafos nas cartas dos Nerdcasters",
        rule2: "Registre uma foto do momento",
        rule3: "Envie o baralho para o Jovem Nerd",
        rule4: "Ganhe o iPad mais recente disponível!",
        audioListen: "Ouça o anúncio original",
        audioPause: "Pausar anúncio",
      },
      signedCards: {
        title: "As Assinaturas",
        caption:
          "Como, onde e com quem foram cruzados os caminhos até chegarmos ao tesouro.",
        cardAlt: "Carta do Nerdcaster",
        photoAlt: "Foto da carta assinada por",
        revealPhoto: "Revelar foto de",
        hidePhoto: "Ocultar foto de",
      },
      readTheBlog: {
        title: "Descubra como foi cada passo da jornada",
        cta: "Leia o blog",
      },
    },
    nav: {
      reset_splash: "Assistir a abertura de novo",
      gallery: "Galeria",
      gallery_tooltip: "Ver galeria de ilustrações da Lena Franzz",
      blog: "Blog",
      blog_tooltip: "Acompanhe a Blogada do Baralho",
      lang_pt: "PT 🇧🇷",
      lang_en: "EN 🇺🇸",
      lang_label: "Idioma",
    },
    aboutJourney: {
      titleWhoAmI: "Quem sou eu",
      titleDeck: "O Baralho",
      myJourney: "Como tudo começou",
      listenChallenge: "Ouça o desafio",
      pauseAudio: "Pausar áudio",
      imgBgAlt: "César Hoffmann em Fernando de Noronha",
      imgTopAlt: "César Hoffmann envelhecido em Fernando de Noronha",
      p1_begin: "Sou ",
      p1_afterName: " desenvolvedor de software de Porto Alegre - RS, ",
      p1_afterYears:
        " anos, e tive a epifania de conquistar o Desafio do Baralho e resgatar o iPad que aguarda há tantos anos pacientemente.",
      p2_begin: "Comecei a ouvir ao Nerdcast em 2007 com o episódio ",
      p2_end:
        " na casa de um amigo. Virei fã do Jovem Nerd e comecei a consumir o conteúdo nas mais variadas mídias, e hoje considero uma peça importante da minha jornada pessoal ao longo dos anos que seguiram.",
      deck_p1_before_ep: "Em 25 de maio de 2012, durante o episódio ",
      deck_p1_between_links: ", o Jovem Nerd lançou o ",
      deck_p1_after_product:
        ", um baralho temático em parceria com a Copag com ilustrações de vários Nerdcasters da época, feitas pelo",
      deck_p2_before_ep: "No Nerdcast seguinte, ",
      deck_p2_after_ep:
        ", foi lançado o Desafio do Baralho ao final da leitura de e-mails:",
      my_origin_before_950: "Em 20 de setembro de 2024 lançava o ",
      my_origin_after_950:
        " e naquele momento me dei conta que o programa poderia acabar no episódio 1000 sem que alguém completasse esse desafio. Bem que alguém poderia fazer isso...",
      my_origin_call: "Por que não eu?",
      my_spark_before_project:
        "Isso despertou uma fagulha em mim que cresceria e se tornaria a ",
      my_spark_after_project_before_code_date:
        " (uma homenagem ao Eduardo Spohr e a Jornada do Herói). Em ",
      my_code_date: "11 de outubro de 2024",
      my_after_code_date_before_deck_date:
        " comecei a fazer o código do site, e em ",
      my_deck_date: "13 de novembro de 2024",
      my_after_deck_date_before_state: " consegui um baralho ",
      my_deck_state: "completo e lacrado",
      my_end: " para iniciar essa aventura.",
      my_conclusion: "... Desde então, nada mais foi o mesmo.",
      readBlog: "Acompanhe a Blogada do Baralho",
    },
    aboutAuthor: {
      title: "Créditos",
      subtitle:
        "A Jornada do Baralho só é bonita do jeito que é graças ao trabalho dessa equipe incrível",
      showAlternatePortrait: "Ver retrato alternativo de",
      showOriginalPortrait: "Ver retrato original de",
      lenaKaleAlt: "Kale, protagonista da animação Kale do Museu Assustador",
      lenaKizaAlt: "Kiza, protagonista da animação Kale do Museu Assustador",
      people: {
        lena: {
          name: "Lena Franzz",
          title: "Animadora, ilustradora, diretora de animação",
          description:
            "Artista responsável pelas ilustrações da Jornada do Baralho. Gaúcha naturalizada carioca desde 2013, acompanha o Nerdcast de muitos anos, já enviou artes dos fãs, fez tour gastronômico do Eskimó ao Majórica para deixar o Senhor K. com orgulho. Atualmente é sócia-fundadora do Studio Chifrezz, onde já animou projetos premiados internacionalmente e está trabalhando em mais obras para serem lançadas futuramente!",
        },
        cesar: {
          name: "César Hoffmann",
          title:
            "Desenvolvedor, CEO, COO, CFO e CTO da Jornada do Baralho. O faz tudo.",
          description:
            "Morador de Porto Alegre - RS, é um aspirante a mestre Pokémon durante a noite, e pedreiro de código durante o dia. É ouvinte e espectador do universo Jovem Nerd durante uma vida toda quase, desde os seus 14 anos (2007). Tomou como objetivo de vida não deixar o Nerdcast acabar sem alguém concluir esse desafio que perdura há mais de década.",
        },
        leo: {
          name: "Leo Brasil",
          title: "Compositor do curta de abertura, sound designer",
          description:
            "É o nosso mineirin musicista favorito que deu sonoridade à Jornada do Baralho, da música aos pequenos efeitos sonoros escondidos pelo site. Não tem nada contra o Nerdcast, mas acho que nunca foi ouvinte também hahaha",
        },
        kabuki: {
          name: "Kabuki Sonic",
          title: "Compositor do curta de encerramento, sound designer",
        },
        luah: {
          name: "Luah Garcia",
          title: "Produção e rigging 2D",
        },
        dani: {
          name: "Dani Smith-Fischer",
          title: "Storyboard e animatic",
        },
        andres: {
          name: "Andres Ramos",
          title: "Diretor de arte e ilustrador de cenários",
        },
        pedro: {
          name: "Pedro Azevedo",
          title: "Locução e voz original",
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
    readTheBlog: {
      title: "Legal, mas...",
      title1: "e agora?",
      description_1_quote_rebelde:
        '"Eu é que não vou ficar voltando aqui toda hora para ver se você conseguiu alguma assinatura de sabe-se-lá quem!!"',
      description_2_lento_e_espacado:
        "Reunir todas assinaturas certamente não vai ser um desafio resolvido do dia para a noite...",
      description_21_jornada_thanos:
        " O ideal é encarar mais como um processo lento e espaçado, assim como foi a jornada do Thanos pelas Jóias do Infinito.",
      description_3_apesar_disso: "Apesar disso...",
      description_3_vem_ai: "Muitas coisas estão acontecendo nos bastidores!",
      description_4_curtiu: "Você curtiu a Jornada do Baralho?",
      description_5_curiosidade:
        "Tem curiosidade sobre como o site foi feito e o futuro dele?",
      description_6_quer_saber:
        "Quer saber como foi para conseguir as assinaturas?",
      description_7_blogada:
        "Isso e muito mais você vai descobrir lendo o novo blog",
      description_8_newsletter:
        "Ou assine a newsletter para receber atualizações sobre o desafio conforme as novidades forem acontecendo!",
      readBlogButton: "Leia a Blogada do Baralho",
      newsletterLabel: "... ou inscreva-se na newsletter!",
      newsletterInput: "seu e-mail aqui",
      newsletterSend: "Se inscreva!",
      newsletterHeader: "Receba as próximas atualizações direto do seu e-mail",
      newsletterInvalidEmail: "Por favor, insira um e-mail válido",
    },
    blog: {
      title: "Blogada do Baralho",
      sortBy: "Ordenar por",
      newest: "Mais recentes",
      oldest: "Mais antigos",
      filterByTag: "Filtrar por tag",
      allTags: "Todas as tags",
      noPosts: "Nenhum post encontrado",
      noPostsWithTags: "Nenhum post encontrado com as tags selecionadas",
      activeFilters: "Filtros ativos",
      clearAllFilters: "Limpar todos os filtros",
      clearFiltersToSeeAll: "Limpar filtros para ver todos os posts",
      backToBlog: "Voltar ao blog",
      allPosts: "Todos os posts",
      sharePost: "Compartilhar post",
      previousPost: "Post Anterior",
      nextPost: "Próximo Post",
      locale: "pt",
    },
  },
  en: {
    common: {
      loading: "Almost there...",
      unmute: "Unmute",
      skip: "Skip intro",
      new: "New!",
    },
    v2: {
      nav: {
        primary: "Main navigation",
        home: "Jornada do Baralho homepage",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        menuTitle: "Navigation",
        countdown: "Progress",
        deck: "The deck",
        challenge: "The challenge",
        signedCards: "The signatures",
        journey: "Who is the author",
        blogSection: "Learn more",
        credits: "Credits",
        gallery: "Gallery",
        blog: "Blog",
      },
      countdown: {
        eyebrow: "The Journey still awaits a hero",
        title: "WHO WILL RESCUE THE TREASURE?",
        elapsedPrefix: "It has been",
        elapsedSuffix: "days since the Challenge began",
        statueInteraction: "Make the statue blink",
        treasureInteraction: "Open the box and reveal the treasure",
        treasureVideoTitle: "The Journey of the Deck treasure",
        closeTreasureVideo: "Close video",
      },
      aboutDeck: {
        title: "The Deck",
        historyP1BeforeEpisode: "On May 25, 2012, during episode ",
        historyP1BetweenLinks: ", Jovem Nerd released the ",
        historyP1BeforeAuthor:
          ", a themed product created with Copag that included 19 illustrations of Nerdcasters by ",
        historyP2BeforeEpisode: "On the following Nerdcast, ",
        historyP2AfterEpisode:
          ", the Deck Challenge was casually born at the end of the email segment...",
        modelLabel: "3D model of the Nerdcast deck box",
        modelInteraction: "Drag to spin or tap to make the lid jump",
        modelLoading: "Loading the deck model…",
      },
      challenge: {
        title: "THE CHALLENGE",
        rule1: "Collect all the Nerdcasters' signatures on their cards",
        rule2: "Take a photo of the moment",
        rule3: "Send the deck to Jovem Nerd",
        rule4: "Win the latest iPad available!",
        audioListen: "Listen to original announcement",
        audioPause: "Pause announcement",
      },
      signedCards: {
        title: "The Signatures",
        caption:
          "How it happened, where it happened, and whose paths crossed ours before we reached the treasure.",
        cardAlt: "Nerdcaster card",
        photoAlt: "Photo of the card signed by",
        revealPhoto: "Reveal photo of",
        hidePhoto: "Hide photo of",
      },
      readTheBlog: {
        title: "Discover every step of the journey",
        cta: "Read the blog",
      },
    },
    nav: {
      reset_splash: "Watch opening again",
      gallery: "Gallery",
      gallery_tooltip: "See Lena Franzz's illustration gallery",
      blog: "Blog",
      blog_tooltip: "Follow the journey through the blog",
      lang_pt: "PT 🇧🇷",
      lang_en: "EN 🇺🇸",
      lang_label: "Language",
    },
    aboutJourney: {
      titleWhoAmI: "Who am I",
      titleDeck: "The Deck",
      myJourney: "How it all began",
      listenChallenge: "Listen to the challenge",
      pauseAudio: "Pause audio",
      imgBgAlt: "César Hoffmann in Fernando de Noronha",
      imgTopAlt: "An aged César Hoffmann in Fernando de Noronha",
      p1_begin: "I'm ",
      p1_afterName: " a software developer from Porto Alegre, RS, ",
      p1_afterYears:
        " years old, and I had the epiphany of conquering the Deck Challenge and rescuing the iPad that has waited patiently for so many years.",
      p2_begin: "I started listening to Nerdcast in 2007 with episode ",
      p2_end:
        " at a friend's house. I became a fan of Jovem Nerd and started following its content across many different media, and today I consider it an important part of my personal journey throughout the years that followed.",
      deck_p1_before_ep: "On May 25, 2012, during episode ",
      deck_p1_between_links: ", Jovem Nerd launched the ",
      deck_p1_after_product:
        ", a themed deck in partnership with Copag, featuring several Nerdcasters of that time, as illustrated by",
      deck_p2_before_ep: "In the next Nerdcast, ",
      deck_p2_after_ep:
        ", the DeckVenture was launched at the end of the email reading:",
      my_origin_before_950: "On September 20, 2024, ",
      my_origin_after_950:
        " was released, and at that moment I realized the show could end at episode 1000 without anyone completing this challenge. Someone ought to do it...",
      my_origin_call: "Why not me?",
      my_spark_before_project:
        "That lit a spark in me that would grow into the ",
      my_spark_after_project_before_code_date:
        " (an homage to Eduardo Spohr and the Hero's Journey). On ",
      my_code_date: "October 11, 2024",
      my_after_code_date_before_deck_date:
        " I started coding the website, and on ",
      my_deck_date: "November 13, 2024",
      my_after_deck_date_before_state: " I bought a ",
      my_deck_state: "complete and sealed deck",
      my_end: " to begin this adventure.",
      my_conclusion: "... Since then, nothing was ever the same.",
      readBlog: "Read the Blog",
    },
    aboutAuthor: {
      title: "Credits",
      subtitle:
        "Jornada do Baralho only looks as beautiful as it does thanks to the hard work of this incredible team",
      showAlternatePortrait: "Show alternate portrait of",
      showOriginalPortrait: "Show original portrait of",
      lenaKaleAlt:
        "Kale, protagonist of the animation Kale do Museu Assustador",
      lenaKizaAlt:
        "Kiza, protagonist of the animation Kale do Museu Assustador",
      people: {
        lena: {
          name: "Lena Franzz",
          title: "Animator, illustrator, and animation director",
          description:
            "The artist commissioned to illustrate and animate the art in Jornada do Baralho. A gaucha who became a carioca in 2013, she's been listening to Nerdcast for many years, has sent fan art, and did the gastronomic tour from Eskimó to Majórica to make Senhor K proud. She's currently a co-founder of Studio Chifrezz, has animated internationally awarded projects and is working on more to be released in the future!",
        },
        cesar: {
          name: "César Hoffmann",
          title:
            "Developer, CEO, COO, CFO, and CTO of Jornada do Baralho. The one who does everything.",
          description:
            "Living in Porto Alegre - RS, is an emerging Pokemon master by night and code developer by day. Has been imersed into Jovem Nerd's universe over the course of his life since he was a 14yo (2007).",
        },
        leo: {
          name: "Leo Brasil",
          title: "Composer for the opening short film and sound designer",
          description:
            "He's our favorite musician from Minas who gave sound to the Deck Journey, from the music to the small sound effects hidden across the site. He has nothing against Nerdcast, but I don't think he's ever been a listener hahaha",
        },
        kabuki: {
          name: "Kabuki Sonic",
          title: "Composer for the closing short film and sound designer",
        },
        luah: {
          name: "Luah Garcia",
          title: "Production and 2D rigging",
        },
        dani: {
          name: "Dani Smith-Fischer",
          title: "Storyboard and animatic",
        },
        andres: {
          name: "Andres Ramos",
          title: "Art director and background illustrator",
        },
        pedro: {
          name: "Pedro Azevedo",
          title: "Narration and original voice",
        },
      },
    },
    aboutChallenge: {
      title: "THE DeckVenture",
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
    readTheBlog: {
      title: "Cool, but...",
      title1: "what now?",
      description_1_quote_rebelde:
        '"I\'m not going to keep coming back here all the time to see if you managed to get some signature from who-knows-who!!"',
      description_2_lento_e_espacado:
        "Gathering all signatures certainly won't be a challenge solved overnight...",
      description_21_jornada_thanos:
        " The ideal is to approach it more like a slow and spaced process, just like Thanos' journey through the Infinity Stones.",
      description_3_apesar_disso: "Despite that...",
      description_3_vem_ai: "Many things are happening behind the scenes!",
      description_4_curtiu: "Did you enjoy the Deck Journey?",
      description_5_curiosidade:
        "Are you curious about how the website was made?",
      description_6_quer_saber:
        "Want to know what it was like to get the signatures?",
      description_7_blogada:
        "This and much more you'll discover by reading the new blog",
      description_8_newsletter:
        "Or subscribe to the newsletter to receive updates about the challenge as news happens!",
      readBlogButton: "Read the Deck's Blogventure",
      newsletterLabel: "... or subscribe to the newsletter!",
      newsletterInput: "your e-mail here",
      newsletterSend: "Subscribe",
      newsletterHeader: "Receba as próximas atualizações direto do seu e-mail",
      newsletterInvalidEmail: "Please enter a valid email address",
    },
    blog: {
      title: "The Deck Journey - Blog",
      sortBy: "Sort by",
      newest: "Newest",
      oldest: "Oldest",
      filterByTag: "Filter by tag",
      allTags: "All tags",
      noPosts: "No posts found",
      noPostsWithTags: "No posts found with the selected tags",
      activeFilters: "Active filters",
      clearAllFilters: "Clear all filters",
      clearFiltersToSeeAll: "Clear filters to see all posts",
      backToBlog: "Back to blog",
      allPosts: "All posts",
      sharePost: "Share post",
      previousPost: "Previous Post",
      nextPost: "Next Post",
      locale: "en",
    },
  },
};
