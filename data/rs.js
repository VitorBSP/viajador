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
};
