// Conteúdo do Rio Grande do Sul. Aqui não há tradução de idioma: "es" é como o gaúcho fala, "pt" é o que quer dizer.
// As 8 regiões entram em `cidades` e `lugares[].cidade`. Plano e decisões: docs/PLANO-RS.md
window.VIAJADOR = window.VIAJADOR || { paises: {} };

window.VIAJADOR.paises.rs = {
  codigo: "rs",
  nome: "Rio Grande do Sul",
  artigo: "o",
  bandeira: "🧉",
  voz: ["pt-BR", "pt"],
  // Só as ilustrações que não são do Uruguai (as outras têm bandeira e frases em espanhol).
  capas: ["lugares", "dicas", "favoritos"],
  rapidas: [
    { rotulo: "Pão", icone: "🥖", es: "Me vê dois cacetinhos" },
    { rotulo: "Xis", icone: "🍔", es: "Um xis coração, por favor" },
    { rotulo: "Carne", icone: "🔥", es: "Pra mim, ao ponto" },
    { rotulo: "Chimarrão", icone: "🧉", es: "Queres um mate?" },
  ],
  cidades: [
    "Metropolitana e Vales",
    "Serra Gaúcha",
    "Campanha e Fronteira Oeste",
    "Missões",
    "Planalto Médio e Norte",
    "Região Central",
    "Litoral Norte",
    "Litoral Sul e Zona Sul",
  ],
  intro:
    "Aqui se fala português, mas com sotaque, palavras e costumes próprios: o \"tu\" com verbo de \"você\", o \"bah\" em toda frase e o chimarrão passando de mão em mão.",

  situacoes: [
    {
      id: "padaria",
      icone: "🥖",
      titulo: "Padaria & café",
      frases: [
        { es: "Me vê dois cacetinhos", pt: "Me dá dois pães franceses", pr: "me VÊ DOIS ka-se-TI-nhos", dica: "\"Me vê\" é o jeito gaúcho de pedir qualquer coisa no balcão." },
        { es: "Uma torrada, por favor", pt: "Um misto-quente, por favor", pr: "U-ma to-RRA-da, por fa-VOR", dica: "Torrada aqui é o sanduíche de presunto e queijo na chapa. Se quiser só o pão tostado, explique." },
        { es: "Tem negrinho?", pt: "Tem brigadeiro?", pr: "TEM ne-GRI-nho?" },
        { es: "Me vê uma cueca virada", pt: "Quero um bolinho frito de massa", pr: "me VÊ U-ma KUE-ka vi-RA-da", dica: "É um doce frito, passado no açúcar e na canela. Nada de roupa." },
        { es: "Tem cuca de uva?", pt: "Tem cuca de uva?", pr: "TEM KU-ka de U-va?", dica: "Cuca é o bolo de origem alemã com farofa doce por cima." },
        { es: "Bah, tri bom!", pt: "Nossa, muito bom!", pr: "BAH, TRI BOM!", dica: "\"Tri\" é o \"muito\" gaúcho: tri legal, tri bom, tri caro." },
      ],
    },
    {
      id: "churrasco",
      icone: "🔥",
      titulo: "Churrasco & lancheria",
      frases: [
        { es: "Tu quer mais um pedaço?", pt: "Você quer mais um pedaço?", pr: "TU KER MAIS UM pe-DA-so?", dica: "\"Tu\" com o verbo de \"você\" é o normal por aqui. Não estranhe." },
        { es: "Pra mim, ao ponto", pt: "Para mim, carne ao ponto", pr: "pra MIM, ao PON-to", dica: "O churrasco gaúcho é só sal grosso e brasa. Bem passado pode render uma careta do assador, mas peça como gosta." },
        { es: "A costela é fogo de chão?", pt: "A costela é assada no chão, em fogo de lenha?", pr: "a kos-TE-la É FO-go de CHÃO?", dica: "Costela fogo de chão assa por horas, espetada ao redor da fogueira." },
        { es: "Um xis coração, por favor", pt: "Um sanduíche grande de coração de galinha", pr: "UM XIS ko-ra-SÃO, por fa-VOR", dica: "Xis é o X-burger gaúcho: grande, prensado na chapa e com tudo dentro. Coração é o sabor clássico." },
        { es: "Onde tem uma lancheria?", pt: "Onde tem uma lanchonete?", pr: "ON-de TEM U-ma lan-che-RI-a?" },
        { es: "Tá tri caro", pt: "Está muito caro", pr: "TÁ TRI KA-ro" },
      ],
    },
    {
      id: "chimarrao",
      icone: "🧉",
      titulo: "Roda de chimarrão",
      frases: [
        { es: "Queres um mate?", pt: "Quer um chimarrão?", pr: "KE-res UM MA-te?", dica: "\"Mate\" e \"chimarrão\" são a mesma coisa. Aceitar é um gesto de simpatia." },
        { es: "Obrigado", pt: "Para mim, chega", pr: "o-bri-GA-do", dica: "Na roda, \"obrigado\" quer dizer que você não quer mais. Se quiser outra cuia, devolva e espere a sua vez." },
        { es: "Não mexe na bomba", pt: "Não mexa no canudo", pr: "NÃO ME-xe na BOM-ba", dica: "Mexer na bomba entope a cuia. É a gafe número um." },
        { es: "Pode roncar a cuia", pt: "Pode tomar até o fim, até fazer barulho", pr: "PO-de ron-KAR a KUI-a", dica: "Aqui o barulho no fim é educado: mostra que você terminou." },
        { es: "O mate tá lavado", pt: "A erva perdeu o gosto", pr: "o MA-te TÁ la-VA-do", dica: "Quando a erva perde o sabor, quem serve troca. Quem serve é o \"cevador\"." },
      ],
    },
    {
      id: "frio",
      icone: "🥶",
      titulo: "Frio de verdade",
      frases: [
        { es: "Que frio de renguear cusco!", pt: "Que frio de doer!", pr: "KE FRI-o de rren-ge-AR KUS-ko!", dica: "Cusco é cachorro pequeno; \"renguear\" é mancar. Frio tão forte que até o cachorro manca." },
        { es: "Bah, entrou o minuano", pt: "Chegou o vento frio do sul", pr: "BAH, en-TROU o mi-nu-A-no", dica: "Minuano é o vento frio e seco que chega depois das frentes frias, sobretudo no inverno." },
        { es: "Deu geada hoje", pt: "Teve geada hoje", pr: "DEU je-A-da O-je", dica: "Na Serra e na Campanha, geada é comum no inverno e a temperatura pode ficar abaixo de zero. Leve luva e gorro." },
        { es: "Tem aquecedor no quarto?", pt: "Tem aquecedor no quarto?", pr: "TEM a-ke-se-DOR no KUAR-to?", dica: "Muita casa e hotel simples não tem aquecimento. Pergunte antes de reservar." },
        { es: "Vamos tomar um quentão", pt: "Vamos tomar quentão (de vinho)", pr: "VA-mos to-MAR UM ken-TÃO", dica: "O quentão gaúcho é de vinho tinto, não de cachaça." },
      ],
    },
    {
      id: "rua",
      icone: "🚦",
      titulo: "Na rua",
      frases: [
        { es: "Dobra na segunda sinaleira", pt: "Vira no segundo semáforo", pr: "DO-bra na se-GUN-da si-na-LEI-ra" },
        { es: "É só subir a lomba", pt: "É só subir a ladeira", pr: "É SÓ su-BIR a LOM-ba" },
        { es: "Pega uma lotação", pt: "Pegue um micro-ônibus (lotação)", pr: "PE-ga U-ma lo-ta-SÃO", dica: "Em Porto Alegre, a lotação faz rotas fixas como o ônibus, costuma ser mais rápida e cobra um pouco mais." },
        { es: "Tu chega lá de vereda", pt: "Você chega lá rapidinho", pr: "TU CHE-ga LÁ de ve-RE-da" },
        { es: "Cuidado com o cusco", pt: "Cuidado com o cachorro", pr: "kui-DA-do kom o KUS-ko" },
        { es: "Tu é de onde?", pt: "De onde você é?", pr: "TU É de ON-de?", dica: "Pergunta comum pra puxar papo. O próximo assunto costuma ser futebol." },
      ],
    },
    {
      id: "tradicao",
      icone: "🤠",
      titulo: "CTG & tradição",
      frases: [
        { es: "Hoje tem baile no CTG", pt: "Hoje tem baile no Centro de Tradições Gaúchas", pr: "O-je TEM BAI-le no se-te-GÊ", dica: "CTG é o clube da cultura gaúcha: dança, música e churrasco. Visitante costuma ser bem recebido." },
        { es: "Ela é a primeira prenda", pt: "Ela é a moça que representa o CTG", pr: "E-la É a pri-MEI-ra PREN-da", dica: "Prenda é a moça tradicionalista; o rapaz é o peão." },
        { es: "Que pilcha bonita", pt: "Que roupa gaúcha bonita", pr: "KE PIL-cha bo-NI-ta", dica: "Pilcha é o traje tradicional: bombacha e bota para eles, vestido de prenda para elas. No interior, bombacha também é roupa do dia a dia." },
        { es: "Tu é gremista ou colorado?", pt: "Você torce pro Grêmio ou pro Inter?", pr: "TU É gre-MIS-ta OU ko-lo-RA-do?", dica: "Colorado é o torcedor do Inter. Na dúvida, pergunte em vez de chutar." },
        { es: "No 20 de Setembro tem desfile", pt: "No 20 de setembro tem desfile", pr: "no VIN-te de se-TEM-bro TEM des-FI-le", dica: "Data da Revolução Farroupilha e feriado estadual. Em setembro, os acampamentos farroupilhas tomam conta das cidades." },
      ],
    },
  ],

  // `regioes`: onde a palavra é mais ouvida. Sem `regioes`, vale para o estado todo.
  girias: [
    { es: "Bah", pt: "Nossa! (espanto, alegria ou reclamação)", pr: "BAH", ex: "Bah, que dia lindo!" },
    { es: "Mas bah", pt: "Nossa, que coisa!", pr: "MAS BAH", ex: "Mas bah, perdi o ônibus de novo." },
    { es: "Tchê", pt: "Cara, amigo (vocativo)", pr: "TCHÊ", ex: "Bah, tchê, que frio!" },
    { es: "Tri", pt: "Muito", pr: "TRI", ex: "O show foi tri legal." },
    { es: "Barbaridade", pt: "Que absurdo! / Que incrível!", pr: "bar-ba-ri-DA-de", ex: "Barbaridade, que fila!" },
    { es: "Capaz!", pt: "Imagina! / De jeito nenhum!", pr: "ka-PAZ!", ex: "—Te atrapalhei? —Capaz!" },
    { es: "Guri / Guria", pt: "Menino, rapaz / Menina, moça", pr: "gu-RI / gu-RI-a", ex: "A gurizada foi pra praia." },
    { es: "Piá", pt: "Menino, garoto", pr: "pi-Á", ex: "O piá tá jogando bola.", regioes: ["Planalto Médio e Norte", "Missões", "Região Central"] },
    { es: "Bergamota", pt: "Mexerica, tangerina", pr: "ber-ga-MO-ta", ex: "Inverno é tempo de bergamota." },
    { es: "Cacetinho", pt: "Pão francês", pr: "ka-se-TI-nho", ex: "Me vê seis cacetinhos." },
    { es: "Negrinho", pt: "Brigadeiro", pr: "ne-GRI-nho", ex: "Na festa tinha negrinho e cajuzinho." },
    { es: "Sinaleira", pt: "Semáforo", pr: "si-na-LEI-ra", ex: "Dobra na próxima sinaleira." },
    { es: "Lomba", pt: "Ladeira", pr: "LOM-ba", ex: "Porto Alegre é cheia de lomba." },
    { es: "Cusco", pt: "Cachorro pequeno", pr: "KUS-ko", ex: "O cusco latiu a noite toda." },
    { es: "Guaipeca", pt: "Cachorro vira-lata", pr: "guai-PE-ka", ex: "Tem um guaipeca seguindo a gente.", regioes: ["Campanha e Fronteira Oeste", "Missões"] },
    { es: "Pandorga", pt: "Pipa, papagaio", pr: "pan-DOR-ga", ex: "Na praia, a gurizada solta pandorga." },
    { es: "Vianda", pt: "Marmita", pr: "vi-AN-da", ex: "Levei vianda pro trabalho." },
    { es: "Lancheria", pt: "Lanchonete", pr: "lan-che-RI-a", ex: "Vamos comer um xis na lancheria?" },
    { es: "Pila", pt: "Real (dinheiro)", pr: "PI-la", ex: "Custou vinte pila." },
    { es: "Atucanado", pt: "Apressado, estressado", pr: "a-tu-ka-NA-do", ex: "Tô atucanado com o trabalho." },
    { es: "Faceiro", pt: "Contente, todo feliz", pr: "fa-SEI-ro", ex: "Ficou faceiro com o presente." },
    { es: "Bagual", pt: "Muito bom, forte (e cavalo não domado)", pr: "ba-GUAL", ex: "Que churrasco bagual!" },
    { es: "Lagartear", pt: "Ficar tomando sol", pr: "la-gar-te-AR", ex: "Fui lagartear na praça." },
    { es: "Peleia", pt: "Briga, luta (também esforço)", pr: "pe-LEI-a", ex: "Foi uma peleia achar vaga." },
    { es: "Chinelagem", pt: "Coisa malfeita, de mau gosto", pr: "chi-ne-LA-jem", ex: "Furar a fila é chinelagem." },
    { es: "Querência", pt: "O lugar de onde a pessoa é e que ela ama", pr: "ke-REN-si-a", ex: "Saudade da minha querência." },
    { es: "Bolicho", pt: "Venda, armazém simples", pr: "bo-LI-cho", ex: "Compra pão no bolicho da esquina.", regioes: ["Campanha e Fronteira Oeste", "Missões"] },
    { es: "Bueno", pt: "Bom, então (para encerrar ou recomeçar)", pr: "BUE-no", ex: "Bueno, vou indo.", regioes: ["Campanha e Fronteira Oeste"] },
    { es: "Oigalê!", pt: "Opa! Eita! (animação)", pr: "oi-ga-LÊ!", ex: "Oigalê, chegou o churrasco!", regioes: ["Campanha e Fronteira Oeste", "Missões"] },
    { es: "Gringo", pt: "Descendente de italianos", pr: "GRIN-go", ex: "A família dele é de gringo, lá de Bento.", regioes: ["Serra Gaúcha", "Região Central"] },
    { es: "Nono / Nona", pt: "Avô / Avó", pr: "NO-no / NO-na", ex: "A nona fez capeletti pro almoço.", regioes: ["Serra Gaúcha", "Região Central"] },
    { es: "Porca miséria", pt: "Droga! Que azar!", pr: "POR-ka mi-ZE-ri-a", ex: "Porca miséria, esqueci a chave!", regioes: ["Serra Gaúcha"] },
    { es: "Veranear", pt: "Passar o verão na praia", pr: "ve-ra-ne-AR", ex: "A família veraneia em Capão.", regioes: ["Litoral Norte", "Litoral Sul e Zona Sul"] },
  ],

  ditados: [
    { es: "Mais perdido que cusco em procissão", pt: "Totalmente perdido", uso: "Para quem não sabe pra onde ir. Útil pra rir de si mesmo." },
    { es: "Mais faceiro que guri de calça nova", pt: "Todo feliz, todo contente", uso: "Para alguém radiante com uma novidade." },
    { es: "Mais grosso que dedo destroncado", pt: "Muito grosseiro, mal-educado", uso: "Para alguém que respondeu atravessado." },
    { es: "Me caíram os butiás do bolso", pt: "Fiquei de queixo caído", uso: "Para uma surpresa enorme. Butiá é um coquinho típico do estado." },
    { es: "Frio de renguear cusco", pt: "Frio de doer", uso: "O inverno gaúcho resumido em uma frase." },
    { es: "Mais por fora que umbigo de vedete", pt: "Completamente por fora do assunto", uso: "Para quem não está sabendo de nada." },
    { es: "Tchê loco!", pt: "Que loucura! / Nossa!", uso: "Espanto, admiração ou susto." },
    { es: "Tomar um chimarrão de vereda", pt: "Tomar um chimarrão rapidinho", uso: "Convite rápido, sem compromisso." },
  ],

  // Palavras que existem no resto do Brasil, mas aqui querem dizer outra coisa.
  falsosAmigos: [
    { es: "Torrada", pt: "Misto-quente", errado: "pão torrado" },
    { es: "Capaz!", pt: "Imagina! / De jeito nenhum!", errado: "\"é capaz\" (= talvez)" },
    { es: "Gringo", pt: "Descendente de italianos, na Serra", errado: "estrangeiro" },
    { es: "Patente", pt: "Vaso sanitário", errado: "registro de invenção ou posto militar" },
    { es: "Prenda", pt: "Moça tradicionalista, de vestido típico", errado: "presente ou prenda de brincadeira" },
    { es: "Cueca virada", pt: "Doce frito de massa", errado: "roupa íntima do avesso" },
    { es: "Xis", pt: "Sanduíche grande e prensado", errado: "a letra X" },
    { es: "Bergamota", pt: "Mexerica, tangerina", errado: "a fruta do óleo de bergamota" },
    { es: "Lomba", pt: "Ladeira", errado: "lombada" },
    { es: "Sinaleira", pt: "Semáforo", errado: "sinalizador" },
    { es: "Vianda", pt: "Marmita", errado: "carne" },
    { es: "Chinelagem", pt: "Coisa malfeita, de mau gosto", errado: "um monte de chinelos" },
    { es: "Obrigado (na roda de mate)", pt: "Chega, não quero mais", errado: "só agradecer" },
  ],

  // No RS não há regra de pronúncia a aprender: são curiosidades do jeito de falar.
  pronuncia: [
    { regra: "\"Tu\" com o verbo de \"você\"", ex: "tu vai? · tu quer chimarrão? · tu é de onde?", dica: "É o jeito gaúcho, não erro. Em Pelotas e na Fronteira, também se ouve \"tu queres\"." },
    { regra: "No interior, o E e o O finais ficam E e O", ex: "leite → LEI-te · tarde → TAR-de · frio → FRI-o", dica: "Em Porto Alegre se ouve mais \"leitchi\"; na Serra e na Fronteira, \"leite\" com E." },
    { regra: "Na Serra, o RR pode soar como um R fraco", ex: "carro → \"caro\" · cachorro → \"cachoro\"", dica: "Herança do talian, o dialeto dos imigrantes italianos." },
    { regra: "\"Bah\" e \"tchê\" sozinhos já são uma frase", ex: "Bah! · Bah, tchê! · Mas bah!", dica: "O tom diz se é espanto, alegria ou reclamação." },
    { regra: "Na Fronteira, o espanhol entra no meio da conversa", ex: "bueno · y bueno · che", dica: "Do outro lado da rua já é Uruguai ou Argentina." },
  ],

  comidas: [
    { nome: "Churrasco gaúcho", desc: "Carne no espeto ou na grelha, só com sal grosso. A costela fogo de chão assa por horas ao redor da fogueira.", pedir: "Me vê uma costela fogo de chão" },
    { nome: "Xis", desc: "O X-burger gaúcho: grande, prensado na chapa e com tudo dentro. Xis coração (de galinha) é o clássico.", pedir: "Me vê um xis coração" },
    { nome: "Chimarrão", desc: "Erva-mate com água quente na cuia, passada de mão em mão. Para pedir mais, devolva a cuia; para parar, diga \"obrigado\".", pedir: "Posso tomar um chimarrão com vocês?" },
    { nome: "Arroz de carreteiro", desc: "Arroz com charque ou sobra de churrasco, prato dos antigos tropeiros.", pedir: "Um carreteiro, por favor" },
    { nome: "Galeto al primo canto", desc: "Frango jovem assado, servido com polenta frita, sopa de capeletti e salada. Clássico da Serra.", pedir: "Um galeto completo pra dois" },
    { nome: "Café colonial", desc: "Mesa farta de pães, cucas, geleias, frios e doces, herança dos imigrantes. Comum na Serra, e serve de almoço.", pedir: "Um café colonial pra dois" },
    { nome: "Cuca", desc: "Bolo de origem alemã com farofa doce por cima; de uva, banana ou goiabada.", pedir: "Me vê uma fatia de cuca de uva" },
    { nome: "Sagu", desc: "Bolinhas de sagu cozidas no vinho tinto, quase sempre com creme. Sobremesa de domingo.", pedir: "Tem sagu com creme?" },
    { nome: "Negrinho & cueca virada", desc: "Negrinho é o brigadeiro; cueca virada é um doce frito de massa, com açúcar e canela.", pedir: "Me vê um negrinho e uma cueca virada" },
    { nome: "Pinhão", desc: "Semente da araucária, cozida ou na chapa. Aparece no outono e no inverno, sobretudo na Serra e no Planalto.", pedir: "Me vê um saquinho de pinhão" },
    { nome: "Quentão gaúcho", desc: "Vinho tinto quente com açúcar e especiarias. Diferente do quentão de cachaça de outros estados.", pedir: "Um quentão, por favor" },
    { nome: "Doces de Pelotas", desc: "Doces finos de tradição portuguesa, como quindim, bem-casado e camafeu. As tradições doceiras da cidade são patrimônio cultural do Brasil.", pedir: "Me vê meia dúzia de doces finos" },
  ],

  lugares: [
    {
      cidade: "Metropolitana e Vales",
      itens: [
        {
          nome: "Mercado Público de Porto Alegre",
          icone: "🏛️",
          dica: "No Centro Histórico: bancas de erva-mate, temperos, peixe e restaurantes no segundo andar. Bom lugar para comprar cuia e erva.",
          frases: [
            { es: "Me vê meio quilo de erva", pt: "Quero meio quilo de erva-mate", pr: "me VÊ MEI-o KI-lo de ER-va", dica: "Erva \"moída grossa\" ou \"fina\": peça para provar antes, se puder." },
          ],
        },
        {
          nome: "Orla do Guaíba",
          icone: "🌅",
          dica: "Programa clássico de Porto Alegre: caminhar ou pedalar na orla e ver o pôr do sol sobre o Guaíba, de chimarrão na mão.",
          frases: [
            { es: "Bah, que pôr do sol!", pt: "Nossa, que pôr do sol!", pr: "BAH, KE POR do SOL!" },
          ],
        },
        {
          nome: "Brique da Redenção",
          icone: "🧺",
          dica: "Feira de antiguidades, artesanato e comida aos domingos, ao lado do Parque Farroupilha, que todo mundo chama de Redenção.",
          frases: [
            { es: "Quanto é essa cuia?", pt: "Quanto custa essa cuia?", pr: "KUAN-to É E-sa KUI-a?" },
          ],
        },
        {
          nome: "São Leopoldo & Novo Hamburgo",
          icone: "👞",
          dica: "Vale dos Sinos, berço da imigração alemã no RS e polo do calçado. Dá para chegar de Trensurb, o trem metropolitano.",
          frases: [
            { es: "Esse trem vai até Novo Hamburgo?", pt: "Esse trem vai até Novo Hamburgo?", pr: "E-se TREM VAI a-TÉ NO-vo AM-bur-go?" },
          ],
        },
      ],
    },
    {
      cidade: "Serra Gaúcha",
      itens: [
        {
          nome: "Gramado",
          icone: "🎄",
          dica: "Rua Coberta, Lago Negro e chocolate. O Natal Luz vai do fim de outubro a janeiro e o Festival de Cinema é em agosto: reserve cedo e espere preço alto.",
          frases: [
            { es: "Tem café colonial por aqui?", pt: "Tem café colonial por aqui?", pr: "TEM ka-FÉ ko-lo-ni-AL por a-KI?" },
          ],
        },
        {
          nome: "Canela",
          icone: "⛪",
          dica: "Catedral de Pedra no centro, que agora tem espetáculo diário de luzes, e a Cascata do Caracol, no parque do mesmo nome.",
          frases: [
            { es: "Que horas começa o show de luzes?", pt: "Que horas começa o show de luzes?", pr: "KE O-ras ko-ME-sa o XOU de LU-zes?" },
          ],
        },
        {
          nome: "Bento Gonçalves & Vale dos Vinhedos",
          icone: "🍷",
          dica: "Vinícolas com degustação, Caminhos de Pedra e o passeio de Maria Fumaça até Garibaldi e Carlos Barbosa. Confira horários com antecedência.",
          frases: [
            { es: "Dá pra fazer degustação?", pt: "Dá pra fazer degustação?", pr: "DÁ pra fa-ZER de-gus-ta-SÃO?" },
          ],
        },
        {
          nome: "Caxias do Sul",
          icone: "🍇",
          dica: "Maior cidade da Serra. A Festa da Uva acontece a cada dois anos, no fim do verão.",
          frases: [
            { es: "Quando é a próxima Festa da Uva?", pt: "Quando é a próxima Festa da Uva?", pr: "KUAN-do É a PRO-si-ma FES-ta da U-va?" },
          ],
        },
        {
          nome: "Cambará do Sul",
          icone: "🏞️",
          dica: "Base para os cânions Itaimbezinho e Fortaleza. Neblina muda tudo: vá cedo e leve casaco mesmo no verão.",
          frases: [
            { es: "Hoje tá com cerração?", pt: "Hoje está com neblina?", pr: "O-je TÁ kom se-rra-SÃO?", dica: "Cerração é como o gaúcho chama a neblina." },
          ],
        },
      ],
    },
    {
      cidade: "Campanha e Fronteira Oeste",
      itens: [
        {
          nome: "Santana do Livramento & Rivera",
          icone: "🇺🇾",
          dica: "Fronteira seca: uma praça separa o Brasil do Uruguai. Os free shops ficam dos dois lados; há cota de compras, então guarde as notas.",
          frases: [
            { es: "De que lado fica o free shop?", pt: "De que lado fica o free shop?", pr: "de KE LA-do FI-ka o FRI XÓP?" },
          ],
        },
        {
          nome: "Bagé",
          icone: "🐎",
          dica: "Coração do Pampa, de estâncias e cavalos crioulos. Bom lugar para ver a cultura campeira de perto.",
          frases: [
            { es: "Dá pra visitar uma estância?", pt: "Dá pra visitar uma fazenda de gado?", pr: "DÁ pra vi-zi-TAR U-ma es-TAN-si-a?" },
          ],
        },
        {
          nome: "Alegrete & Uruguaiana",
          icone: "🌾",
          dica: "Alegrete é a terra de Mario Quintana. Uruguaiana tem a ponte para Paso de los Libres, na Argentina.",
          frases: [
            { es: "Bueno, vamos indo", pt: "Bom, vamos embora", pr: "BUE-no, VA-mos IN-do" },
          ],
        },
      ],
    },
    {
      cidade: "Missões",
      itens: [
        {
          nome: "São Miguel das Missões",
          icone: "⛪",
          dica: "Ruínas da redução jesuítico-guarani de São Miguel Arcanjo, Patrimônio Mundial da Unesco. À noite costuma haver o espetáculo Som e Luz: confirme o horário na cidade.",
          frases: [
            { es: "Que horas é o Som e Luz?", pt: "Que horas é o espetáculo Som e Luz?", pr: "KE O-ras É o SOM e LUZ?" },
          ],
        },
        {
          nome: "Santo Ângelo",
          icone: "🕍",
          dica: "A catedral da praça foi inspirada na igreja de São Miguel. É a porta de entrada da região.",
          frases: [
            { es: "Onde sai o ônibus pra São Miguel?", pt: "De onde sai o ônibus pra São Miguel?", pr: "ON-de SAI o Ô-ni-bus pra SÃO mi-GEL?" },
          ],
        },
        {
          nome: "São Borja",
          icone: "📜",
          dica: "Terra de Getúlio Vargas e de João Goulart, com museus sobre os dois.",
          frases: [
            { es: "Onde fica o museu do Getúlio?", pt: "Onde fica o museu do Getúlio Vargas?", pr: "ON-de FI-ka o mu-ZEU do je-TU-li-o?" },
          ],
        },
      ],
    },
    {
      cidade: "Planalto Médio e Norte",
      itens: [
        {
          nome: "Passo Fundo",
          icone: "📚",
          dica: "Capital Nacional da Literatura, por lei. Maior cidade do norte gaúcho e polo de serviços do agro.",
          frases: [
            { es: "O piá quer ir na livraria", pt: "O menino quer ir à livraria", pr: "o pi-Á KER IR na li-vra-RI-a" },
          ],
        },
        {
          nome: "Cruz Alta",
          icone: "🖋️",
          dica: "Terra natal de Erico Verissimo, com casa-museu do escritor.",
          frases: [
            { es: "A casa do Erico abre hoje?", pt: "A casa-museu do Erico Verissimo abre hoje?", pr: "a KA-za do É-ri-ko A-bre O-je?" },
          ],
        },
        {
          nome: "Erechim & Carazinho",
          icone: "🚜",
          dica: "Cidades do agro e das cooperativas. Em março, a feira Expodireto, em Não-Me-Toque, reúne o setor.",
          frases: [
            { es: "Tem pinhão na chapa?", pt: "Tem pinhão na chapa?", pr: "TEM pi-NHÃO na CHA-pa?" },
          ],
        },
      ],
    },
    {
      cidade: "Região Central",
      itens: [
        {
          nome: "Santa Maria",
          icone: "🎓",
          dica: "Cidade universitária (UFSM) e militar, no centro do estado. Muito estudante, bar e vida noturna.",
          frases: [
            { es: "Tu estuda na UFSM?", pt: "Você estuda na UFSM?", pr: "TU es-TU-da na u-e-fe-e-SE-me?" },
          ],
        },
        {
          nome: "Quarta Colônia",
          icone: "🦕",
          dica: "Colônia italiana perto de Santa Maria e Geoparque Mundial da Unesco, com fósseis de alguns dos dinossauros mais antigos já encontrados.",
          frases: [
            { es: "Onde ficam os fósseis?", pt: "Onde ficam os fósseis?", pr: "ON-de FI-kam os FO-seis?" },
          ],
        },
        {
          nome: "Cachoeira do Sul",
          icone: "🌾",
          dica: "Terra do arroz irrigado, à beira do rio Jacuí.",
          frases: [
            { es: "Tem carreteiro hoje?", pt: "Tem arroz de carreteiro hoje?", pr: "TEM ka-rre-TEI-ro O-je?" },
          ],
        },
      ],
    },
    {
      cidade: "Litoral Norte",
      itens: [
        {
          nome: "Torres",
          icone: "🪨",
          dica: "As praias com falésias do RS, no Parque da Guarita. No inverno, lobos-marinhos descansam na Ilha dos Lobos.",
          frases: [
            { es: "Como chego na Guarita?", pt: "Como chego no Parque da Guarita?", pr: "KO-mo CHE-go na gua-RI-ta?" },
          ],
        },
        {
          nome: "Capão da Canoa & Tramandaí",
          icone: "🏖️",
          dica: "Veraneio gaúcho: muita gente, mar agitado e água mais escura que no Nordeste, por causa dos sedimentos, não de sujeira. Em Tramandaí, botos ajudam os pescadores na barra do rio.",
          frases: [
            { es: "Hoje tá dando nordestão", pt: "Hoje está ventando forte do nordeste", pr: "O-je TÁ DAN-do nor-des-TÃO", dica: "Nordestão é o vento forte que levanta areia e esfria a tarde." },
            { es: "Onde fica o guarda-vidas?", pt: "Onde fica o salva-vidas?", pr: "ON-de FI-ka o guar-da-VI-das?" },
          ],
        },
        {
          nome: "Osório",
          icone: "🌬️",
          dica: "Os grandes cata-ventos do parque eólico aparecem na estrada para a praia. Tem lagoas e morros para voo livre.",
          frases: [
            { es: "Dá pra ver as torres de perto?", pt: "Dá pra ver os cata-ventos de perto?", pr: "DÁ pra VER as TO-rres de PER-to?" },
          ],
        },
      ],
    },
    {
      cidade: "Litoral Sul e Zona Sul",
      itens: [
        {
          nome: "Pelotas",
          icone: "🍮",
          dica: "Casarões do século XIX e os doces finos de tradição portuguesa. A Fenadoce é a festa do doce; o Laranjal é a praia na Lagoa dos Patos.",
          frases: [
            { es: "Me vê meia dúzia de quindim", pt: "Quero seis quindins", pr: "me VÊ MEI-a DU-zia de kin-DIM" },
          ],
        },
        {
          nome: "Rio Grande & Cassino",
          icone: "⚓",
          dica: "Cidade mais antiga do RS e porto do estado. O Cassino é uma das praias mais extensas do mundo; nos Molhes da Barra, as vagonetas andam a vela sobre os trilhos.",
          frases: [
            { es: "Quanto é a vagoneta?", pt: "Quanto custa o passeio de vagoneta?", pr: "KUAN-to É a va-go-NE-ta?" },
          ],
        },
        {
          nome: "São Lourenço do Sul",
          icone: "🛶",
          dica: "Praias de lagoa na Lagoa dos Patos e colônias de imigrantes pomeranos.",
          frases: [
            { es: "A água da lagoa tá boa?", pt: "A água da lagoa está boa pra nadar?", pr: "a A-gua da la-GO-a TÁ BO-a?" },
          ],
        },
      ],
    },
  ],
  // História: o primeiro item vale para o estado todo; os outros 8 são as regiões e apontam para ele em `base`.
  historias: [
    {
      id: "rio-grande-do-sul",
      titulo: "Rio Grande do Sul",
      icone: "🧉",
      intro: "Terra de fronteira disputada por portugueses, espanhóis e guaranis, palco de uma república de dez anos e feita por imigrantes. É o que une as 8 regiões.",
      momentos: [
        { data: "1626", titulo: "Os jesuítas chegam", texto: "Os padres jesuítas fundam as primeiras reduções guaranis no território, que depois formariam os Sete Povos das Missões." },
        { data: "1737", titulo: "Forte de Rio Grande", texto: "O brigadeiro José da Silva Pais ergue o forte Jesus-Maria-José na barra da Lagoa dos Patos. É a origem de Rio Grande, a cidade mais antiga do estado." },
        { data: "1752", titulo: "Casais açorianos", texto: "Famílias vindas dos Açores chegam e se instalam no Porto dos Casais, que vira Porto Alegre." },
        { data: "1750 a 1756", titulo: "Tratado de Madri e Guerra Guaranítica", texto: "A troca de territórios entre Portugal e Espanha manda os guaranis deixarem os Sete Povos. Eles resistem, e Sepé Tiaraju morre em 1756." },
        { data: "1824", titulo: "Chegam os alemães", texto: "Em 25 de julho, imigrantes alemães chegam a São Leopoldo, e o dia ficou como Dia do Colono." },
        { data: "1835 a 1845", titulo: "Revolução Farroupilha", texto: "Os gaúchos se rebelam contra o governo do Império, proclamam a República Rio-Grandense em 1836 e fazem a paz em 1845." },
        { data: "1865", titulo: "Guerra do Paraguai", texto: "Em setembro, as tropas paraguaias que invadiram o estado se rendem em Uruguaiana." },
        { data: "1875", titulo: "Chegam os italianos", texto: "As primeiras famílias italianas ocupam as colônias da Serra, que originam Caxias do Sul e Bento Gonçalves." },
        { data: "1893 a 1895", titulo: "Revolução Federalista", texto: "Guerra civil entre federalistas e republicanos, uma das mais violentas da história do estado." },
        { data: "1930", titulo: "Getúlio no poder", texto: "O gaúcho Getúlio Vargas lidera a Revolução de 1930 e governa o país por 15 anos." },
        { data: "1961", titulo: "Campanha da Legalidade", texto: "Leonel Brizola resiste ao golpe que tentava impedir a posse de João Goulart, também gaúcho." },
        { data: "2024", titulo: "Enchentes de maio", texto: "Chuvas históricas inundam grande parte do estado, incluindo Porto Alegre e o Vale do Taquari, e a reconstrução continua." },
      ],
      costumes: [
        { titulo: "Chimarrão", texto: "Bebida de todo dia, bebida de roda. Quem serve passa a cuia, não se mexe na bomba e \"obrigado\" quer dizer que você não quer mais." },
        { titulo: "Churrasco", texto: "Carne no espeto, sal grosso e brasa. Vale para a Campanha, para a Serra e para o litoral." },
        { titulo: "CTG e tradição", texto: "O 35 CTG, de Porto Alegre, foi fundado em 1948 e deu origem ao movimento tradicionalista que espalhou centros de tradição pelo estado e pelo país." },
        { titulo: "Fala própria", texto: "\"Bah\", \"tchê\" e \"tri\" aparecem em todo o estado. O \"tu\" com verbo de \"você\" também." },
        { titulo: "Imigrantes de todo lado", texto: "Além dos açorianos, alemães e italianos, o estado recebeu poloneses, judeus, japoneses, libaneses, africanos e outros povos." },
      ],
      pessoas: [
        { nome: "Sepé Tiaraju", origem: "Povo guarani, século XVIII", texto: "Líder guarani morto em 7 de fevereiro de 1756. A frase \"Esta terra tem dono\" é atribuída a ele." },
        { nome: "Bento Gonçalves", origem: "Triunfo, 1788", texto: "Foi o presidente da República Rio-Grandense e o principal líder da Revolução Farroupilha." },
        { nome: "Anita Garibaldi", origem: "Laguna (SC), 1821", texto: "Lutou ao lado de Giuseppe Garibaldi na Revolução Farroupilha e virou símbolo dela." },
        { nome: "Getúlio Vargas", origem: "São Borja, 1882", texto: "Presidente do Brasil de 1930 a 1945 e de 1951 a 1954." },
        { nome: "Leonel Brizola", origem: "Carazinho, 1922", texto: "Governador do estado e líder da Campanha da Legalidade." },
      ],
      estrelas: [
        { nome: "Mario Quintana", area: "Poesia", origem: "Alegrete, 1906", texto: "Poeta de verso simples, morou boa parte da vida no Hotel Majestic, em Porto Alegre." },
        { nome: "Érico Veríssimo", area: "Literatura", origem: "Cruz Alta, 1905", texto: "Autor de O Tempo e o Vento, que conta a história do estado por gerações." },
        { nome: "Lupicínio Rodrigues", area: "Música", origem: "Porto Alegre, 1914", texto: "O mestre da dor de cotovelo, autor de Nervos de Aço e Volta." },
        { nome: "Elis Regina", area: "Música", origem: "Porto Alegre, 1945", texto: "Uma das maiores cantoras do Brasil." },
        { nome: "Ronaldinho Gaúcho", area: "Futebol", origem: "Porto Alegre, 1980", texto: "Craque revelado no Grêmio, foi campeão do mundo em 2002." },
      ],
      datas: [
        { data: "2 de fevereiro", titulo: "Nossa Senhora dos Navegantes", texto: "Procissão no Guaíba, em Porto Alegre." },
        { data: "25 de julho", titulo: "Dia do Colono", texto: "Marca a chegada dos alemães a São Leopoldo, em 1824." },
        { data: "11 de setembro", titulo: "República Rio-Grandense", texto: "Proclamada em 1836, depois da vitória no Seival." },
        { data: "20 de setembro", titulo: "Dia do Gaúcho", texto: "Feriado estadual, em lembrança do início da Revolução Farroupilha, em 1835. Acampamentos e desfiles tomam o estado." },
        { data: "Fim de agosto", titulo: "Expointer", texto: "A maior feira agropecuária do estado, em Esteio." },
      ],
      fontes: [
        { titulo: "Wikipédia: Rio Grande do Sul", url: "https://pt.wikipedia.org/wiki/Rio_Grande_do_Sul" },
        { titulo: "Wikipédia: História do Rio Grande do Sul", url: "https://pt.wikipedia.org/wiki/Hist%C3%B3ria_do_Rio_Grande_do_Sul" },
        { titulo: "Wikipédia: Revolução Farroupilha", url: "https://pt.wikipedia.org/wiki/Revolu%C3%A7%C3%A3o_Farroupilha" },
        { titulo: "Wikipédia: Sepé Tiaraju", url: "https://pt.wikipedia.org/wiki/Sep%C3%A9_Tiaraju" },
        { titulo: "Wikipédia: Imigração alemã no Rio Grande do Sul", url: "https://pt.wikipedia.org/wiki/Imigra%C3%A7%C3%A3o_alem%C3%A3_no_Rio_Grande_do_Sul" },
        { titulo: "Wikipédia: Imigração italiana no Rio Grande do Sul", url: "https://pt.wikipedia.org/wiki/Imigra%C3%A7%C3%A3o_italiana_no_Rio_Grande_do_Sul" },
      ],
    },
    {
      id: "metropolitana",
      base: "rio-grande-do-sul",
      titulo: "Metropolitana e Vales",
      icone: "🌅",
      intro: "Porto Alegre, nascida de casais açorianos, e os vales do Sinos e do Taquari, onde os alemães fundaram as primeiras colônias.",
      momentos: [
        { data: "1752", titulo: "Porto dos Casais", texto: "Casais açorianos se instalam na beira do Guaíba, e o lugar vira freguesia em 1772." },
        { data: "1773", titulo: "A capital se muda", texto: "A capital da capitania passa de Viamão para Porto Alegre." },
        { data: "1824", titulo: "São Leopoldo", texto: "Primeira colônia alemã do estado, às margens do rio dos Sinos." },
        { data: "1835", titulo: "Começa a Farroupilha", texto: "Em 20 de setembro, os farroupilhas tomam Porto Alegre, e é o marco do início da revolução." },
        { data: "Século 20", titulo: "Capital do calçado", texto: "O Vale do Sinos, com Novo Hamburgo no centro, se torna o grande polo calçadista do país." },
        { data: "2024", titulo: "Enchentes", texto: "Em maio, as águas do Guaíba e dos rios dos vales chegam a bairros e cidades inteiras." },
      ],
      costumes: [
        { titulo: "Pôr do sol no Guaíba", texto: "Porto-alegrense vai para a orla de cuia na mão e fica até o sol sumir." },
        { titulo: "Brique da Redenção", texto: "Feira de antiguidades e artesanato aos domingos no Parque Farroupilha, a Redenção." },
        { titulo: "Lotação", texto: "É o nome do micro-ônibus que corta a capital. Quem vem de fora estranha o termo." },
      ],
      pessoas: [
        { nome: "Lupicínio Rodrigues", origem: "Porto Alegre, 1914", texto: "O compositor da dor de cotovelo, que também é torcedor símbolo do Grêmio." },
        { nome: "Elis Regina", origem: "Porto Alegre, 1945", texto: "Começou a carreira na capital e virou voz de uma geração." },
      ],
      estrelas: [
        { nome: "Luis Fernando Verissimo", area: "Literatura", origem: "Porto Alegre, 1936", texto: "Cronista e criador das Cobras e das Comédias da Vida Privada." },
      ],
      datas: [
        { data: "2 de fevereiro", titulo: "Navegantes", texto: "Procissão fluvial e festa popular na Zona Norte de Porto Alegre." },
        { data: "25 de julho", titulo: "Dia do Colono", texto: "Festa em São Leopoldo." },
        { data: "20 de setembro", titulo: "Acampamento Farroupilha", texto: "O Parque Harmonia vira acampamento de tradição durante a Semana Farroupilha." },
      ],
      fontes: [
        { titulo: "Wikipédia: Porto Alegre", url: "https://pt.wikipedia.org/wiki/Porto_Alegre" },
        { titulo: "Wikipédia: São Leopoldo", url: "https://pt.wikipedia.org/wiki/S%C3%A3o_Leopoldo" },
        { titulo: "Wikipédia: Novo Hamburgo", url: "https://pt.wikipedia.org/wiki/Novo_Hamburgo" },
        { titulo: "Wikipédia: Lupicínio Rodrigues", url: "https://pt.wikipedia.org/wiki/Lupic%C3%ADnio_Rodrigues" },
      ],
    },
    {
      id: "serra",
      base: "rio-grande-do-sul",
      titulo: "Serra Gaúcha",
      icone: "🍇",
      intro: "Colônias italianas e alemãs nas encostas frias do nordeste do estado, famosas pelo vinho, pelo galeto e pelo Natal de Gramado.",
      momentos: [
        { data: "1875", titulo: "Os italianos chegam", texto: "As primeiras famílias ocupam as colônias Dona Isabel e Conde d'Eu, que viram Bento Gonçalves e Garibaldi." },
        { data: "1890", titulo: "Caxias do Sul", texto: "A colônia de Campo dos Bugres, fundada em 1875, é elevada a município." },
        { data: "1931", titulo: "Primeira Festa da Uva", texto: "Caxias comemora o vinho e a colheita, em tradição que continua até hoje." },
        { data: "1973", titulo: "Festival de Cinema de Gramado", texto: "Nasce o festival, que ajudou a transformar a cidade em destino de turismo." },
        { data: "2002", titulo: "Vale dos Vinhedos", texto: "Recebe a primeira Indicação de Procedência de vinhos do Brasil." },
      ],
      costumes: [
        { titulo: "Talian", texto: "Dialeto de origem vêneta falado pelos descendentes de imigrantes. Foi reconhecido como Referência Cultural Brasileira em 2014." },
        { titulo: "Café colonial e galeto", texto: "Mesa farta de pães, queijos, cucas e embutidos, e o galeto al primo canto, assado na brasa." },
        { titulo: "Frio e neve rara", texto: "A Serra tem o inverno mais frio do estado, com geada forte e chance de neve em alguns anos." },
      ],
      pessoas: [
        { nome: "Bento Gonçalves da Silva", origem: "Triunfo, 1788", texto: "O líder farroupilha dá nome a uma das principais cidades da Serra." },
      ],
      estrelas: [],
      datas: [
        { data: "Fevereiro a março", titulo: "Festa da Uva", texto: "Em Caxias do Sul, a cada dois anos." },
        { data: "Final do ano", titulo: "Natal Luz", texto: "Gramado se enche de luzes, desfiles e espetáculos." },
      ],
      fontes: [
        { titulo: "Wikipédia: Serra Gaúcha", url: "https://pt.wikipedia.org/wiki/Serra_Ga%C3%BAcha" },
        { titulo: "Wikipédia: Caxias do Sul", url: "https://pt.wikipedia.org/wiki/Caxias_do_Sul" },
        { titulo: "Wikipédia: Bento Gonçalves", url: "https://pt.wikipedia.org/wiki/Bento_Gon%C3%A7alves" },
        { titulo: "Wikipédia: Gramado", url: "https://pt.wikipedia.org/wiki/Gramado" },
        { titulo: "Wikipédia: Dialeto talian", url: "https://pt.wikipedia.org/wiki/Dialeto_talian" },
      ],
    },
    {
      id: "campanha",
      base: "rio-grande-do-sul",
      titulo: "Campanha e Fronteira Oeste",
      icone: "🐎",
      intro: "O Pampa das estâncias e dos peões, com cidades gêmeas do outro lado da fronteira e uma história de guerras.",
      momentos: [
        { data: "Século 18", titulo: "Estâncias e gado", texto: "Grandes propriedades para criar gado sustentam a economia da região até hoje." },
        { data: "1777", titulo: "Santo Ildefonso", texto: "Tratado entre Portugal e Espanha que fixa a fronteira sul do Brasil, com mudanças depois." },
        { data: "1836", titulo: "Seival", texto: "Vitória farroupilha que leva à proclamação da República Rio-Grandense." },
        { data: "1865", titulo: "Rendição em Uruguaiana", texto: "As tropas paraguaias se rendem na cidade, na presença do imperador Dom Pedro II." },
        { data: "Séculos 19 e 20", titulo: "Fronteira seca", texto: "Em Santana do Livramento e Rivera, a divisa é uma rua, e o povo vai e volta a pé." },
      ],
      costumes: [
        { titulo: "Vida de peão", texto: "O trabalho no campo, a bombacha de uso diário e o cavalo fazem parte do dia a dia." },
        { titulo: "Português e espanhol", texto: "Na fronteira, a fala mistura as duas línguas, e muita gente vive dos dois lados." },
        { titulo: "Carreteiro e assado", texto: "Pratos de panela e de brasa pensados para quem passa o dia no campo." },
      ],
      pessoas: [
        { nome: "João Paixão Côrtes", origem: "Santana do Livramento, 1927", texto: "Folclorista que ajudou a fundar o 35 CTG e a organizar o tradicionalismo gaúcho." },
      ],
      estrelas: [
        { nome: "Mario Quintana", area: "Poesia", origem: "Alegrete, 1906", texto: "O poeta nasceu na Campanha e ficou famoso por versos curtos." },
      ],
      datas: [
        { data: "18 de setembro", titulo: "Uruguaiana", texto: "Lembrança da rendição das tropas paraguaias, em 1865." },
      ],
      fontes: [
        { titulo: "Wikipédia: Campanha Gaúcha", url: "https://pt.wikipedia.org/wiki/Campanha_Ga%C3%BAcha" },
        { titulo: "Wikipédia: Santana do Livramento", url: "https://pt.wikipedia.org/wiki/Santana_do_Livramento" },
        { titulo: "Wikipédia: Uruguaiana", url: "https://pt.wikipedia.org/wiki/Uruguaiana" },
        { titulo: "Wikipédia: Bagé", url: "https://pt.wikipedia.org/wiki/Bag%C3%A9" },
        { titulo: "Wikipédia: Alegrete", url: "https://pt.wikipedia.org/wiki/Alegrete" },
      ],
    },
    {
      id: "missoes",
      base: "rio-grande-do-sul",
      titulo: "Missões",
      icone: "⛪",
      intro: "As reduções jesuítico-guaranis, a luta de Sepé Tiaraju e as ruínas de São Miguel, Patrimônio da Humanidade.",
      momentos: [
        { data: "1626", titulo: "Primeiras reduções", texto: "O padre Roque González funda São Nicolau, a primeira redução do atual Rio Grande do Sul." },
        { data: "1682 a 1707", titulo: "Os Sete Povos", texto: "Os jesuítas e os guaranis erguem São Borja, São Nicolau, São Luiz Gonzaga, São Lourenço, São Miguel, São João e Santo Ângelo." },
        { data: "1750", titulo: "Tratado de Madri", texto: "Portugal e Espanha trocam territórios e mandam os guaranis deixar os Sete Povos." },
        { data: "1756", titulo: "Morte de Sepé Tiaraju", texto: "O líder guarani morre em fevereiro, e o exército luso-espanhol vence a resistência em Caiboaté." },
        { data: "1983", titulo: "Patrimônio da Humanidade", texto: "A Unesco reconhece as ruínas de São Miguel das Missões." },
      ],
      costumes: [
        { titulo: "Música missioneira", texto: "Estilo próprio do gauchismo, com raízes guaranis, que celebra a vida no campo e nas ruínas." },
        { titulo: "Nomes guaranis", texto: "Muitos nomes de cidades, rios e pessoas vêm do guarani." },
        { titulo: "Som e Luz", texto: "Em São Miguel, um espetáculo à noite conta a história das reduções nas ruínas." },
      ],
      pessoas: [
        { nome: "Sepé Tiaraju", origem: "Região dos Sete Povos, século XVIII", texto: "Corregedor guarani de São Miguel, morreu em 1756 e virou símbolo de resistência." },
        { nome: "Roque González", origem: "Assunção, 1576", texto: "Jesuíta que fundou as primeiras reduções da região e foi morto em 1628. É santo católico." },
        { nome: "Getúlio Vargas", origem: "São Borja, 1882", texto: "Nascido em São Borja, voltou lá depois de deixar a presidência." },
      ],
      estrelas: [
        { nome: "Noel Guarany", area: "Música", origem: "Bossoroca, 1941", texto: "Cantor e compositor que levou a música missioneira para o resto do estado." },
      ],
      datas: [
        { data: "7 de fevereiro", titulo: "Morte de Sepé Tiaraju", texto: "Data lembrada em toda a região." },
      ],
      fontes: [
        { titulo: "Wikipédia: Sete Povos das Missões", url: "https://pt.wikipedia.org/wiki/Sete_Povos_das_Miss%C3%B5es" },
        { titulo: "Wikipédia: Ruínas de São Miguel das Missões", url: "https://pt.wikipedia.org/wiki/Ru%C3%ADnas_de_S%C3%A3o_Miguel_das_Miss%C3%B5es" },
        { titulo: "Wikipédia: Sepé Tiaraju", url: "https://pt.wikipedia.org/wiki/Sep%C3%A9_Tiaraju" },
        { titulo: "Wikipédia: São Borja", url: "https://pt.wikipedia.org/wiki/S%C3%A3o_Borja" },
      ],
    },
    {
      id: "planalto",
      base: "rio-grande-do-sul",
      titulo: "Planalto Médio e Norte",
      icone: "🌾",
      intro: "Rota dos tropeiros, terra do pinhão e da erva-mate, hoje coração do agronegócio e da literatura gaúcha.",
      momentos: [
        { data: "Século 18", titulo: "Tropeiros", texto: "As tropas de mulas e gado do Sul passam pela região a caminho de Sorocaba, em São Paulo." },
        { data: "1857", titulo: "Passo Fundo", texto: "O povoado nascido em torno do passo do rio vira município." },
        { data: "Início do século 20", titulo: "Novas colônias", texto: "Imigrantes italianos, alemães, poloneses e outros povos ocupam as matas do norte, como em Erechim." },
        { data: "Século 20", titulo: "Soja e trigo", texto: "Cooperativas e lavouras mecanizadas transformam o planalto num dos celeiros do país." },
        { data: "1981", titulo: "Jornada de Literatura", texto: "Passo Fundo cria a Jornada Nacional de Literatura, que se tornou um dos grandes eventos do gênero." },
      ],
      costumes: [
        { titulo: "Pinhão", texto: "A semente da araucária é cozida ou assada na chapa e é petisco do inverno." },
        { titulo: "Erva-mate", texto: "A erva cancheada abastece o chimarrão do estado todo." },
        { titulo: "Piá", texto: "No norte do estado, \"piá\" é o garoto, palavra que o resto do Brasil conhece de outras regiões." },
      ],
      pessoas: [
        { nome: "Érico Veríssimo", origem: "Cruz Alta, 1905", texto: "Escritor de O Tempo e o Vento, cuja história tem Cruz Alta como inspiração." },
        { nome: "Leonel Brizola", origem: "Carazinho, 1922", texto: "Político gaúcho que nasceu no norte do estado." },
      ],
      estrelas: [],
      datas: [
        { data: "Fevereiro a março", titulo: "Expodireto Cotrijal", texto: "A feira do agronegócio de Não-Me-Toque reúne produtores de todo o país." },
      ],
      fontes: [
        { titulo: "Wikipédia: Passo Fundo", url: "https://pt.wikipedia.org/wiki/Passo_Fundo" },
        { titulo: "Wikipédia: Erechim", url: "https://pt.wikipedia.org/wiki/Erechim" },
        { titulo: "Wikipédia: Cruz Alta", url: "https://pt.wikipedia.org/wiki/Cruz_Alta_(Rio_Grande_do_Sul)" },
        { titulo: "Wikipédia: Tropeirismo", url: "https://pt.wikipedia.org/wiki/Tropeirismo" },
      ],
    },
    {
      id: "central",
      base: "rio-grande-do-sul",
      titulo: "Região Central",
      icone: "🚂",
      intro: "Santa Maria, cidade de trilhos e de universidade, a Quarta Colônia italiana e os fósseis de dinossauros mais antigos do país.",
      momentos: [
        { data: "1858", titulo: "Santa Maria", texto: "O povoado se torna município e ganha importância pelos trilhos." },
        { data: "1877", titulo: "Quarta Colônia", texto: "Imigrantes italianos ocupam as terras de Silveira Martins e arredores." },
        { data: "1885", titulo: "A ferrovia", texto: "A linha de trem chega a Santa Maria, que se torna o centro ferroviário do Sul." },
        { data: "1960", titulo: "Universidade Federal", texto: "Nasce a UFSM, uma das primeiras universidades federais do interior do país." },
      ],
      costumes: [
        { titulo: "Cidade universitária", texto: "Estudantes de todo o estado e do país mudam o ritmo da cidade." },
        { titulo: "Paleontologia", texto: "Os sítios do Triássico guardam fósseis de dinossauros entre os mais antigos conhecidos." },
        { titulo: "Quarta Colônia", texto: "Cantinas, vinho e talian de novo, num trecho menos turístico que a Serra." },
      ],
      pessoas: [],
      estrelas: [],
      datas: [],
      fontes: [
        { titulo: "Wikipédia: Santa Maria", url: "https://pt.wikipedia.org/wiki/Santa_Maria_(Rio_Grande_do_Sul)" },
        { titulo: "Wikipédia: Quarta Colônia", url: "https://pt.wikipedia.org/wiki/Quarta_Col%C3%B4nia_de_Imigra%C3%A7%C3%A3o_Italiana" },
        { titulo: "Wikipédia: Cachoeira do Sul", url: "https://pt.wikipedia.org/wiki/Cachoeira_do_Sul" },
      ],
    },
    {
      id: "litoral-norte",
      base: "rio-grande-do-sul",
      titulo: "Litoral Norte",
      icone: "🏖️",
      intro: "A praia dos gaúchos: de Torres a Tramandaí, o veraneio de dezembro a fevereiro e o vento que não para.",
      momentos: [
        { data: "Século 18", titulo: "Caminho das tropas", texto: "Tropeiros sobem pela faixa de areia entre o litoral e a lagoa a caminho de Laguna e do norte." },
        { data: "Século 20", titulo: "Veraneio", texto: "Com a chegada das estradas, as praias viram o destino de verão da população do estado." },
        { data: "2006", titulo: "Parque Eólico de Osório", texto: "Inaugurado, foi um dos maiores do tipo na América Latina na época." },
      ],
      costumes: [
        { titulo: "Ir pra praia", texto: "Para o gaúcho, \"a praia\" é o litoral norte inteiro." },
        { titulo: "Mar frio", texto: "A água é fria e escura, e o nordestão sopra forte nas tardes de verão." },
        { titulo: "Guarda-vidas", texto: "Respeitar as bandeiras e as faixas sinalizadas é regra por causa das correntes de retorno." },
      ],
      pessoas: [],
      estrelas: [],
      datas: [
        { data: "Dezembro a fevereiro", titulo: "Veraneio", texto: "O litoral lota, e o trânsito na BR-101 e nas estradas do mar cresce." },
      ],
      fontes: [
        { titulo: "Wikipédia: Torres", url: "https://pt.wikipedia.org/wiki/Torres_(Rio_Grande_do_Sul)" },
        { titulo: "Wikipédia: Tramandaí", url: "https://pt.wikipedia.org/wiki/Tramanda%C3%AD" },
        { titulo: "Wikipédia: Osório", url: "https://pt.wikipedia.org/wiki/Os%C3%B3rio_(Rio_Grande_do_Sul)" },
        { titulo: "Wikipédia: Capão da Canoa", url: "https://pt.wikipedia.org/wiki/Cap%C3%A3o_da_Canoa" },
      ],
    },
    {
      id: "litoral-sul",
      base: "rio-grande-do-sul",
      titulo: "Litoral Sul e Zona Sul",
      icone: "🍮",
      intro: "A região mais antiga do estado: o porto de Rio Grande, as charqueadas e os doces de Pelotas, a Lagoa dos Patos e a longa praia do Cassino.",
      momentos: [
        { data: "1737", titulo: "Rio Grande", texto: "Silva Pais ergue o forte na barra, e nasce a primeira cidade do estado." },
        { data: "1812", titulo: "Pelotas", texto: "A freguesia de São Francisco de Paula é criada nas margens do arroio Pelotas." },
        { data: "Século 19", titulo: "Charqueadas", texto: "A carne seca de Pelotas enriquece os charqueadores, com trabalho de pessoas escravizadas, e financia os casarões." },
        { data: "Século 19", titulo: "Pomeranos", texto: "Imigrantes pomeranos chegam a São Lourenço do Sul e arredores." },
        { data: "2018", titulo: "Doces de Pelotas", texto: "A tradição doceira de Pelotas e da Antiga Pelotas é registrada como patrimônio imaterial pelo Iphan." },
      ],
      costumes: [
        { titulo: "Doces de herança portuguesa", texto: "Quindim, ambrosia, pastel de Santa Clara e ninhos, feitos com ovos e açúcar." },
        { titulo: "Praia do Cassino", texto: "Uma das mais extensas praias contínuas do mundo, onde se pode andar de carro na areia." },
        { titulo: "Fronteira com o Uruguai", texto: "Jaguarão e Chuí ficam coladas em Rio Branco e Chuy, no extremo sul do país." },
      ],
      pessoas: [
        { nome: "José da Silva Pais", origem: "Portugal, século XVIII", texto: "Brigadeiro que fundou o forte de Rio Grande em 1737." },
        { nome: "João Simões Lopes Neto", origem: "Pelotas, 1865", texto: "Autor de Contos Gauchescos e Lendas do Sul, clássicos da literatura regional." },
      ],
      estrelas: [],
      datas: [
        { data: "19 de fevereiro", titulo: "Aniversário de Rio Grande", texto: "A cidade lembra a chegada de Silva Pais, em 1737." },
        { data: "7 de julho", titulo: "Aniversário de Pelotas", texto: "A cidade celebra a data de criação da freguesia, em 1812." },
      ],
      fontes: [
        { titulo: "Wikipédia: Rio Grande", url: "https://pt.wikipedia.org/wiki/Rio_Grande_(Rio_Grande_do_Sul)" },
        { titulo: "Wikipédia: Pelotas", url: "https://pt.wikipedia.org/wiki/Pelotas" },
        { titulo: "Wikipédia: Praia do Cassino", url: "https://pt.wikipedia.org/wiki/Praia_do_Cassino" },
        { titulo: "Wikipédia: Simões Lopes Neto", url: "https://pt.wikipedia.org/wiki/Sim%C3%B5es_Lopes_Neto" },
        { titulo: "Wikipédia: São Lourenço do Sul", url: "https://pt.wikipedia.org/wiki/S%C3%A3o_Louren%C3%A7o_do_Sul" },
      ],
    },
  ],
  // Quiz: "turista" vale para o estado todo e "viajante" tem perguntas das 8 regiões. Os ids reaproveitam a arte dos níveis do app.
  quiz: [
    {
      id: "turista",
      titulo: "Forasteiro",
      icone: "🧉",
      descricao: "O estado todo: palavras, costumes e história que qualquer visitante encontra.",
      perguntas: [
        { pergunta: "Qual é o feriado estadual do Dia do Gaúcho?", certa: "20 de setembro", erradas: ["7 de setembro", "15 de novembro", "21 de abril"], explica: "Lembra o início da Revolução Farroupilha, em 1835." },
        { pergunta: "Na roda de chimarrão, o que quer dizer \"obrigado\" ao devolver a cuia?", certa: "Que você não quer mais", erradas: ["Que você quer mais", "Que a água está fria", "Que é a vez de outra pessoa servir"], explica: "Quem quer continuar na roda só devolve a cuia, sem agradecer." },
        { pergunta: "O que o gaúcho quer dizer com \"capaz!\"?", certa: "De jeito nenhum, imagina", erradas: ["Que você é muito talentoso", "Combinado, vamos nessa", "Talvez, depois a gente vê"], explica: "É resposta para um agradecimento ou um pedido: \"Obrigado!\" \"Capaz!\"." },
        { pergunta: "O que é um \"cacetinho\"?", certa: "Pão francês", erradas: ["Bolo de fubá", "Bolacha recheada", "Pão doce de padaria"], explica: "Na padaria, o gaúcho pede \"me vê dois cacetinhos\"." },
        { pergunta: "O que é \"bergamota\" no RS?", certa: "Mexerica", erradas: ["Abacate", "Limão", "Maracujá"], explica: "Em outros estados a fruta é chamada de mexerica ou tangerina." },
        { pergunta: "O que é um \"xis\" no cardápio?", certa: "Um sanduíche grande, prensado na chapa", erradas: ["Uma bebida gelada", "Um corte de carne", "Uma sobremesa"], explica: "É o X-burger gaúcho: xis coração, xis salada, xis tudo." },
        { pergunta: "O que é \"cueca virada\" na padaria?", certa: "Um doce frito de massa, passado no açúcar", erradas: ["Uma peça de roupa típica", "Um tipo de bombacha", "Um prato de carne assada"], explica: "Nada de roupa: é um bolinho frito com açúcar e canela." },
        { pergunta: "O que é uma \"torrada\" no RS?", certa: "Um misto-quente na chapa", erradas: ["Pão tostado com manteiga", "Uma torta de carne", "Um tipo de biscoito"], explica: "Se quiser só o pão tostado, é melhor explicar ao pedir." },
        { pergunta: "O que é uma \"lotação\"?", certa: "Um micro-ônibus", erradas: ["Uma lotação de teatro", "Um tipo de táxi de aplicativo", "Um barco do Guaíba"], explica: "O termo é bem usado em Porto Alegre." },
        { pergunta: "O que é o minuano?", certa: "Um vento frio que vem do sul", erradas: ["Um tipo de chimarrão", "Uma dança tradicional", "Um prato de carne"], explica: "É o vento do inverno gaúcho, que faz o frio parecer ainda maior." },
        { pergunta: "Em que ano a República Rio-Grandense foi proclamada?", certa: "1836", erradas: ["1822", "1889", "1930"], explica: "Foi depois da vitória farroupilha no Seival, em 1836." },
        { pergunta: "Quem foi o presidente da República Rio-Grandense?", certa: "Bento Gonçalves", erradas: ["Getúlio Vargas", "Sepé Tiaraju", "Leonel Brizola"], explica: "Bento Gonçalves foi o principal líder da Revolução Farroupilha." },
        { pergunta: "Em que cidade nasceu Getúlio Vargas?", certa: "São Borja", erradas: ["Pelotas", "Caxias do Sul", "Passo Fundo"], explica: "São Borja fica nas Missões e também é terra de João Goulart." },
        { pergunta: "Qual é a cidade mais antiga do estado?", certa: "Rio Grande", erradas: ["Porto Alegre", "Pelotas", "Santa Maria"], explica: "Nasceu do forte erguido por Silva Pais, em 1737." },
        { pergunta: "Para qual cidade chegaram os primeiros imigrantes alemães, em 1824?", certa: "São Leopoldo", erradas: ["Caxias do Sul", "Gramado", "Pelotas"], explica: "A data, 25 de julho, é o Dia do Colono." },
        { pergunta: "Qual poeta gaúcho nasceu em Alegrete?", certa: "Mario Quintana", erradas: ["Érico Veríssimo", "Lupicínio Rodrigues", "Simões Lopes Neto"], explica: "Quintana ficou famoso por versos curtos e viveu muito tempo em Porto Alegre." },
        { pergunta: "Quem escreveu O Tempo e o Vento?", certa: "Érico Veríssimo", erradas: ["Mario Quintana", "Luis Fernando Verissimo", "Simões Lopes Neto"], explica: "A saga conta a história do estado ao longo de gerações." },
        { pergunta: "Em que cidade acontece a Expointer?", certa: "Esteio", erradas: ["Gramado", "Torres", "Pelotas"], explica: "É a maior feira agropecuária do estado, entre o fim do inverno e o começo da primavera." },
      ],
    },
    {
      id: "viajante",
      titulo: "Rodando o estado",
      icone: "🗺️",
      descricao: "Perguntas das 8 regiões, da Serra ao litoral e das Missões à Campanha.",
      perguntas: [
        { pergunta: "Quem se instalou no Porto dos Casais, origem de Porto Alegre, em 1752?", certa: "Casais açorianos", erradas: ["Imigrantes alemães", "Imigrantes italianos", "Imigrantes poloneses"], explica: "Famílias dos Açores fundaram o povoado na beira do Guaíba." },
        { pergunta: "Em que ano a capital da capitania passou de Viamão para Porto Alegre?", certa: "1773", erradas: ["1752", "1835", "1889"], explica: "Porto Alegre ficou como capital e cresceu desde então." },
        { pergunta: "Qual cidade é o centro do polo calçadista do Vale do Sinos?", certa: "Novo Hamburgo", erradas: ["Caxias do Sul", "Pelotas", "Santa Maria"], explica: "O Vale do Sinos virou capital do calçado no século 20." },
        { pergunta: "Em que parque de Porto Alegre acontece o Brique da Redenção?", certa: "Parque Farroupilha", erradas: ["Parque Harmonia", "Parque Marinha do Brasil", "Parque Moinhos de Vento"], explica: "A Redenção é o apelido do Parque Farroupilha, e a feira rola aos domingos." },
        { pergunta: "Onde acontece a procissão de Navegantes, em 2 de fevereiro?", certa: "No Guaíba", erradas: ["No rio Jacuí, em Santa Maria", "Na Lagoa dos Patos", "No rio Uruguai"], explica: "É uma procissão fluvial e festa popular de Porto Alegre." },
        { pergunta: "Em que ano chegaram os primeiros imigrantes italianos à Serra?", certa: "1875", erradas: ["1824", "1850", "1900"], explica: "Eles ocuparam as colônias que originaram Caxias do Sul e Bento Gonçalves." },
        { pergunta: "Qual festa celebra a colheita e o vinho em Caxias do Sul?", certa: "Festa da Uva", erradas: ["Expointer", "Natal Luz", "Festa do Colono"], explica: "A primeira edição foi em 1931." },
        { pergunta: "O que é o talian?", certa: "Um dialeto de origem vêneta falado na Serra", erradas: ["Um dialeto alemão do Vale do Sinos", "Uma língua indígena", "Uma gíria de fronteira"], explica: "Foi reconhecido como Referência Cultural Brasileira em 2014." },
        { pergunta: "O que é um \"galeto al primo canto\"?", certa: "Frango jovem assado na brasa", erradas: ["Sopa de capeletti", "Vinho espumante", "Doce de uva"], explica: "É um dos pratos clássicos da mesa da Serra." },
        { pergunta: "Qual cidade da Serra tem o Festival de Cinema, criado em 1973?", certa: "Gramado", erradas: ["Canela", "Bento Gonçalves", "Santa Maria"], explica: "O festival ajudou a transformar a cidade em destino turístico." },
        { pergunta: "Em que cidade os paraguaios se renderam em 1865, com Dom Pedro II presente?", certa: "Uruguaiana", erradas: ["Bagé", "Alegrete", "Santana do Livramento"], explica: "O episódio marcou o fim da invasão paraguaia ao estado." },
        { pergunta: "Qual cidade gaúcha faz fronteira seca com Rivera, no Uruguai?", certa: "Santana do Livramento", erradas: ["Uruguaiana", "Jaguarão", "Chuí"], explica: "Lá a divisa é uma rua, e o povo vai e volta a pé." },
        { pergunta: "Qual prato de panela é típico da Campanha?", certa: "Carreteiro", erradas: ["Cuca", "Galeto", "Pinhão na chapa"], explica: "É comida de quem passa o dia no campo." },
        { pergunta: "A vitória no Seival levou à proclamação de quê?", certa: "Da República Rio-Grandense", erradas: ["Da Independência do Brasil", "Da Revolução de 1930", "Do fim da Guerra do Paraguai"], explica: "A proclamação foi em 11 de setembro de 1836." },
        { pergunta: "Quem foi o folclorista de Santana do Livramento que ajudou a fundar o 35 CTG?", certa: "João Paixão Côrtes", erradas: ["Noel Guarany", "Simões Lopes Neto", "Lupicínio Rodrigues"], explica: "Ele foi uma das figuras do movimento tradicionalista gaúcho." },
        { pergunta: "Qual frase é atribuída a Sepé Tiaraju?", certa: "\"Esta terra tem dono\"", erradas: ["\"Aqui é o Brasil\"", "\"Tchê, vamos embora\"", "\"Sem pátria e sem lar\""], explica: "Ele liderou a resistência guarani ao Tratado de Madri." },
        { pergunta: "Em que ano as ruínas de São Miguel das Missões se tornaram Patrimônio da Humanidade?", certa: "1983", erradas: ["1950", "1964", "2001"], explica: "O reconhecimento é da Unesco." },
        { pergunta: "Quantos eram os Povos das Missões no atual RS?", certa: "Sete", erradas: ["Três", "Cinco", "Doze"], explica: "São Borja, São Nicolau, São Luiz Gonzaga, São Lourenço, São Miguel, São João e Santo Ângelo." },
        { pergunta: "O que o Tratado de Madri, de 1750, mandou os guaranis fazer?", certa: "Deixar os Sete Povos", erradas: ["Pagar impostos à Espanha", "Defender a fronteira de Portugal", "Construir novas reduções"], explica: "Eles resistiram, e a guerra durou até 1756." },
        { pergunta: "Que estilo de música o cantor Noel Guarany levou para o resto do estado?", certa: "Música missioneira", erradas: ["Tango", "Milonga de fronteira", "Vanerão"], explica: "Tem raízes guaranis e fala da vida no campo e nas ruínas." },
        { pergunta: "Para qual cidade paulista iam as tropas de mulas que passavam pelo Planalto?", certa: "Sorocaba", erradas: ["Rio de Janeiro", "Salvador", "Buenos Aires"], explica: "A rota dos tropeiros ligava o Sul à feira de Sorocaba." },
        { pergunta: "De que árvore vem o pinhão?", certa: "Araucária", erradas: ["Palmeira", "Eucalipto", "Figueira"], explica: "O pinhão é petisco de inverno, cozido ou assado na chapa." },
        { pergunta: "Que cidade criou a Jornada Nacional de Literatura, em 1981?", certa: "Passo Fundo", erradas: ["Erechim", "Cruz Alta", "Carazinho"], explica: "A Jornada é um dos grandes eventos de literatura do país." },
        { pergunta: "Em que cidade nasceu Érico Veríssimo?", certa: "Cruz Alta", erradas: ["Passo Fundo", "Erechim", "Santa Maria"], explica: "A cidade inspirou a Santa Fé de O Tempo e o Vento." },
        { pergunta: "Em que cidade acontece a feira de agronegócio Expodireto Cotrijal?", certa: "Não-Me-Toque", erradas: ["Esteio", "Erechim", "Carazinho"], explica: "A feira reúne produtores do país todo." },
        { pergunta: "Qual cidade da Região Central tem uma das primeiras universidades federais do interior?", certa: "Santa Maria", erradas: ["Cachoeira do Sul", "Caçapava do Sul", "Silveira Martins"], explica: "A UFSM nasceu em 1960 e mudou o ritmo da cidade." },
        { pergunta: "Em que ano a ferrovia chegou a Santa Maria?", certa: "1885", erradas: ["1750", "1824", "1930"], explica: "O trem fez da cidade o centro ferroviário do Sul." },
        { pergunta: "Qual povo ocupou a Quarta Colônia, perto de Santa Maria?", certa: "Italianos", erradas: ["Pomeranos", "Açorianos", "Japoneses"], explica: "Silveira Martins é um dos centros da região." },
        { pergunta: "O que os sítios paleontológicos de Santa Maria guardam?", certa: "Fósseis de dinossauros entre os mais antigos conhecidos", erradas: ["Fósseis de mamutes", "Fósseis de peixes de água doce", "Dentes de tubarões gigantes"], explica: "São fósseis do Triássico." },
        { pergunta: "O que o gaúcho quer dizer quando fala \"a praia\"?", certa: "O litoral norte inteiro", erradas: ["Só a praia de Torres", "A praia do Cassino", "Qualquer praia de lagoa"], explica: "É a expressão para o destino de verão do estado." },
        { pergunta: "Em que cidade fica o parque eólico inaugurado em 2006?", certa: "Osório", erradas: ["Torres", "Tramandaí", "Capão da Canoa"], explica: "Foi um dos maiores da América Latina na época." },
        { pergunta: "Qual vento sopra forte nas tardes de verão do litoral norte?", certa: "O nordestão", erradas: ["O zonda", "O siroco", "A monção"], explica: "Junto com a água fria, é uma marca do mar daqui." },
        { pergunta: "Quando o litoral gaúcho enche de gente?", certa: "De dezembro a fevereiro", erradas: ["De abril a junho", "De junho a agosto", "Em setembro, na Semana Farroupilha"], explica: "É o veraneio, e a BR-101 e as estradas do mar lotam." },
        { pergunta: "Qual parque de Torres é um dos cartões-postais do litoral?", certa: "Parque da Guarita", erradas: ["Parque Farroupilha", "Parque Harmonia", "Parque Marinha do Brasil"], explica: "É um dos pontos mais fotografados do litoral norte." },
        { pergunta: "Quem fundou o forte que deu origem a Rio Grande?", certa: "José da Silva Pais", erradas: ["Sepé Tiaraju", "Bento Gonçalves", "Roque González"], explica: "O forte Jesus-Maria-José é de 1737." },
        { pergunta: "Pelotas é famosa por quais doces?", certa: "Doces de herança portuguesa, como o quindim e o ninho", erradas: ["Doces de colonos alemães, como a cuca", "Doces indígenas de milho", "Doces de leite com pinhão"], explica: "A tradição doceira foi registrada como patrimônio imaterial em 2018." },
        { pergunta: "O que é diferente na praia do Cassino?", certa: "É muito longa, e se pode andar de carro na areia", erradas: ["É a única praia de água quente", "Só pode ser visitada de barco", "Fica dentro de uma ilha"], explica: "É uma das mais extensas praias contínuas do mundo." },
        { pergunta: "Qual livro de Simões Lopes Neto é um clássico regional?", certa: "Contos Gauchescos", erradas: ["O Tempo e o Vento", "A Casa das Sete Mulheres", "Os Sertões"], explica: "O escritor nasceu em Pelotas, em 1865." },
        { pergunta: "O que as charqueadas de Pelotas produziam?", certa: "Charque, a carne seca", erradas: ["Vinho", "Calçados", "Erva-mate"], explica: "A riqueza veio com trabalho de pessoas escravizadas e financiou os casarões." },
        { pergunta: "Jaguarão faz fronteira com qual cidade do Uruguai?", certa: "Rio Branco", erradas: ["Rivera", "Artigas", "Salto"], explica: "O Chuí, mais ao sul, faz fronteira com Chuy." },
      ],
    },
  ],
};
