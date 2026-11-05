(function () {
  const paises = window.VIAJADOR.paises;
  const $ = (s) => document.querySelector(s);
  const main = $("#conteudo");
  const CHAVE_PAIS = "viajador:pais";
  // O país padrão é o primeiro <script> de dados em index.html. Trocar de país recarrega a página.
  let pais = paises[Object.keys(paises)[0]];
  try { pais = paises[localStorage.getItem(CHAVE_PAIS)] || pais; } catch (e) {}
  // "o Uruguai", "do Uruguai"; sem `artigo`, "de Cuba".
  const comArtigo = pais.artigo ? `${pais.artigo} ${pais.nome}` : pais.nome;
  const doNome = pais.artigo ? `d${pais.artigo} ${pais.nome}` : `de ${pais.nome}`;
  // Idioma das frases. Em lugar que já fala português (o RS), não há o que traduzir: `es` é como se fala
  // por lá e `pt` é o que quer dizer, então somem "Ouvir", "Mostrar" e os textos sobre espanhol.
  const LANG = pais.voz[0];
  const semTraducao = /^pt/i.test(LANG);

  // Favoritos, checklist, quiz e ranking são de cada país. Antes do seletor só existia o Uruguai,
  // então as chaves antigas passam para ":uy"; a antiga só sai depois de copiada.
  const doPais = (chave) => `${chave}:${pais.codigo}`;
  const POR_PAIS = ["viajador:favoritos", "viajador:checklist", "viajador:quiz", "viajador:quiz-vistas", "viajador:ranking"];
  try {
    for (const chave of POR_PAIS) {
      const antigo = localStorage.getItem(chave);
      if (antigo === null) continue;
      if (localStorage.getItem(chave + ":uy") === null) localStorage.setItem(chave + ":uy", antigo);
      if (localStorage.getItem(chave + ":uy") === antigo) localStorage.removeItem(chave);
    }
  } catch (e) {}
  const CHAVE_FAV = doPais("viajador:favoritos");
  const CHAVE_ESCALA = "viajador:escala";
  const CHAVE_CHECK = doPais("viajador:checklist");
  const CHAVE_QUIZ = doPais("viajador:quiz");
  const CHAVE_QUIZ_VISTAS = doPais("viajador:quiz-vistas");
  const RODADA = 10;
  const CHAVE_RANKING = doPais("viajador:ranking");
  const CHAVE_NOME = "viajador:nome";
  // Versão "território.número": 0 = Uruguai, 1 = RS, 2 = o próximo território. O número só cresce (ver docs/VERSOES.md).
  const VERSAO_APP = "1.34";
  const SUPABASE = window.VIAJADOR_SUPABASE || {};
  const supabaseOnline = () => Boolean(SUPABASE.url && SUPABASE.chave);
  // A tabela em supabase/ranking.sql só aceita os níveis do Uruguai; os outros países ficam com o ranking do aparelho.
  const rankingOnline = () => supabaseOnline() && pais.codigo === "uy";
  const TAM_RANKING = 10;
  const ESCALAS = [0.75, 1, 1.25, 1.5, 1.85];
  // Atalhos da tela inicial. O país pode trazer os seus em `rapidas` (com o `es` exato da frase);
  // sem eles, valem estes, em que `chave` é um trecho da frase em espanhol.
  const RAPIDAS = pais.rapidas || [
    { rotulo: "Banheiro", icone: "🚻", chave: "baño" },
    { rotulo: "Conta", icone: "🧾", chave: "la cuenta" },
    { rotulo: "Foto", icone: "📷", chave: "sacás una foto" },
    { rotulo: "Ajuda", icone: "🆘", chave: "ayuda" },
  ];

  // Favoritos ficam no aparelho; tudo funciona mesmo se o armazenamento falhar.
  let favoritos = [];
  try { favoritos = JSON.parse(localStorage.getItem(CHAVE_FAV)) || []; } catch (e) {}
  const salvarFav = () => { try { localStorage.setItem(CHAVE_FAV, JSON.stringify(favoritos)); } catch (e) {} };

  let marcados = [];
  try { marcados = JSON.parse(localStorage.getItem(CHAVE_CHECK)) || []; } catch (e) {}

  // "Quero ir" alimenta o roteiro "Do meu jeito"; "Já fui" alimenta o álbum e tira o lugar do roteiro automático.
  // Os dois guardam o nome do lugar, por país; "Já fui" guarda também a data.
  const CHAVE_QUERO = doPais("viajador:quero-ir");
  const CHAVE_FUI = doPais("viajador:ja-fui");
  let queroIr = [];
  let jaFui = {};
  try { queroIr = JSON.parse(localStorage.getItem(CHAVE_QUERO)) || []; } catch (e) {}
  try { jaFui = JSON.parse(localStorage.getItem(CHAVE_FUI)) || {}; } catch (e) {}
  const salvarMarcas = () => {
    try {
      localStorage.setItem(CHAVE_QUERO, JSON.stringify(queroIr));
      localStorage.setItem(CHAVE_FUI, JSON.stringify(jaFui));
    } catch (e) {}
  };
  const NOME_ALBUM = "Por onde andei";

  const esc =(s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Bandeiras desenhadas, iguais em qualquer sistema. Sem desenho, vale o emoji do dado.
  const BANDEIRAS = {
    uy: '<svg class="bandeira" viewBox="0 0 27 18" role="img" aria-label="Bandeira do Uruguai"><rect width="27" height="18" fill="#fff"/><g fill="#0038a8"><rect y="2" width="27" height="2"/><rect y="6" width="27" height="2"/><rect y="10" width="27" height="2"/><rect y="14" width="27" height="2"/></g><rect width="13" height="10" fill="#fff"/><circle cx="6.5" cy="5" r="3.3" fill="none" stroke="#fcd116" stroke-width="1.4" stroke-dasharray="1.1 .9"/><circle cx="6.5" cy="5" r="2" fill="#fcd116"/></svg>',
    rs: '<svg class="bandeira" viewBox="0 0 27 18" role="img" aria-label="Bandeira do Rio Grande do Sul"><rect width="27" height="18" fill="#e4002b"/><path d="M0 0h20L0 13z" fill="#00843d"/><path d="M27 5v13H7z" fill="#ffd100"/></svg>',
  };
  const bandeira = (p) => BANDEIRAS[p.codigo] || `<span aria-hidden="true">${esc(p.bandeira)}</span>`;
  const normal = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Índice de todas as frases, para busca e favoritos.
  const todas = [];
  pais.situacoes.forEach((s) => s.frases.forEach((f) => todas.push({ ...f, origem: s.titulo })));
  pais.lugares.forEach((c) => c.itens.forEach((l) => l.frases.forEach((f) => todas.push({ ...f, origem: l.nome }))));
  pais.comidas.forEach((c) => todas.push({ es: c.pedir, pt: c.nome + " — " + c.desc, pr: "", origem: "Comidas" }));
  const giriaFrase = (g) => ({ es: g.es, pr: g.pr, pt: g.pt, ex: g.ex, dica: g.ex ? "" : g.dica, regioes: g.regioes });
  const ditadoFrase = (d) => ({ es: d.es, pt: d.pt, pr: "", dica: d.uso });
  pais.girias.forEach((g) => todas.push({ ...giriaFrase(g), origem: "Gírias" }));
  pais.ditados.forEach((d) => todas.push({ ...ditadoFrase(d), origem: "Ditados" }));
  ((pais.futebol && pais.futebol.frases) || []).forEach((f) => todas.push({ ...f, origem: "Futebol" }));

  // Termo da busca em andamento; os cartões destacam onde ele aparece.
  let termoBusca = "";
  // Compara sem acento, mas marca o texto original: `mapa` liga cada letra normalizada à sua posição.
  function destacar(texto) {
    const s = String(texto);
    if (!termoBusca) return esc(s);
    let norm = "";
    const mapa = [];
    for (let i = 0; i < s.length; i++) {
      const n = normal(s[i]);
      for (let j = 0; j < n.length; j++) mapa.push(i);
      norm += n;
    }
    let html = "";
    let fim = 0;
    let achou = norm.indexOf(termoBusca);
    while (achou !== -1) {
      const ate = mapa[achou + termoBusca.length - 1] + 1;
      html += esc(s.slice(fim, mapa[achou])) + "<mark>" + esc(s.slice(mapa[achou], ate)) + "</mark>";
      fim = ate;
      achou = norm.indexOf(termoBusca, achou + termoBusca.length);
    }
    return html + esc(s.slice(fim));
  }

  // Voz: usa a melhor voz em espanhol disponível no aparelho.
  let voz = null;
  function escolherVoz() {
    const vozes = speechSynthesis.getVoices();
    for (const lang of pais.voz) {
      voz = vozes.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(lang.toLowerCase()));
      if (voz) return;
    }
  }
  if ("speechSynthesis" in window) {
    escolherVoz();
    speechSynthesis.onvoiceschanged = escolherVoz;
  }
  // Histórias do guia são lidas em português, um parágrafo por vez.
  function narrar(paragrafos) {
    if (!("speechSynthesis" in window)) return avisar("Seu navegador não tem voz");
    speechSynthesis.cancel();
    const vozPt = speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-").toLowerCase().startsWith("pt"));
    paragrafos.forEach((p) => {
      const u = new SpeechSynthesisUtterance(p);
      u.lang = vozPt ? vozPt.lang : "pt-BR";
      if (vozPt) u.voice = vozPt;
      speechSynthesis.speak(u);
    });
  }
  function falar(texto) {
    if (!("speechSynthesis" in window)) return avisar("Seu navegador não tem voz");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto.replace(/[¿¡…]/g, ""));
    u.lang = voz ? voz.lang : pais.voz[0];
    if (voz) u.voice = voz;
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }

  let timerAviso;
  function avisar(msg) {
    const a = $("#aviso");
    a.textContent = msg;
    a.classList.add("visivel");
    clearTimeout(timerAviso);
    timerAviso = setTimeout(() => a.classList.remove("visivel"), 1800);
  }

  // Mantém a tela acesa enquanto a frase está à mostra, onde o navegador permite.
  let travaTela = null;
  async function manterAcesa() {
    if (!("wakeLock" in navigator) || $("#mostrar").hidden || travaTela) return;
    try {
      travaTela = await navigator.wakeLock.request("screen");
      travaTela.addEventListener("release", () => {
        travaTela = null;
        $("#mostrar-acesa").hidden = true;
      });
      // Pode ter fechado enquanto o pedido estava em andamento.
      if ($("#mostrar").hidden) return soltarTela();
      $("#mostrar-acesa").hidden = false;
    } catch (e) {}
  }
  function soltarTela() {
    if (travaTela) travaTela.release().catch(() => {});
  }
  // O sistema solta a trava quando o app sai da tela; pede de novo na volta.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") manterAcesa();
  });

  let escala = 1;
  try {
    const salva = +localStorage.getItem(CHAVE_ESCALA);
    if (ESCALAS.includes(salva)) escala = salva;
  } catch (e) {}
  function mudarEscala(passo) {
    escala = ESCALAS[ESCALAS.indexOf(escala) + passo] || escala;
    try { localStorage.setItem(CHAVE_ESCALA, escala); } catch (e) {}
    aplicarEscala();
  }
  function aplicarEscala() {
    $("#mostrar").style.setProperty("--escala", escala);
    const i = ESCALAS.indexOf(escala);
    $("#mostrar-menos").disabled = i === 0;
    $("#mostrar-mais").disabled = i === ESCALAS.length - 1;
    encaixar();
  }
  function girar(on) {
    $("#mostrar").classList.toggle("girada", on);
    $("#mostrar-girar").setAttribute("aria-pressed", on);
    encaixar();
  }
  // Reduz a letra até a frase inteira caber, sem precisar rolar.
  function encaixar() {
    const caixa = $("#mostrar-texto");
    let ajuste = 1;
    do {
      $("#mostrar").style.setProperty("--ajuste", ajuste);
      ajuste -= 0.05;
    } while (caixa.scrollHeight > caixa.clientHeight && ajuste > 0.3);
  }
  window.addEventListener("resize", encaixar);

  let fraseAberta = null;
  let origemFoco = null;
  function mostrar(f, origem) {
    fraseAberta = f;
    origemFoco = origem;
    $("#mostrar-es").textContent = f.es;
    $("#mostrar-pr").textContent = f.pr || "";
    $("#mostrar-pt").textContent = f.pt;
    $("#mostrar").hidden = false;
    aplicarEscala();
    $("#topo").inert = main.inert = $("#pular").inert = true;
    document.body.style.overflow = "hidden";
    $("#mostrar-fechar").focus();
    manterAcesa();
  }
  function fecharMostrar() {
    if ($("#mostrar").hidden) return;
    $("#mostrar").hidden = true;
    $("#topo").inert = main.inert = $("#pular").inert = false;
    document.body.style.overflow = "";
    girar(false);
    soltarTela();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (origemFoco && origemFoco.isConnected) origemFoco.focus();
  }

  // Frases renderizadas guardam seu índice em `vistas` para os botões acharem os dados.
  let vistas = [];
  const marcaFav = (on) => `<span aria-hidden="true">${on ? "★" : "☆"}</span>`;
  function cartaoFrase(f) {
    const i = vistas.push(f) - 1;
    const fav = favoritos.includes(f.es);
    return `<article class="frase">
      <p class="frase-es" lang="${LANG}">${destacar(f.es)}</p>
      ${f.pr ? `<span class="frase-pr"><span aria-hidden="true">🗣️</span> ${esc(f.pr)}</span>` : ""}
      <p class="frase-pt">${destacar(f.pt)}</p>
      ${f.dica ? `<p class="frase-dica"><span aria-hidden="true">💡</span> ${destacar(f.dica)}</p>` : ""}
      ${f.ex ? `<p class="frase-dica">Ex.: <span lang="${LANG}">${destacar(f.ex)}</span></p>` : ""}
      ${f.regioes ? `<p class="frase-regioes"><span aria-hidden="true">📍</span> ${f.regioes.map(esc).join(" · ")}</p>` : ""}
      <div class="frase-acoes">
        ${semTraducao ? "" : `<button class="btn" data-acao="falar" data-i="${i}"><span aria-hidden="true">🔊</span> Ouvir</button>
        <button class="btn" data-acao="mostrar" data-i="${i}"><span aria-hidden="true">⛶</span> Mostrar</button>`}
        <button class="btn ${fav ? "on" : ""}" data-acao="fav" data-i="${i}" aria-pressed="${fav}">${marcaFav(fav)} Salvar</button>
      </div>
    </article>`;
  }
  const lista = (frases) => `<div class="lista">${frases.map(cartaoFrase).join("")}</div>`;

  // Os dois botões de cada lugar: "Quero ir" (roteiro) e "Já fui" (álbum).
  function botoesLugar(nome) {
    const quero = queroIr.includes(nome);
    const fui = Boolean(jaFui[nome]);
    return `<div class="frase-acoes lugar-acoes">
      <button class="btn ${quero ? "on" : ""}" data-acao="quero" data-lugar="${esc(nome)}" aria-pressed="${quero}">${quero ? "✓" : "＋"} Quero ir</button>
      <button class="btn ${fui ? "on" : ""}" data-acao="fui" data-lugar="${esc(nome)}" aria-pressed="${fui}">${fui ? "✓ Já fui" : "Já fui"}</button>
    </div>`;
  }

  // Filtro de palavras, gírias e ditados. "Todas" mostra tudo; uma região mostra só o que é dela,
  // sem o que vale para o país todo. Região sem itens nesta lista conta como "Todas".
  function porRegiao(itens) {
    const regioes = pais.cidades.filter((c) => itens.some((x) => (x.regioes || []).includes(c)));
    const ativa = regioes.includes(filtroRegiao) ? filtroRegiao : "";
    const botoes = regioes.length ? `<div class="filtros" role="group" aria-label="Filtrar por região">${[["", "Todas"], ...regioes.map((c) => [c, c])].map(([v, r]) => `
      <button class="btn ${v === ativa ? "on" : ""}" data-acao="regiao" data-regiao="${esc(v)}" aria-pressed="${v === ativa}">${esc(r)}</button>`).join("")}
    </div>` : "";
    return { botoes, itens: ativa ? itens.filter((x) => (x.regioes || []).includes(ativa)) : itens };
  }

  function rapidas() {
    const botoes = RAPIDAS.map((r) => {
      const f = r.es ? todas.find((x) => x.es === r.es) : todas.find((x) => normal(x.es).includes(normal(r.chave)));
      if (!f) return "";
      return `<button class="rapida" data-acao="mostrar" data-i="${vistas.push(f) - 1}">
        <span class="emoji" aria-hidden="true">${r.icone}</span>
        ${esc(r.rotulo)}<span class="sr">: <span lang="${LANG}">${esc(f.es)}</span></span>
      </button>`;
    }).join("");
    if (!botoes) return "";
    return `<section class="rapidas" aria-labelledby="rapidas-titulo">
      <p class="rapidas-titulo" id="rapidas-titulo">Frases rápidas: toque e mostre</p>
      <div class="rapidas-grade">${botoes}</div>
    </section>`;
  }

  // Convite para instalar: botão onde o navegador oferece, instrução no iPhone.
  let pedidoInstalar = null;
  const instalado = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  function instalar() {
    if (instalado()) return "";
    if (pedidoInstalar) return `<div class="instalar"><button class="btn" data-acao="instalar"><span aria-hidden="true">📲</span> Instalar o app</button></div>`;
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return `<div class="instalar"><p>Para usar como app: toque em Compartilhar e depois em “Adicionar à Tela de Início”.</p></div>`;
    return "";
  }

  // Guia: a posição só é pedida ao tocar no botão, fica na memória e nunca sai do aparelho.
  const pontos = () => pais.guia || [];
  // Seções opcionais: sem conteúdo no país, a aba some e a rota volta ao início.
  const temSecao = {
    guia: pontos().length > 0,
    historia: (pais.historias || []).length > 0,
    origem: Boolean(pais.origem && pais.historias && pais.historias[0] && pais.historias[0].fundacao),
    futebol: Boolean(pais.futebol),
    quiz: (pais.quiz || []).length > 0,
    conversas: (pais.conversas || []).length > 0,
    preparar: (pais.checklist || []).length + (pais.etiqueta || []).length > 0,
    dicas: pais.pronuncia.length > 0,
    roteiro: pais.lugares.some((c) => c.itens.some((l) => l.prioridade)),
    // O GuIA (supabase/functions/guia) escolhe a persona pelo código do país; só aparece onde o país tem `ia: true` (ou no Uruguai).
    ia: pais.codigo === "uy" || pais.ia === true,
  };
  let posicao = null;
  let estadoGps = "";
  let filtroCidade = "";
  let filtroRegiao = "";
  let verTodos = false;
  const LIMITE_PERTO = 10;
  function distanciaKm(a, b) {
    const rad = (g) => (g * Math.PI) / 180;
    const dLat = rad(b[0] - a[0]);
    const dLng = rad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }
  const formatarDist = (km) => (km < 1 ? `${Math.round(km * 100) * 10} m` : `${km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)} km`);

  // Roteiro: o viajante escolhe cidades (ou regiões) e dias, e o app distribui os lugares em manhã, tarde e noite.
  // No dado, cada lugar pode ter `prioridade: "obrigatorio"` (o resto é recomendado), `minutos` (tempo sugerido no lugar),
  // `turno: "noite"` (só faz sentido à noite) e `alternativa` (nome de outro lugar, o plano B).
  const CHAVE_ROTEIRO = doPais("viajador:roteiro");
  const TURNOS = [["manha", "Manhã", 210], ["tarde", "Tarde", 270], ["noite", "Noite", 180]]; // minutos úteis de cada turno
  const MIN_PADRAO = 90;
  const DIA_INTEIRO = 270; // acima disso, o lugar ocupa manhã e tarde
  const BATE_VOLTA = 180; // estrada de até 3h cabe no mesmo dia de um passeio de dia inteiro
  let roteiro = { cidades: [], dias: 3, modo: "auto" };
  let nivelAlbum = "turista";
  // Três níveis do álbum, a partir da `prioridade` que o lugar já tem: nada de campo novo no dado.
  const NIVEIS_ALBUM = [
    ["turista", "Turista", "os obrigatórios", (l) => l.prioridade === "obrigatorio"],
    ["viajante", "Viajante", "os recomendados", (l) => l.prioridade !== "obrigatorio"],
    ["explorador", "Explorador", "todos os lugares", () => true],
  ];
  const contaAlbum = (itens, f) => {
    const alvo = itens.filter(f);
    const feitos = alvo.filter((l) => jaFui[l.nome]);
    return { feitos: feitos.length, total: alvo.length, pct: alvo.length ? Math.round((feitos.length / alvo.length) * 100) : 0, ultima: feitos.map((l) => jaFui[l.nome]).sort().pop() };
  };
  // Páginas completas, como "cidade|nível", para saber quando uma acabou de completar.
  const paginasCompletas = () => new Set(pais.lugares.flatMap((c) => NIVEIS_ALBUM
    .filter(([, , , f]) => { const k = contaAlbum(c.itens, f); return k.total && k.feitos === k.total; })
    .map(([id]) => `${c.cidade}|${id}`)));
  // Animações do álbum: valem só para a próxima tela desenhada.
  let recemColado = null; // figurinha que acabou de ser colada
  let comemorar = null; // "cidade|nível" que acabou de completar: carimbo e confete
  let direcaoPagina = ""; // "frente" ou "tras", para virar a página
  try { roteiro = { ...roteiro, ...JSON.parse(localStorage.getItem(CHAVE_ROTEIRO)) }; } catch (e) {}
  const salvarRoteiro = () => { try { localStorage.setItem(CHAVE_ROTEIRO, JSON.stringify(roteiro)); } catch (e) {} };

  const formatarTempo = (min) => (min < 60 ? `${min} min` : `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, "0") : ""}`);
  // Estrada: distância em linha reta x 1,3 (curvas da estrada), a 70 km/h de média, arredondada a 10 min.
  const estradaEntre = (a, b) => {
    if (!a || !b) return null;
    const km = distanciaKm(a, b) * 1.3;
    return { km: Math.round(km), min: Math.max(10, Math.round(km / 70 * 6) * 10) };
  };
  const lugarPorNome = (nome) => { for (const c of pais.lugares) for (const l of c.itens) if (l.nome === nome) return { l, cidade: c.cidade }; return null; };
  const coordsDoLugar = (l) => l.coords || (pontos().find((g) => g.lugar === l.nome) || {}).coords;

  function centroDe(itens) {
    const cs = itens.map((x) => x.coords).filter(Boolean);
    return cs.length ? [cs.reduce((s, c) => s + c[0], 0) / cs.length, cs.reduce((s, c) => s + c[1], 0) / cs.length] : null;
  }
  // Ordena pelo vizinho mais próximo, a partir do primeiro da lista.
  // Com `inicio`, o primeiro é o mais perto dali (de onde a pessoa está); sem ele, o primeiro da lista.
  function porProximidade(lista, coordsDe, inicio = null) {
    const resto = [...lista];
    const ordem = [];
    if (resto.length) {
      let i = 0;
      if (inicio) {
        let melhor = Infinity;
        resto.forEach((x, j) => { const c = coordsDe(x); const d = c ? distanciaKm(inicio, c) : Infinity; if (d < melhor) { melhor = d; i = j; } });
      }
      ordem.push(resto.splice(i, 1)[0]);
    }
    while (resto.length) {
      const atual = coordsDe(ordem[ordem.length - 1]);
      let i = 0;
      if (atual) {
        let melhor = Infinity;
        resto.forEach((x, j) => { const c = coordsDe(x); const d = c ? distanciaKm(atual, c) : Infinity; if (d < melhor) { melhor = d; i = j; } });
      }
      ordem.push(resto.splice(i, 1)[0]);
    }
    return ordem;
  }

  // `so`: só estes lugares (roteiro Do meu jeito). `sem`: lugares que ficam de fora (os que a pessoa já visitou).
  // `limiteEstrada`: fração máxima do tempo gasta em estrada (0.25 = 25%); null, sem limite.
  // `podeTirarObrig`: no "Do meu jeito", o limite tira pelo maior desvio, sem olhar a prioridade.
  // No automático, sai primeiro o recomendado; o obrigatório só sai se ainda passar do limite.
  function montarRoteiro(cidades, dias, { so = null, sem = null, limiteEstrada = null, podeTirarObrig = false } = {}) {
    let grupos = pais.lugares.filter((c) => cidades.includes(c.cidade)).map((c) => ({
      cidade: c.cidade,
      itens: c.itens.filter((l) => (!so || so.has(l.nome)) && !(sem && sem.has(l.nome))).map((l) => ({
        l, cidade: c.cidade, obrig: l.prioridade === "obrigatorio", noite: l.turno === "noite",
        min: l.minutos || MIN_PADRAO, coords: coordsDoLugar(l),
      })),
    })).filter((g) => g.itens.length);
    grupos.forEach((g) => { g.centro = centroDe(g.itens); });
    grupos = porProximidade(grupos, (g) => g.centro);

    // Escolha: primeiro o obrigatório, depois o recomendado, um de cada cidade por vez, até o tempo acabar.
    // A estrada entre as cidades entra na conta; a de dentro da cidade, numa folga de 20%.
    const estradaGrupos = grupos.slice(1).reduce((s, g, i) => s + ((estradaEntre(grupos[i].centro, g.centro) || {}).min || 0), 0);
    const tempo = { dia: dias * (TURNOS[0][2] + TURNOS[1][2]) * 0.8 - estradaGrupos, noite: dias * TURNOS[2][2] };
    const escolhidos = new Set();
    const recomendados = []; // na ordem em que entraram, para tirar do fim se faltar espaço
    const caber = (x) => {
      const k = x.noite ? "noite" : "dia";
      if (x.min > tempo[k]) return false;
      escolhidos.add(x); tempo[k] -= x.min;
      if (!x.obrig) recomendados.push(x);
      return true;
    };
    const revezar = (filas) => {
      for (let i = 0; filas.some((f) => i < f.length); i++) filas.forEach((f) => { if (f[i]) caber(f[i]); });
    };
    const obrig = grupos.flatMap((g) => g.itens.filter((x) => x.obrig));
    revezar(grupos.map((g) => g.itens.filter((x) => x.obrig)));
    revezar(grupos.map((g) => g.itens.filter((x) => !x.obrig)));

    // Distribuição: cada dia tem três turnos com tempo útil; a estrada até o próximo lugar entra no turno dele.
    function agendar(conjunto, nDias) {
      const agenda = Array.from({ length: nDias }, () => TURNOS.map(([id, , cap]) => ({ id, cap, usado: 0, itens: [] })));
      let d = 0, t = 0, antes = null;
      const avancar = () => { t++; if (t > 1) { t = 0; d++; } };
      const noites = [];
      const fora = [];
      for (const g of grupos) {
        const meus = g.itens.filter((x) => conjunto.has(x));
        const deDia = meus.filter((x) => !x.noite).sort((a, b) => b.obrig - a.obrig);
        // Passeio de dia inteiro começa de manhã: o obrigatório vem antes dos curtos quando a cidade começa de manhã;
        // o recomendado de dia inteiro fica para o fim, depois do que é obrigatório. A ordem por proximidade vale só
        // para os curtos, a partir de onde a pessoa está: os de dia inteiro são bate-voltas e não entram no caminho.
        const longos = deDia.filter((x) => x.min > DIA_INTEIRO && x.obrig);
        const longosRec = deDia.filter((x) => x.min > DIA_INTEIRO && !x.obrig);
        const curtos = porProximidade(deDia.filter((x) => x.min <= DIA_INTEIRO), (x) => x.coords, antes);
        const fila = d < nDias && t === 0 && agenda[d][0].usado === 0
          ? [...longos, ...curtos, ...longosRec]
          : [...curtos.slice(0, 1), ...longos, ...curtos.slice(1), ...longosRec];
        for (const x of fila) {
          // A estrada vem antes do lugar. Até 1h30, vai inteira num turno; mais que isso, passa de um turno para o outro.
          // Passeio de dia inteiro é um bate-volta: o dia começa de manhã, já com a estrada até ele.
          const estrada = antes ? estradaEntre(antes, x.coords) : null;
          let resto = estrada && estrada.min >= 20 ? estrada.min : 0;
          if (x.min > DIA_INTEIRO && resto <= BATE_VOLTA && d < nDias && (t !== 0 || agenda[d][0].usado > 0)) { t = 0; d++; }
          if (x.min > DIA_INTEIRO && resto && resto <= BATE_VOLTA && d < nDias) { agenda[d][0].itens.push({ estrada, ate: x }); resto = 0; }
          // Estrada curta e lugar vão juntos: se os dois não cabem no turno, passam para o próximo.
          if (resto && resto <= 90 && x.min <= DIA_INTEIRO) {
            while (d < nDias && agenda[d][t].usado > 0 && agenda[d][t].usado + resto + x.min > agenda[d][t].cap) avancar();
          }
          let primeira = true;
          while (resto > 0 && d < nDias) {
            const tu = agenda[d][t];
            const livre = tu.cap - tu.usado;
            if (primeira && resto <= 90 && livre < resto && tu.usado > 0) { avancar(); continue; }
            const usa = Math.min(livre, resto);
            if (usa > 0) {
              tu.itens.push(primeira ? { estrada, ate: x } : { estradaSegue: x });
              tu.usado += usa;
              resto -= usa;
              primeira = false;
            }
            if (tu.usado >= tu.cap) avancar();
          }
          const dur = Math.min(x.min, DIA_INTEIRO);
          if (x.min > DIA_INTEIRO) {
            if (d < nDias && (t !== 0 || agenda[d][0].usado > 0) && !agenda[d][0].itens.some((y) => y.ate === x)) { t = 0; d++; }
          } else {
            while (d < nDias && agenda[d][t].usado + dur > agenda[d][t].cap && agenda[d][t].usado > 0) avancar();
          }
          if (d >= nDias) { fora.push(x); continue; }
          const turno = agenda[d][t];
          turno.itens.push(x);
          turno.usado += dur;
          if (t === 0 && x.min <= DIA_INTEIRO && turno.usado > turno.cap) {
            agenda[d][1].itens.push({ continua: x });
            agenda[d][1].usado += turno.usado - turno.cap;
            turno.usado = turno.cap;
          }
          if (x.min > DIA_INTEIRO) { agenda[d][1].itens.push({ continua: x }); agenda[d][1].usado = agenda[d][1].cap; t = 0; d++; }
          else if (turno.usado >= turno.cap) avancar();
          antes = x.coords || antes;
        }
        meus.filter((x) => x.noite).forEach((x) => noites.push(x));
      }
      // Noite: só nas noites em que o dia termina na cidade do lugar (é lá que o viajante dorme).
      const cidadeDaNoite = (dia) => {
        const deDia = [...dia[0].itens, ...dia[1].itens].map((y) => y.cidade || (y.continua && y.continua.cidade) || (y.ate && y.ate.cidade) || (y.estradaSegue && y.estradaSegue.cidade)).filter(Boolean);
        return deDia[deDia.length - 1];
      };
      agenda.forEach((dia, i) => { dia.cidade = cidadeDaNoite(dia) || (i ? agenda[i - 1].cidade : grupos[0] && grupos[0].cidade); });
      // Se a estrada continua no dia seguinte, a pessoa dorme no caminho: nada de passeio à noite.
      agenda.forEach((dia, i) => { dia.naEstrada = Boolean(agenda[i + 1] && agenda[i + 1][0].itens[0] && agenda[i + 1][0].itens[0].estradaSegue); });
      for (const x of noites) {
        const dia = agenda.find((dia) => !dia.naEstrada && dia.cidade === x.cidade && dia[2].usado + x.min <= dia[2].cap);
        if (!dia) { fora.push(x); continue; }
        dia[2].itens.push(x); dia[2].usado += x.min;
      }
      // A estrada até um lugar que ficou de fora também sai.
      agenda.forEach((dia) => dia.forEach((tu) => { tu.itens = tu.itens.filter((y) => !fora.includes(y.ate || y.estradaSegue)); }));
      return { agenda, fora };
    }

    // Se algum obrigatório não coube nos dias, sai o último recomendado que entrou, até ele caber.
    let r = agendar(escolhidos, dias);
    while (r.fora.some((x) => x.obrig) && recomendados.length) {
      escolhidos.delete(recomendados.pop());
      r = agendar(escolhidos, dias);
    }
    // Limite de estrada: enquanto a estrada passar do limite, sai o lugar a que se chega com mais estrada
    // (primeiro os recomendados; no "Do meu jeito", depois os obrigatórios escolhidos).
    const estradaDe = (agenda) => {
      let estrada = 0, visita = 0;
      agenda.forEach((dia) => dia.forEach((tu) => tu.itens.forEach((y) => {
        if (y.estrada) estrada += y.estrada.min;
        else if (y.l) visita += y.min;
      })));
      return { estrada, visita, fracao: estrada + visita ? estrada / (estrada + visita) : 0 };
    };
    const longe = [];
    let conta = estradaDe(r.agenda);
    while (limiteEstrada !== null && conta.fracao > limiteEstrada) {
      // Desvio de cada lugar no caminho: ir até ele e seguir, menos ir direto do anterior ao seguinte.
      // Sai o que mais encurta a estrada; um lugar isolado (mesmo o primeiro) sai antes de um grupo de vizinhos.
      const caminho = [];
      r.agenda.forEach((dia) => [dia[0], dia[1]].forEach((tu) => tu.itens.forEach((y) => { if (y.l && y.coords && !caminho.includes(y)) caminho.push(y); })));
      const min = (a, b) => (a && b ? (estradaEntre(a.coords, b.coords) || {}).min || 0 : 0);
      const desvio = (i) => min(caminho[i - 1], caminho[i]) + min(caminho[i], caminho[i + 1]) - min(caminho[i - 1], caminho[i + 1]);
      const candidatos = caminho.map((x, i) => [x, desvio(i)]).filter(([, d]) => d > 0)
        .sort((a, b) => (podeTirarObrig ? 0 : a[0].obrig - b[0].obrig) || (b[1] - a[1]));
      if (!candidatos.length) break;
      const [sai] = candidatos[0];
      escolhidos.delete(sai);
      longe.push(sai);
      r = agendar(escolhidos, dias);
      conta = estradaDe(r.agenda);
    }
    // Depois do corte, sobra tempo: entram os lugares mais perto dos que ficaram, enquanto couberem
    // nos dias e a estrada seguir dentro do limite. Assim o dia fica cheio sem ir longe.
    if (limiteEstrada !== null && conta.fracao <= limiteEstrada) {
      const noPlano = () => [...escolhidos].filter((x) => x.coords);
      const perto = (x) => (x.coords ? Math.min(Infinity, ...noPlano().map((y) => (estradaEntre(x.coords, y.coords) || {}).min || 0)) : 0);
      const fila = grupos.flatMap((g) => g.itens).filter((x) => !escolhidos.has(x) && !r.fora.includes(x))
        .map((x) => [x, perto(x)]).sort((a, b) => b[0].obrig - a[0].obrig || a[1] - b[1]).map(([x]) => x);
      for (const x of fila) {
        escolhidos.add(x);
        const t = agendar(escolhidos, dias);
        const c = estradaDe(t.agenda);
        if (t.fora.length <= r.fora.length && c.fracao <= limiteEstrada) { r = t; conta = c; if (longe.includes(x)) longe.splice(longe.indexOf(x), 1); }
        else escolhidos.delete(x);
      }
    }
    r.fora.forEach((x) => escolhidos.delete(x));
    const faltam = obrig.filter((x) => !escolhidos.has(x));
    // Mínimo de dias: o menor número de dias em que todo o obrigatório cabe.
    let minimo = dias;
    if (faltam.length) {
      const soObrig = new Set(obrig);
      minimo = 1;
      while (minimo < 60 && agendar(soObrig, minimo).fora.length) minimo++;
    }
    const sobras = grupos.flatMap((g) => g.itens.filter((x) => !x.obrig && !escolhidos.has(x)));
    return { agenda: r.agenda, faltam, sobras, minimo, escolhidos, longe, estrada: conta };
  }
  function pedirPosicao() {
    if (!("geolocation" in navigator)) {
      estadoGps = "Este aparelho não informa a localização. Escolha um ponto na lista.";
      return render();
    }
    estadoGps = "Procurando sua localização…";
    render();
    navigator.geolocation.getCurrentPosition(
      (p) => {
        posicao = [p.coords.latitude, p.coords.longitude];
        estadoGps = "";
        render();
      },
      (erro) => {
        estadoGps = erro.code === 1
          ? "Sem permissão de localização. Escolha um ponto na lista, ou libere nas configurações do navegador."
          : "Não consegui achar sua localização agora. Escolha um ponto na lista.";
        render();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }
  const lugarDo = (g) => {
    for (const c of pais.lugares) {
      const l = c.itens.find((x) => x.nome === g.lugar);
      if (l) return { ...l, cidade: c.cidade };
    }
    return null;
  };

  // Quiz: perguntas e opções embaralhadas a cada rodada; o recorde fica no aparelho.
  let quizAtual = null;
  let recordes = {};
  try { recordes = JSON.parse(localStorage.getItem(CHAVE_QUIZ)) || {}; } catch (e) {}
  // Perguntas já respondidas por nível: só voltam depois que o banco inteiro for visto.
  let vistasQuiz = {};
  try { vistasQuiz = JSON.parse(localStorage.getItem(CHAVE_QUIZ_VISTAS)) || {}; } catch (e) {}
  // O ranking fica sempre no aparelho e, se o Supabase estiver configurado, também online.
  const apiRanking = (consulta, opcoes = {}) =>
    fetch(`${SUPABASE.url}/rest/v1/ranking${consulta}`, {
      ...opcoes,
      headers: { apikey: SUPABASE.chave, "Content-Type": "application/json", ...opcoes.headers },
    }).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r;
    });
  let placarOnline = {};
  let placarFalhou = {};
  function carregarPlacar(id) {
    if (!rankingOnline() || placarOnline[id] || placarFalhou[id] === "carregando") return;
    placarFalhou[id] = "carregando";
    apiRanking(`?select=nome,pontos,segundos&nivel=eq.${id}&order=pontos.desc,segundos.asc,criado.asc&limit=${TAM_RANKING}`)
      .then((r) => r.json())
      .then((lista) => {
        placarOnline[id] = lista;
        placarFalhou[id] = false;
      })
      .catch(() => { placarFalhou[id] = true; })
      .then(() => {
        // Troca só a tabela, para não apagar o nome que a pessoa está digitando.
        document.querySelectorAll(`.ranking-caixa[data-nivel="${id}"]`).forEach((c) => { c.innerHTML = conteudoRanking(id); });
      });
  }
  let ranking = {};
  try { ranking = JSON.parse(localStorage.getItem(CHAVE_RANKING)) || {}; } catch (e) {}
  let nomeJogador = "";
  try { nomeJogador = localStorage.getItem(CHAVE_NOME) || ""; } catch (e) {}
  function salvarNoRanking(nome) {
    const z = quizAtual;
    const segundos = Math.round((Date.now() - z.inicio) / 1000);
    const lista = [...(ranking[z.id] || []), { nome, pontos: z.acertos, segundos }];
    ranking[z.id] = lista.sort((a, b) => b.pontos - a.pontos || a.segundos - b.segundos).slice(0, TAM_RANKING);
    z.salvo = true;
    try {
      localStorage.setItem(CHAVE_RANKING, JSON.stringify(ranking));
      localStorage.setItem(CHAVE_NOME, nome);
    } catch (e) {}
    // O banco recusa rodadas rápidas demais; avisa em vez de parecer falha de conexão.
    if (rankingOnline() && segundos < 10) {
      avisar("Rodada muito rápida: salva só neste aparelho");
    } else if (rankingOnline()) {
      const id = z.id;
      apiRanking("", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ nivel: id, nome, pontos: z.acertos, segundos }),
      })
        .then(() => {
          delete placarOnline[id];
          placarFalhou[id] = false;
          carregarPlacar(id);
          avisar("Resultado enviado ao ranking");
        })
        .catch(() => avisar("Sem conexão: salvo só neste aparelho"));
    }
  }
  function conteudoRanking(id) {
    const online = rankingOnline() && !placarFalhou[id] && placarOnline[id];
    const lista = (online ? placarOnline[id] : ranking[id]) || [];
    const titulo = online ? "Ranking geral" : rankingOnline() && placarFalhou[id] === "carregando" ? "Carregando o ranking geral…" : rankingOnline() ? "Sem conexão: ranking deste aparelho" : "Ranking neste aparelho";
    const tabela = lista.length
      ? `<ol class="ranking">${lista.map((r) => `<li><strong>${esc(r.nome)}</strong> <span class="suave">${esc(r.pontos)} de ${RODADA} · ${esc(r.segundos)}s</span></li>`).join("")}</ol>`
      : `<p class="suave">Ninguém entrou neste ranking ainda.</p>`;
    return `<p class="gps-nota">${titulo}</p>${tabela}`;
  }
  const tabelaRanking = (id) => {
    carregarPlacar(id);
    return `<div class="ranking-caixa" data-nivel="${esc(id)}">${conteudoRanking(id)}</div>`;
  };
  const salvarVistasQuiz = () => { try { localStorage.setItem(CHAVE_QUIZ_VISTAS, JSON.stringify(vistasQuiz)); } catch (e) {} };
  const embaralhar = (lista) => {
    const a = [...lista];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function iniciarQuiz(nivel) {
    const ja = vistasQuiz[nivel.id] || [];
    const novas = embaralhar(nivel.perguntas.filter((q) => !ja.includes(q.pergunta)));
    let escolhidas = novas.slice(0, RODADA);
    if (escolhidas.length < RODADA) {
      // Banco quase no fim: completa com perguntas antigas e recomeça a contagem.
      const antigas = embaralhar(nivel.perguntas.filter((q) => ja.includes(q.pergunta)));
      escolhidas = [...escolhidas, ...antigas.slice(0, RODADA - escolhidas.length)];
      vistasQuiz[nivel.id] = [];
      salvarVistasQuiz();
    }
    quizAtual = {
      id: nivel.id,
      inicio: Date.now(),
      i: 0,
      acertos: 0,
      escolhida: null,
      perguntas: embaralhar(escolhidas).map((q) => ({ ...q, opcoes: embaralhar([q.certa, ...q.erradas]) })),
    };
  }

  // Imagens: cada foto traz crédito na tela de Créditos, e sem internet o texto continua lá.
  const imgs = pais.imagens || { lugares: {}, pessoas: {} };
  const fotoLugar = (id) => (imgs.lugares[id] ? `img/guia/${id}.jpg` : null);
  const fotoPessoa = (nome) => (imgs.pessoas[nome] ? `img/pessoas/${imgs.pessoas[nome].id}.jpg` : null);
  const creditoFoto = (c) => (c ? `<p class="credito">Foto: ${esc(c.autor || "Wikimedia Commons")} · <a href="${esc(c.pagina)}" target="_blank" rel="noopener">${esc(c.licenca)}</a></p>` : "");
  const heroi = (src, alt, credito) => (src ? `<figure class="heroi"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">${creditoFoto(credito)}</figure>` : "");
  const miniatura = (src, icone) => (src ? `<img class="mini" src="${esc(src)}" alt="" loading="lazy">` : `<span class="emoji" aria-hidden="true">${icone}</span>`);
  const corDoIndice = (i) => `hsl(${Math.round((i * 137.5) % 360)} 68% 42%)`;
  const CAPAS = { "": "inicio", guia: "guia", historia: "historia", futebol: "futebol", quiz: "quiz", conversas: "conversas", lugares: "lugares", girias: "girias", ditados: "ditados", dicas: "dicas", preparar: "preparar", favoritos: "favoritos", ia: "ia" };
  const capa = (nome) => `<img class="capa" src="img/arte/${nome}.svg" alt="" aria-hidden="true">`;
  const momentos = (itens) => `<ol class="linha-tempo">${itens.map((m) => `
    <li><span class="linha-data">${esc(m.data)}</span><strong>${esc(m.titulo)}</strong><p class="suave">${esc(m.texto)}</p></li>`).join("")}</ol>`;
  const pessoas = (itens) => `<div class="tabela">${itens.map((p) => `
    <div class="item pessoa">${fotoPessoa(p.nome) ? `<img class="retrato" src="${fotoPessoa(p.nome)}" alt="${esc(p.nome)}" loading="lazy">` : ""}<div><h3>${esc(p.nome)}</h3><p class="ponto-dist">${p.area ? `${esc(p.area)} · ` : ""}${esc(p.origem)}</p><p class="suave">${esc(p.texto)}</p></div></div>`).join("")}</div>`;
  const cartoes = (itens) => `<div class="tabela">${itens.map((c) => `<div class="item"><h3>${esc(c.titulo)}</h3><p class="suave">${esc(c.texto)}</p></div>`).join("")}</div>`;
  const secao = (titulo, itens, html) => (itens.length ? `<h2>${titulo}</h2>${html(itens)}` : "");

  // GuIA Turístico: o app escolhe os trechos do guia que importam e a função do Supabase pergunta ao Gemini.
  const CHAVE_APARELHO = "viajador:aparelho";
  let aparelho = "";
  try { aparelho = localStorage.getItem(CHAVE_APARELHO) || ""; } catch (e) {}
  if (!aparelho) {
    aparelho = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now());
    try { localStorage.setItem(CHAVE_APARELHO, aparelho); } catch (e) {}
  }
  let conversa = [];
  let pensando = false;
  let lerEmVoz = false;
  const TAM_CONTEXTO = 12000;
  const palavras = (s) => normal(s).split(/[^a-z0-9ñ]+/).filter((p) => p.length >= 4);
  // `assunto` traz as mensagens anteriores, para perguntas como "e quem projetou?" manterem o tema.
  function montarContexto(pergunta, assunto = "") {
    const chave = new Set(palavras(`${pergunta} ${assunto}`));
    const pontua = (txt) => palavras(txt).reduce((n, p) => n + (chave.has(p) ? 1 : 0), 0);
    const partes = [`País: ${pais.nome}. ${pais.intro}`];
    const descreve = (g) => {
      const l = lugarDo(g);
      return `LUGAR: ${g.lugar} (${l.cidade})${posicao ? `, a ${formatarDist(distanciaKm(posicao, g.coords))} do viajante` : ""}\n${g.historia.join(" ")}\nO que reparar: ${g.reparar}\nDica: ${l.dica}\nFrases: ${l.frases.map((f) => `${f.es} (${f.pr}) = ${f.pt}`).join("; ")}`;
    };
    const escolhidos = new Map();
    if (posicao) [...pontos()].sort((a, b) => distanciaKm(posicao, a.coords) - distanciaKm(posicao, b.coords)).slice(0, 3).forEach((g) => escolhidos.set(g.id, g));
    pontos().map((g) => ({ g, n: pontua(`${g.lugar} ${g.resumo} ${g.historia.join(" ")}`) + (normal(`${pergunta} ${assunto}`).includes(normal(g.lugar.split(" (")[0])) ? 5 : 0) }))
      .filter((x) => x.n >= 2).sort((a, b) => b.n - a.n).slice(0, 3).forEach((x) => escolhidos.set(x.g.id, x.g));
    if (posicao) partes.push(`O viajante está perto destes lugares, em ordem de distância.`);
    escolhidos.forEach((g) => partes.push(descreve(g)));
    const hist = (pais.historias || []).flatMap((h) => [...(h.fundacao || []), ...h.momentos, ...h.costumes, ...h.pessoas, ...h.estrelas, ...h.datas]
      .map((x) => ({ x, h, n: pontua(`${x.titulo || x.nome} ${x.texto}`) })))
      .filter((y) => y.n >= 1).sort((a, b) => b.n - a.n).slice(0, 8);
    hist.forEach(({ x, h }) => partes.push(`HISTÓRIA (${h.titulo}): ${x.data ? x.data + " - " : ""}${x.titulo || x.nome}${x.origem ? ` (${x.origem})` : ""}: ${x.texto}`));
    const f = pais.futebol;
    if (f && pontua(["futebol futbol gol copa mundial peñarol penarol nacional celeste estadio clasico jogo partido", ...f.clubes.map((c) => c.titulo)].join(" ")) >= 1) {
      partes.push(`FUTEBOL: ${[...f.titulos, ...f.clubes, ...f.jogo].map((c) => `${c.titulo}: ${c.texto}`).join(" | ")}`);
    }
    // Gírias, ditados, comidas e falsos amigos: o guia precisa conhecer o vocabulário local, como o do RS.
    const vocab = [
      ...pais.girias.map((x) => ({ n: pontua(`${x.es} ${x.pt}`), t: `GÍRIA: ${x.es} = ${x.pt}${x.ex ? ` (ex.: ${x.ex})` : ""}${x.regioes ? ` [${x.regioes.join(", ")}]` : ""}` })),
      ...pais.ditados.map((x) => ({ n: pontua(`${x.es} ${x.pt} ${x.uso}`), t: `EXPRESSÃO: ${x.es} = ${x.pt}. ${x.uso}` })),
      ...pais.comidas.map((x) => ({ n: pontua(`${x.nome} ${x.desc}`), t: `COMIDA: ${x.nome}: ${x.desc}${x.regioes ? ` [${x.regioes.join(", ")}]` : ""}` })),
      ...pais.falsosAmigos.map((x) => ({ n: pontua(`${x.es} ${x.pt}`), t: `PALAVRA: ${x.es} = ${x.pt}. Não é: ${x.errado}` })),
    ].filter((x) => x.n >= 1).sort((a, b) => b.n - a.n).slice(0, 8);
    vocab.forEach((x) => partes.push(x.t));
    const frases = todas.map((fr) => ({ fr, n: pontua(`${fr.es} ${fr.pt}`) })).filter((y) => y.n >= 1).sort((a, b) => b.n - a.n).slice(0, 6);
    if (frases.length) partes.push(`FRASES ÚTEIS: ${frases.map(({ fr }) => `${fr.es}${fr.pr ? ` (${fr.pr})` : ""} = ${fr.pt}`).join("; ")}`);
    if (escolhidos.size + hist.length === 0) partes.push(`LUGARES DO GUIA: ${pontos().map((g) => `${g.lugar} (${lugarDo(g).cidade}): ${g.resumo}`).join(" | ")}`);
    return partes.join("\n\n").slice(0, TAM_CONTEXTO);
  }
  // O guia não percebe sozinho que a conversa continua e cumprimenta toda vez; a orientação vai junto do contexto.
  const orientacaoDaConversa = (continua) =>
    (continua
      ? "ESTA CONVERSA JÁ ESTÁ EM ANDAMENTO: não cumprimente nem diga Hola, che ou Olá. Responda direto, continuando o assunto."
      : "PRIMEIRA MENSAGEM DA CONVERSA: pode cumprimentar em poucas palavras.") +
    " Só ensine uma frase em espanhol quando ela tiver a ver com a pergunta, e não repita frases que já ensinou.";
  async function perguntarAoGuia(pergunta) {
    if (!supabaseOnline()) return avisar("O GuIA Turístico ainda não foi configurado");
    if (!navigator.onLine) return avisar("O GuIA Turístico precisa de internet");
    pensando = true;
    const historico = conversa.slice(-6).map((m) => ({ papel: m.quem === "eu" ? "user" : "model", texto: m.texto }));
    conversa.push({ quem: "eu", texto: pergunta });
    render();
    let texto;
    try {
      const r = await fetch(`${SUPABASE.url}/functions/v1/guia`, {
        method: "POST",
        signal: AbortSignal.timeout ? AbortSignal.timeout(90000) : undefined,
        headers: { apikey: SUPABASE.chave, "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta, contexto: `${orientacaoDaConversa(historico.length > 0)}

${montarContexto(pergunta, historico.slice(-4).map((m) => m.texto).join(" "))}`, historico, aparelho, pais: pais.codigo }),
      });
      const j = await r.json().catch(() => ({}));
      texto = j.resposta || j.erro || (r.status === 404 ? "O GuIA Turístico ainda não está ligado no servidor." : "Não consegui responder agora.");
      conversa.push({ quem: j.resposta ? "guia" : "erro", texto });
    } catch (e) {
      texto = e && e.name === "TimeoutError" ? "O guia demorou demais para responder. Tente de novo." : "Sem conexão com o guia. Tente de novo.";
      conversa.push({ quem: "erro", texto });
    }
    pensando = false;
    if (location.hash.startsWith("#/ia")) {
      render();
      const ultima = main.querySelector(".chat-msg:last-of-type");
      if (ultima) ultima.scrollIntoView({ block: "start" });
      if (lerEmVoz && conversa[conversa.length - 1].quem === "guia") narrar([texto.replace(/[*_#]/g, "")]);
    }
  }
  // O Gemini escreve com **negrito** e *itálico*; vira HTML depois de escapar o texto.
  const formatarResposta = (t) =>
    esc(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)([^*\n]+?)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/^\s*[-*]\s+/gm, "• ");
  const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
  function ouvirPergunta() {
    const rec = new Reconhecimento();
    rec.lang = "pt-BR";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const falado = e.results[0][0].transcript;
      const campo = $("#pergunta-ia");
      if (campo) campo.value = falado;
      perguntarAoGuia(falado);
    };
    rec.onerror = () => avisar("Não entendi. Tente de novo ou escreva.");
    rec.start();
    avisar("Pode falar…");
  }

  const telas = {
    ia() {
      const sugestoes = pais.sugestoesIA || ["O que tem de interessante perto de mim?", "Como peço a conta?", "Que gírias eu preciso saber?", `Me conta como nasceu ${comArtigo}`];
      return `<h1>GuIA Turístico</h1>
        <p class="lead">Pergunte sobre os lugares, a história e como falar. As respostas usam o conteúdo do Viajador.</p>
        ${supabaseOnline() ? "" : `<p class="frase-dica">O GuIA Turístico ainda não foi configurado.</p>`}
        <div class="chat">${conversa.length ? conversa.map((m, i) => `
          <div class="chat-msg chat-${m.quem}">
            <p>${m.quem === "guia" ? formatarResposta(m.texto) : esc(m.texto)}</p>
            ${m.quem === "guia" ? `<button class="btn" data-acao="ia-ouvir" data-i="${i}"><span aria-hidden="true">🔊</span> Ouvir</button>` : ""}
          </div>`).join("") : `<div class="chat-sugestoes">${sugestoes.map((s) => `<button class="btn" data-acao="ia-sugestao">${esc(s)}</button>`).join("")}</div>`}
          ${pensando ? `<div class="chat-msg chat-guia chat-pensando" role="status"><p>Pensando…</p></div>` : ""}
        </div>
        <div class="chat-entrada">
          <label class="sr" for="pergunta-ia">Sua pergunta</label>
          <textarea id="pergunta-ia" rows="2" maxlength="500" placeholder="Pergunte ao guia…" ${pensando ? "disabled" : ""}></textarea>
          <div class="chat-botoes">
            ${Reconhecimento ? `<button class="btn btn-gps" data-acao="ia-falar" ${pensando ? "disabled" : ""}><span aria-hidden="true">🎤</span> Falar</button>` : ""}
            <button class="btn btn-gps on" data-acao="ia-enviar" ${pensando ? "disabled" : ""}>Perguntar</button>
          </div>
          <label class="chat-opcao"><input type="checkbox" data-acao="ia-voz" ${lerEmVoz ? "checked" : ""}> Ler as respostas em voz alta</label>
          <div class="chat-botoes">
            <button class="btn" data-acao="gps"><span aria-hidden="true">📍</span> ${posicao ? "Atualizar localização" : "Usar minha localização"}</button>
            ${conversa.length ? `<button class="btn" data-acao="ia-limpar">Nova conversa</button>` : ""}
          </div>
        </div>
        <p class="gps-nota">O guia pode errar. Confirme horários e preços no local. Até 30 perguntas por dia neste aparelho, e as perguntas passam pelo Google Gemini.</p>`;
    },
    creditos() {
      const linha = (nome, c) => `<li>${esc(nome)}: ${esc(c.autor || "autor não informado")} · <a href="${esc(c.pagina)}" target="_blank" rel="noopener">${esc(c.licenca)}</a></li>`;
      return `<h1>Créditos das imagens</h1>
        <p class="lead">Fotos do Wikimedia Commons, reduzidas para o app, com as licenças indicadas. Ilustrações feitas para o Viajador.</p>
        <h2>Lugares</h2>
        <ul class="fontes">${pontos().filter((g) => imgs.lugares[g.id]).map((g) => linha(g.lugar, imgs.lugares[g.id])).join("")}</ul>
        <h2>Pessoas</h2>
        <ul class="fontes">${Object.entries(imgs.pessoas).map(([n, c]) => linha(n, c)).join("")}</ul>
        <h2>Origem do país</h2>
        <ul class="fontes">${imgs.origem && pais.origem ? linha(pais.origem.alt, imgs.origem) : ""}</ul>`;
    },
    origem() {
      const o = pais.origem;
      const h = pais.historias[0];
      const quiz = (pais.quiz || []).find((n) => n.id === o.quiz);
      return `<figure class="heroi"><img src="${esc(o.imagem)}" alt="${esc(o.alt)}"><figcaption class="credito">${esc(o.legenda)}</figcaption></figure>
        <h1>${bandeira(pais)} Como nasceu ${esc(comArtigo)}</h1>
        <p class="lead">${esc(o.lead)}</p>
        ${cartoes(h.fundacao)}
        ${secao("Linha do tempo", h.momentos.filter((m) => /^1[6-8]/.test(m.data)), momentos)}
        <a class="btn btn-gps ver-todos" href="#/historia/${h.id}">Ver a História completa</a>
        ${quiz ? `<a class="btn btn-gps ver-todos" href="#/quiz/${quiz.id}">Fazer o quiz ${esc(quiz.titulo)}</a>` : ""}
        <h2>Fontes</h2>
        <ul class="fontes">${h.fontes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`).join("")}</ul>`;
    },
    futebol() {
      const f = pais.futebol;
      const estadios = f.estadios.map((e) => pontos().find((g) => g.lugar.includes(e.titulo)) && e).filter(Boolean);
      return `<h1>⚽ Futebol ${esc(doNome)}</h1>
        <p class="lead">${esc(f.intro)}</p>
        ${secao("Títulos", f.titulos, cartoes)}
        ${secao("Momentos que marcaram", f.momentos, momentos)}
        ${secao("Clubes", f.clubes, cartoes)}
        ${secao("Estádios", f.estadios, cartoes)}
        ${estadios.map((e) => `<a class="btn btn-gps ver-todos" href="#/guia/${pontos().find((g) => g.lugar.includes(e.titulo)).id}">Ver a história do ${esc(e.titulo)}</a>`).join("")}
        ${secao("Ídolos", f.idolos, pessoas)}
        ${secao("Cultura do futebol", f.cultura, cartoes)}
        ${secao("Como ir a um jogo", f.jogo, cartoes)}
        <h2>Frases para o jogo</h2>
        ${lista(f.frases)}
        ${(pais.quiz || []).some((n) => n.id === "futebol") ? `<a class="btn btn-gps ver-todos" href="#/quiz/futebol">Fazer o quiz de futebol</a>` : ""}
        <h2>Fontes</h2>
        <ul class="fontes">${f.fontes.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.titulo)}</a></li>`).join("")}</ul>`;
    },
    historia(id) {
      const lista = pais.historias || [];
      const h = lista.find((x) => x.id === id) || lista[0];
      const base = lista.find((x) => x.id === h.base);
      return `<h1>${h.icone} ${esc(h.titulo)}</h1>
        <p class="lead">${esc(h.intro)}</p>
        <div class="filtros" role="group" aria-label="Escolher país ou cidade">${lista.map((x) => `
          <a class="btn ${x.id === h.id ? "on" : ""}" href="#/historia/${x.id}"${x.id === h.id ? ' aria-current="page"' : ""}>${esc(x.titulo)}</a>`).join("")}
        </div>
        ${secao(`Como nasceu ${esc(comArtigo)}`, h.fundacao || [], cartoes)}
        ${secao("Momentos históricos", h.momentos, momentos)}
        ${secao("Costumes", h.costumes, cartoes)}
        ${secao("Pessoas históricas", h.pessoas, pessoas)}
        ${secao("Estrelas", h.estrelas, pessoas)}
        ${secao("Datas importantes", h.datas, momentos)}
        ${base ? `<h2>Vale para ${esc(base.titulo === pais.nome ? `${pais.artigo || ""} ${pais.nome}`.trim() : base.titulo)} todo</h2>
          <p class="lead">O que as regiões compartilham.</p>
          ${cartoes(base.costumes)}
          ${secao("Datas do estado todo", base.datas, momentos)}
          <a class="btn btn-gps ver-todos" href="#/historia/${base.id}">Ver a história de ${esc(base.titulo)}</a>` : ""}
        ${temSecao.quiz ? `<a class="btn btn-gps ver-todos" href="#/quiz">Testar o que aprendi no quiz</a>` : ""}
        <h2>Fontes</h2>
        <ul class="fontes">${h.fontes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`).join("")}</ul>`;
    },
    quiz(id) {
      const niveis = pais.quiz || [];
      const nivel = niveis.find((x) => x.id === id);
      if (!nivel) {
        return `<h1>Quiz ${esc(doNome)}</h1>
          <p class="lead">${niveis.length} ${niveis.length === 1 ? "nível" : "níveis"}. Cada rodada tem 10 perguntas, e elas só se repetem depois que você vir todas.</p>
          <div class="tabela">${niveis.map((n) => `
            <a class="item ponto nivel nivel-${n.id}" href="#/quiz/${n.id}">
              <img class="selo" src="img/arte/nivel-${n.id}.svg" alt="">
              <span class="ponto-texto">
                <strong>${esc(n.titulo)}</strong>
                <small class="suave">${esc(n.descricao)}</small>
                <small class="ponto-dist">${(vistasQuiz[n.id] || []).length} de ${n.perguntas.length} perguntas vistas${recordes[n.id] === undefined ? "" : ` · Recorde: ${recordes[n.id]} de ${RODADA}`}</small>
              </span>
            </a>`).join("")}
          </div>
          <h2>Ranking</h2>
          <p class="lead">${rankingOnline() ? "Os melhores resultados de todo mundo, por nível." : "Fica só neste celular. Passe o aparelho para os amigos jogarem."}</p>
          ${niveis.map((n) => `<h3 class="ranking-nivel">${n.icone} ${esc(n.titulo)}</h3>${tabelaRanking(n.id)}`).join("")}`;
      }
      if (!quizAtual || quizAtual.id !== nivel.id) iniciarQuiz(nivel);
      const z = quizAtual;
      if (z.i >= z.perguntas.length) {
        return `<a class="voltar" href="#/quiz">← Níveis</a>
          <img class="medalha" src="img/arte/${z.acertos >= 9 ? "medalha-ouro" : z.acertos >= 7 ? "medalha-prata" : z.acertos >= 5 ? "medalha-bronze" : "mate-consolo"}.svg" alt="">
          <h1>${nivel.icone} ${z.acertos} de ${z.perguntas.length}</h1>
          <p class="lead">${z.acertos === z.perguntas.length ? "Perfeito. Pode pedir a cidadania." : z.acertos >= z.perguntas.length / 2 ? "Bien ahí! Mandou bem." : "Tranqui: a seção de História ajuda."}</p>
          ${z.salvo ? "" : `<label class="ranking-nome">Seu nome no ranking${rankingOnline() ? " (fica visível para todos)" : ""}
            <input id="nome-ranking" type="text" maxlength="20" value="${esc(nomeJogador)}" autocomplete="off">
          </label>
          <button class="btn btn-gps ver-todos" data-acao="quiz-salvar">Salvar no ranking</button>`}
          <h2>Ranking de ${esc(nivel.titulo)}</h2>
          ${tabelaRanking(nivel.id)}
          <button class="btn btn-gps ver-todos" data-acao="quiz-repetir">Jogar com novas perguntas</button>
          ${temSecao.historia ? `<a class="btn btn-gps ver-todos" href="#/historia">Rever a História</a>` : ""}`;
      }
      const q = z.perguntas[z.i];
      const respondida = z.escolhida !== null;
      // Depois da resposta, mostra a foto do lugar ou da pessoa citada.
      const citado = !respondida || q.imagem ? null : pontos().find((g) => fotoLugar(g.id) && (q.pergunta.includes(g.lugar) || q.pergunta.includes(g.resumo) || q.certa === g.lugar));
      const citada = !respondida || q.imagem || citado ? null : Object.keys(imgs.pessoas).find((n) => q.pergunta.includes(n) || q.certa === n);
      const revelada = citado ? `<img class="quiz-revela" src="${fotoLugar(citado.id)}" alt="${esc(citado.lugar)}">` : citada ? `<img class="quiz-revela quiz-revela-pessoa" src="${fotoPessoa(citada)}" alt="${esc(citada)}">` : "";
      return `<a class="voltar" href="#/quiz">← Níveis</a>
        <div class="quiz-topo nivel-${nivel.id}">
          <img class="selo" src="img/arte/nivel-${nivel.id}.svg" alt="">
          <p class="ponto-dist">${esc(nivel.titulo)} · Pergunta ${z.i + 1} de ${z.perguntas.length} · ${z.acertos} ${z.acertos === 1 ? "acerto" : "acertos"}</p>
        </div>
        <div class="quiz-barra" role="progressbar" aria-valuemin="0" aria-valuemax="${z.perguntas.length}" aria-valuenow="${z.i + (respondida ? 1 : 0)}"><span style="width:${((z.i + (respondida ? 1 : 0)) / z.perguntas.length) * 100}%"></span></div>
        <h1 class="quiz-pergunta">${esc(q.pergunta)}</h1>
        ${q.imagem ? `<img class="quiz-imagem" src="${esc(q.imagem)}" alt="Imagem da pergunta">` : ""}
        <div class="quiz-opcoes">${q.opcoes.map((o, i) => {
          const classe = !respondida ? "" : o === q.certa ? "certa" : i === z.escolhida ? "errada" : "";
          return `<button class="quiz-opcao ${classe}" data-acao="quiz-responder" data-op="${i}" ${respondida ? "disabled" : ""}>${esc(o)}</button>`;
        }).join("")}</div>
        ${respondida ? `<p class="frase-dica" role="status"><strong>${q.opcoes[z.escolhida] === q.certa ? "Acertou." : `Era: ${esc(q.certa)}.`}</strong> ${esc(q.explica)}</p>
          ${revelada}
          <button class="btn btn-gps ver-todos" data-acao="quiz-proxima">${z.i + 1 < z.perguntas.length ? "Próxima pergunta" : "Ver resultado"}</button>` : ""}`;
    },
    guia(id) {
      const g = pontos().find((x) => x.id === id);
      if (g) {
        const l = lugarDo(g);
        return `<a class="voltar" href="#/guia">← Perto de você</a>
          ${heroi(fotoLugar(g.id), g.lugar, imgs.lugares[g.id])}
          <h1 lang="${LANG}">${l.icone} ${esc(g.lugar)}</h1>
          <p class="lead">${esc(l.cidade)}${posicao ? ` · a ${formatarDist(distanciaKm(posicao, g.coords))} de você` : ""}</p>
          <div class="frase-acoes"><button class="btn" data-acao="narrar" data-guia="${esc(g.id)}"><span aria-hidden="true">🔊</span> Ouvir a história</button></div>
          ${botoesLugar(g.lugar)}
          <div class="historia">${g.historia.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <p class="frase-dica"><strong>O que reparar:</strong> ${esc(g.reparar)}</p>
          <p class="frase-dica"><strong>Dica:</strong> ${esc(l.dica)}</p>
          <h2>${semTraducao ? "Palavra do lugar" : "Frases para este lugar"}</h2>
          ${lista(l.frases)}
          <h2>Fontes</h2>
          <p class="gps-nota">Conferido em ${esc(g.revisado.split("-").reverse().join("/"))}. Horários e acesso podem mudar.</p>
          <ul class="fontes">${g.fontes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`).join("")}</ul>`;
      }
      const ordem = pontos()
        .map((p) => ({ p, km: posicao ? distanciaKm(posicao, p.coords) : null, l: lugarDo(p) }))
        .filter(({ l }) => !filtroCidade || l.cidade === filtroCidade);
      if (posicao) ordem.sort((a, b) => a.km - b.km);
      // Com GPS só o entorno importa; a lista completa fica a um toque.
      const visiveis = posicao && !verTodos ? ordem.slice(0, LIMITE_PERTO) : ordem;
      // Só cidades com algum ponto no guia: as outras dariam uma lista vazia.
      const filtros = [["", "Todas"], ...pais.lugares.filter((c) => pontos().some((p) => lugarDo(p).cidade === c.cidade)).map((c) => [c.cidade, c.cidade])];
      const totalLugares = pais.lugares.reduce((s, c) => s + c.itens.length, 0);
      const fuiEm = pais.lugares.reduce((s, c) => s + c.itens.filter((l) => jaFui[l.nome]).length, 0);
      return `<h1>Perto de você</h1>
        <p class="lead">${pontos().length} lugares com história. Funciona sem internet, menos os links das fontes.</p>
        <p class="gps-nota">${fuiEm ? `Você já foi a ${fuiEm} de ${totalLugares} lugares ${esc(doNome)}.` : "Marque os lugares onde já foi e complete o seu álbum."} <a href="#/album">Ver ${NOME_ALBUM} →</a></p>
        <button class="btn btn-gps" data-acao="gps"><span aria-hidden="true">📍</span> ${posicao ? "Atualizar localização" : "Usar minha localização"}</button>
        <p class="gps-nota">${esc(estadoGps || "Sua localização fica só neste aparelho e é usada para ordenar a lista.")}</p>
        <div class="filtros" role="group" aria-label="Filtrar por cidade">${filtros.map(([v, r]) => `
          <button class="btn ${v === filtroCidade ? "on" : ""}" data-acao="filtro" data-cidade="${esc(v)}" aria-pressed="${v === filtroCidade}">${esc(r)}</button>`).join("")}
        </div>
        <div class="tabela">${visiveis.map(({ p, km, l }) => `
          <a class="item ponto" href="#/guia/${p.id}">
            ${miniatura(fotoLugar(p.id), l.icone)}
            <span class="ponto-texto">
              <strong lang="${LANG}">${esc(p.lugar)}</strong>
              <small class="suave">${esc(p.resumo)}</small>
              <small class="ponto-dist">${esc(l.cidade)}${km === null ? "" : ` · ${formatarDist(km)}`}${jaFui[p.lugar] ? " · ✓ Já fui" : ""}</small>
            </span>
          </a>
          ${km !== null && km < 0.3 && !jaFui[p.lugar] ? `<p class="ponto-perto">Você está aqui? <button class="btn" data-acao="fui" data-lugar="${esc(p.lugar)}">Marcar como visitado</button></p>` : ""}`).join("")}
        </div>
        ${visiveis.length < ordem.length ? `<button class="btn btn-gps ver-todos" data-acao="ver-todos">Ver todos os ${ordem.length}</button>` : ""}`;
    },
    inicio() {
      // Com uma região escolhida, as palavras de todos os temas aparecem juntas, só as daquela região.
      const { botoes } = porRegiao(pais.situacoes.flatMap((s) => s.frases));
      const daRegiao = filtroRegiao && botoes
        ? pais.situacoes.map((s) => ({ s, frases: s.frases.filter((f) => (f.regioes || []).includes(filtroRegiao)) })).filter((x) => x.frases.length)
        : null;
      return `${rapidas()}
        <div class="intro">${esc(pais.intro)}</div>
        <h1>${semTraducao ? "Palavras do dia a dia" : "O que você precisa agora?"}</h1>
        <p class="lead">${semTraducao ? "Toque no tema e veja o que você vai ouvir por lá." : "Toque na situação, ouça a frase ou mostre a tela."}</p>
        ${botoes}
        ${daRegiao && daRegiao.length ? daRegiao.map(({ s, frases }) => `<h2>${s.icone} ${esc(s.titulo)}</h2>${lista(frases)}`).join("") : `
        <div class="grade">${pais.situacoes.map((s, i) => `
          <a class="categoria" style="--cor:${corDoIndice(i)}" href="#/s/${s.id}">
            <span class="emoji" aria-hidden="true">${s.icone}</span>
            <strong>${esc(s.titulo)}</strong>
            <small>${s.frases.length} ${semTraducao ? "palavras" : "frases"}</small>
          </a>`).join("")}
        </div>`}
        ${instalar()}`;
    },
    situacao(id) {
      const s = pais.situacoes.find((x) => x.id === id);
      if (!s) return telas.inicio();
      const { botoes, itens } = porRegiao(s.frases);
      return `<a class="voltar" href="#/">← ${semTraducao ? "Palavras" : "Frases"}</a>
        <h1>${s.icone} ${esc(s.titulo)}</h1>
        <p class="lead">${itens.length} ${semTraducao ? "palavras" : "frases úteis"}</p>
        ${botoes}
        ${lista(itens)}`;
    },
    conversas(id) {
      const c = (pais.conversas || []).find((x) => x.id === id);
      if (!c) {
        return `<h1>Conversas prontas</h1>
          <p class="lead">O que dizer e o que vão te responder, na ordem em que acontece.</p>
          <div class="grade">${(pais.conversas || []).map((x, i) => `
            <a class="categoria" style="--cor:${corDoIndice(i + 5)}" href="#/conversas/${x.id}">
              <span class="emoji" aria-hidden="true">${x.icone}</span>
              <strong>${esc(x.titulo)}</strong>
              <small>${x.passos.length} etapas</small>
            </a>`).join("")}
          </div>`;
      }
      return `<a class="voltar" href="#/conversas">← Conversas</a>
        <h1>${c.icone} ${esc(c.titulo)}</h1>
        ${c.passos.map((p) => `
          <h2>${esc(p.titulo)}</h2>
          ${lista(p.es.map((es) => todas.find((f) => f.es === es)).filter(Boolean))}`).join("")}`;
    },
    preparar() {
      return `<h1>Preparar a viagem</h1>
        <p class="lead">O que resolver antes de sair e como se comportar por lá.</p>
        <h2>Checklist</h2>
        <div class="tabela">${(pais.checklist || []).map((c) => `
          <label class="item check">
            <input type="checkbox" data-check="${esc(c.id)}" ${marcados.includes(c.id) ? "checked" : ""}>
            <span><strong>${esc(c.texto)}</strong>${c.nota ? `<small class="suave">${esc(c.nota)}</small>` : ""}</span>
          </label>`).join("")}
        </div>
        <h2>Etiqueta</h2>
        <div class="tabela">${(pais.etiqueta || []).map((e) => `
          <div class="item">
            <h3>${esc(e.titulo)}</h3>
            <p class="suave">${esc(e.texto)}</p>
          </div>`).join("")}
        </div>`;
    },
    lugares() {
      return `<h1>Lugares</h1>
        <p class="lead">${semTraducao ? "Dicas para cada lugar." : "Dicas e frases para cada ponto turístico."}</p>
        ${pais.lugares.map((c) => `
          <h2>${esc(c.cidade)}</h2>
          ${c.itens.map((l) => `
            <section class="item lugar">
              ${pontos().filter((g) => g.lugar === l.nome).map((g) => (fotoLugar(g.id) ? `<img class="lugar-foto" src="${fotoLugar(g.id)}" alt="${esc(l.nome)}" loading="lazy">` : "")).join("")}
              <div class="lugar-topo"><span aria-hidden="true">${l.icone}</span><h3 lang="${LANG}">${esc(l.nome)}</h3></div>
              <p class="suave">${esc(l.dica)}</p>
              ${pontos().filter((g) => g.lugar === l.nome).map((g) => `<a class="voltar" href="#/guia/${g.id}">Conhecer a história →</a>`).join("")}
              ${botoesLugar(l.nome)}
              ${lista(l.frases)}
            </section>`).join("")}`).join("")}
        <h2>Comidas típicas</h2>
        <div class="tabela">${pais.comidas.filter((c) => !filtroCidade || !c.regioes || c.regioes.includes(filtroCidade)).map((c) => `
          <div class="item">
            <h3 lang="${LANG}">${esc(c.nome)}</h3>
            <p class="suave">${esc(c.desc)}</p>
            ${lista([{ es: c.pedir, pt: "Como pedir", pr: "" }])}
          </div>`).join("")}
        </div>`;
    },
    girias() {
      const { botoes, itens } = porRegiao(pais.girias);
      return `<h1>Gírias ${esc(doNome)}</h1>
        <p class="lead">Para entender a conversa (e soltar uma de vez em quando).</p>
        ${botoes}
        ${lista(itens.map(giriaFrase))}`;
    },
    ditados() {
      const { botoes, itens } = porRegiao(pais.ditados);
      return `<h1>Ditados e expressões</h1>
        <p class="lead">Frases feitas que você vai ouvir por aí.</p>
        ${botoes}
        ${lista(itens.map(ditadoFrase))}
        <h2>Cuidado: falsos amigos</h2>
        <p class="lead">${semTraducao ? "Palavras que existem no resto do Brasil, mas aqui querem dizer outra coisa." : "Palavras parecidas com o português, mas com outro sentido."}</p>
        <div class="tabela">${pais.falsosAmigos.map((f) => `
          <div class="item">
            <h3 lang="${LANG}">${esc(f.es)}</h3>
            <p class="${f.pt.startsWith("⚠️") ? "alerta" : ""}">= ${esc(f.pt)}</p>
            <p class="suave">Não é: ${esc(f.errado)}</p>
          </div>`).join("")}
        </div>`;
    },
    dicas() {
      return `<h1>${semTraducao ? "Jeito de falar" : "Pronúncia sem sufoco"}</h1>
        <p class="lead">${semTraducao ? "Curiosidades do sotaque e do jeito de falar daqui." : "As regras que mais fazem diferença para quem fala português."} A sílaba em MAIÚSCULA é a forte.</p>
        <div class="tabela">${pais.pronuncia.map((p) => `
          <div class="item">
            <h3>${esc(p.regra)}</h3>
            <p lang="${LANG}">${esc(p.ex)}</p>
            ${p.dica ? `<p class="suave"><span aria-hidden="true">💡</span> ${esc(p.dica)}</p>` : ""}
          </div>`).join("")}
        </div>`;
    },
    roteiro() {
      // Dois modos: "Montar pra mim" (o app escolhe nas cidades marcadas, sem os lugares onde a pessoa já foi)
      // e "Do meu jeito" (só os lugares marcados com Quero ir, em qualquer cidade).
      const meu = roteiro.modo === "meu";
      const fui = new Set(Object.keys(jaFui));
      const meus = new Set(queroIr.filter((n) => lugarPorNome(n)));
      const cidades = pais.cidades.filter((c) => roteiro.cidades.includes(c));
      // Estrada: no automático, no máximo 25% do tempo; no "Do meu jeito", o limite que a pessoa escolher.
      const limite = meu ? (roteiro.limite === undefined ? 0.25 : roteiro.limite) : 0.25;
      const r = meu
        ? (meus.size ? montarRoteiro(pais.cidades, roteiro.dias, { so: meus, limiteEstrada: limite, podeTirarObrig: true }) : null)
        : (cidades.length ? montarRoteiro(cidades, roteiro.dias, { sem: fui, limiteEstrada: limite }) : null);
      const visitados = meu ? 0 : pais.lugares.filter((c) => cidades.includes(c.cidade)).reduce((s, c) => s + c.itens.filter((l) => fui.has(l.nome)).length, 0);
      const naoCouberam = meu && r ? [...r.faltam, ...r.sobras] : [];
      let diasPrecisos = roteiro.dias;
      if (naoCouberam.length) {
        do diasPrecisos++;
        while (diasPrecisos < 30 && (() => { const t = montarRoteiro(pais.cidades, diasPrecisos, { so: meus, limiteEstrada: limite, podeTirarObrig: true }); return t.faltam.length + t.sobras.length - t.longe.length; })());
      }
      const nome = semTraducao ? "regiões" : "cidades";
      const historia = (l) => pontos().filter((g) => g.lugar === l.nome).map((g) => `<a class="voltar" href="#/guia/${g.id}">Conhecer a história →</a>`).join("");
      // Para o jantar, uma comida da região (ou do país), sem repetir entre as noites.
      const comidas = (cidade) => pais.comidas.filter((c) => !c.regioes || c.regioes.includes(cidade));
      let jantares = 0;
      // Plano B nunca é um lugar que já está no roteiro. Se a alternativa do dado já está, vale o lugar mais perto,
      // da mesma cidade e do mesmo turno, que ficou de fora, de preferência um que ainda não foi plano B de outro.
      const noPlano = new Set(r ? [...r.escolhidos].map((x) => x.l.nome) : []);
      const jaPlanoB = new Set();
      const escolherPlanoB = (l) => {
        if (l.alternativa && !noPlano.has(l.alternativa) && lugarPorNome(l.alternativa)) return lugarPorNome(l.alternativa);
        const grupo = pais.lugares.find((c) => c.itens.includes(l));
        if (!grupo) return null;
        const aqui = coordsDoLugar(l);
        const livres = grupo.itens.filter((o) => o !== l && !noPlano.has(o.nome) && (o.turno === "noite") === (l.turno === "noite"));
        const dist = (o) => { const c = coordsDoLugar(o); return aqui && c ? distanciaKm(aqui, c) : 9999; };
        const melhor = livres.sort((a, b) => jaPlanoB.has(a.nome) - jaPlanoB.has(b.nome) || dist(a) - dist(b))[0];
        return melhor ? { l: melhor, cidade: grupo.cidade } : null;
      };
      const planoB = (l) => {
        const alt = escolherPlanoB(l);
        if (!alt) return "";
        jaPlanoB.add(alt.l.nome);
        const g = pontos().find((p) => p.lugar === alt.l.nome);
        return `<p class="roteiro-b"><span aria-hidden="true">🔁</span> Plano B: ${g ? `<a href="#/guia/${g.id}">${esc(alt.l.nome)}</a>` : esc(alt.l.nome)}${alt.l.minutos ? ` · ${formatarTempo(alt.l.minutos)}` : ""}</p>`;
      };
      const lugar = (x) => `
        <li class="roteiro-item">
          <strong><span aria-hidden="true">${x.l.icone}</span> <span lang="${LANG}">${esc(x.l.nome)}</span></strong>
          <span class="etiqueta-roteiro ${x.obrig ? "obrig" : ""}">${x.obrig ? "Obrigatório" : "Recomendado"}</span>
          <span class="etiqueta-roteiro"><span aria-hidden="true">⏱️</span> ${x.min > DIA_INTEIRO ? "Dia inteiro" : formatarTempo(x.min)}</span>
          <p class="suave">${esc(x.l.dica)}</p>
          ${/domingo/i.test(x.l.dica) ? `<p class="frase-dica"><span aria-hidden="true">📅</span> Encaixe este num domingo.</p>` : ""}
          ${planoB(x.l)}
          ${historia(x.l)}
          ${botoesLugar(x.l.nome)}
        </li>`;
      const item = (y) => {
        if (y.continua) return `<li class="roteiro-item"><strong>Continua: ${esc(y.continua.l.nome)}</strong></li>`;
        if (y.estradaSegue) return `<li class="roteiro-item roteiro-estrada"><span aria-hidden="true">🚗</span> Estrada até ${esc(y.estradaSegue.l.nome)} (continua)</li>`;
        if (y.estrada) return `<li class="roteiro-item roteiro-estrada"><span aria-hidden="true">🚗</span> ${formatarTempo(y.estrada.min)} de estrada até ${esc(y.ate.l.nome)} <span class="suave">(cerca de ${y.estrada.km} km)</span></li>`;
        return lugar(y);
      };
      const turno = (tu, rotulo, cidade) => {
        let corpo = tu.itens.map(item).join("");
        if (!corpo && tu.id === "noite" && cidade) {
          const lista = comidas(cidade);
          const c = lista.length ? lista[jantares++ % lista.length] : null;
          corpo = `<li class="roteiro-item"><strong><span aria-hidden="true">🍽️</span> Jantar${c ? `: ${esc(c.nome)}` : ""}</strong>${c ? `<p class="suave">${esc(c.desc)}</p>` : ""}</li>`;
        }
        if (!corpo) corpo = `<li class="roteiro-item"><strong>Tempo livre</strong><p class="suave">Para descansar, comer bem ou voltar a um lugar de que gostou.</p></li>`;
        return `<div class="roteiro-turno"><h3>${rotulo}</h3><ol class="roteiro-lista">${corpo}</ol></div>`;
      };
      const qtd = r ? [...r.escolhidos].filter((x) => x.obrig).length : 0;
      const modo = (id, rotulo) => `<button class="btn ${(roteiro.modo || "auto") === id ? "on" : ""}" data-acao="roteiro-modo" data-modo="${id}" aria-pressed="${(roteiro.modo || "auto") === id}">${rotulo}</button>`;
      return `<p class="kicker"><span aria-hidden="true">✨</span> Assistente de viagem</p>
        <h1>Roteiro</h1>
        <div class="filtros roteiro-modos" role="group" aria-label="Como montar o roteiro">${modo("auto", "Montar pra mim")}${modo("meu", `Do meu jeito${meus.size ? ` (${meus.size})` : ""}`)}</div>
        <p class="lead">${meu
          ? "Os lugares que você marcou com Quero ir, na melhor ordem, em manhã, tarde e noite, com o tempo de estrada."
          : `Escolha as ${nome} e quantos dias vai ficar. O roteiro se monta sozinho, em manhã, tarde e noite: primeiro o obrigatório, depois o recomendado, na ordem do caminho e com o tempo de estrada.`}</p>
        ${meu ? "" : `<div class="filtros" role="group" aria-label="${semTraducao ? "Regiões" : "Cidades"}">${pais.cidades.map((c) => `
          <button class="btn ${cidades.includes(c) ? "on" : ""}" data-acao="roteiro-cidade" data-cidade="${esc(c)}" aria-pressed="${cidades.includes(c)}">${esc(c)}</button>`).join("")}
        </div>`}
        ${meu ? `<div class="filtros" role="group" aria-label="Tempo máximo em estrada"><span class="filtros-rotulo">Estrada, no máximo:</span>${[[0.15, "15%"], [0.25, "25%"], [0.4, "40%"], [null, "Sem limite"]].map(([v, rot]) => `
          <button class="btn ${limite === v ? "on" : ""}" data-acao="roteiro-limite" data-limite="${v === null ? "" : v}" aria-pressed="${limite === v}">${rot}</button>`).join("")}
        </div>` : ""}
        <div class="roteiro-dias" role="group" aria-label="Dias de viagem">
          <button class="btn" data-acao="roteiro-dias" data-delta="-1" aria-label="Menos um dia" ${roteiro.dias <= 1 ? "disabled" : ""}>−</button>
          <strong aria-live="polite">${roteiro.dias} ${roteiro.dias === 1 ? "dia" : "dias"}</strong>
          <button class="btn" data-acao="roteiro-dias" data-delta="1" aria-label="Mais um dia" ${roteiro.dias >= 30 ? "disabled" : ""}>+</button>
        </div>
        ${!r ? (meu
          ? `<p class="vazio">Toque em ＋ Quero ir nos lugares de <a href="#/guia">Perto de você</a>, <a href="#/lugares">Lugares</a> ou do roteiro automático. Eles aparecem aqui, na melhor ordem.</p>`
          : `<p class="vazio">Toque em uma ou mais ${nome} para começar.</p>`) : `
          <p class="lead">${meu
            ? `Cabem ${r.escolhidos.size} de ${meus.size} ${meus.size === 1 ? "lugar" : "lugares"}.`
            : `${qtd} ${qtd === 1 ? "lugar obrigatório" : "lugares obrigatórios"} e ${r.escolhidos.size - qtd} ${r.escolhidos.size - qtd === 1 ? "recomendado" : "recomendados"}.`} Estrada: ${Math.round(r.estrada.fracao * 100)}% do tempo${limite !== null ? ` (limite de ${Math.round(limite * 100)}%)` : ""}. Tempos e estradas são estimativas.</p>
          ${r.longe.length ? `<p class="gps-nota">Para a estrada não passar do limite, ${r.longe.length === 1 ? "ficou de fora" : "ficaram de fora"}: ${r.longe.map((x) => esc(x.l.nome)).join(", ")}.${meu ? " Aumente o limite de estrada para incluir." : " Para incluir, use o Do meu jeito e escolha um limite maior."}</p>` : ""}
          ${limite !== null && r.estrada.fracao > limite ? `<p class="gps-nota">Mesmo com poucos lugares, a estrada passa do limite: as regiões escolhidas são longe umas das outras.</p>` : ""}
          ${visitados ? `<p class="gps-nota">${visitados === 1 ? "Um lugar onde você já foi ficou" : `${visitados} lugares onde você já foi ficaram`} de fora. Para incluir de novo, desmarque Já fui.</p>` : ""}
          ${!meu && r.faltam.some((x) => !r.longe.includes(x)) ? `<p class="frase-dica"><span aria-hidden="true">⚠️</span> Não cabe todo o obrigatório: ${r.faltam.filter((x) => !r.longe.includes(x)).length === 1 ? "fica de fora" : "ficam de fora"} ${r.faltam.filter((x) => !r.longe.includes(x)).map((x) => esc(x.l.nome)).join(", ")}. Para ver tudo, são uns ${r.minimo} dias.</p>` : ""}
          ${r.agenda.map((dia, i) => {
            const onde = [...new Set(dia.flatMap((tu) => tu.itens.map((y) => y.cidade || (y.ate && y.ate.cidade) || (y.estradaSegue && y.estradaSegue.cidade) || (y.continua && y.continua.cidade))).filter(Boolean))];
            if (!onde.length && dia.every((tu) => !tu.itens.length)) return "";
            return `<section class="item roteiro-dia">
              <h2>Dia ${i + 1}${onde.length ? ` · ${onde.map(esc).join(" → ")}` : ""}</h2>
              ${dia.map((tu, j) => turno(tu, TURNOS[j][1], onde[onde.length - 1])).join("")}
            </section>`;
          }).join("")}
          ${meu && naoCouberam.length ? `<details class="item roteiro-fora">
            <summary>${naoCouberam.length} ${naoCouberam.length === 1 ? "lugar não coube" : "lugares não couberam"} · ver</summary>
            <p class="suave">${r.longe.length ? `${r.longe.length} por estrada demais (veja o limite acima)${naoCouberam.length > r.longe.length ? " e o resto por " : "."}` : ""}${naoCouberam.length > r.longe.length ? `falta de tempo nos ${roteiro.dias} ${roteiro.dias === 1 ? "dia" : "dias"}. Para caber, são uns ${diasPrecisos} dias.` : ""} Sai primeiro o recomendado, depois o obrigatório.</p>
            <button class="btn btn-gps" data-acao="roteiro-dias" data-delta="1">Adicionar 1 dia</button>
            <ol class="roteiro-lista">${naoCouberam.map(lugar).join("")}</ol>
          </details>` : ""}
          ${!meu && r.sobras.length ? `<h2>Se sobrar tempo</h2><ol class="roteiro-lista">${r.sobras.map(lugar).join("")}</ol>` : ""}`}`;
    },
    album(param) {
      const barra = (k, rotulo) => `<div class="album-barra">
          <span class="album-rotulo">${rotulo}</span>
          <span class="album-trilho" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${k.pct}"><span style="width:${k.pct}%"></span></span>
          <span class="album-num">${k.feitos}/${k.total}</span>
        </div>`;
      const dataBr = (iso) => iso.split("-").reverse().join("/");
      // Parabéns com uma comemoração local (`parabens` no dado), sempre a mesma para a mesma região e nível.
      const giria = (cidade, n) => {
        const lista = pais.parabens || ["Parabéns"];
        return lista[(pais.cidades.indexOf(cidade) + n) % lista.length];
      };
      const todos = pais.lugares.flatMap((x) => x.itens);
      const coladas = todos.filter((l) => jaFui[l.nome]).length;
      // Como no álbum de papel: cada figurinha tem sigla e número, na ordem das páginas.
      const numero = (l) => `${pais.codigo.toUpperCase()} ${String(todos.indexOf(l) + 1).padStart(2, "0")}`;
      const figurinha = (l) => {
        const n = todos.indexOf(l);
        const fui = jaFui[l.nome];
        const g = pontos().find((p) => p.lugar === l.nome);
        const foto = g && fotoLugar(g.id);
        const especial = l.prioridade === "obrigatorio";
        const historia = g ? `<a class="figurinha-link" href="#/guia/${g.id}">História</a>` : "";
        if (!fui) {
          return `<div class="figurinha vaga">
            <div class="fig-cartao">
              <span class="fig-num">${numero(l)}</span>
              <span class="fig-silhueta" aria-hidden="true">${l.icone}</span>
              <strong lang="${LANG}">${esc(l.nome)}</strong>
              <small>${especial ? "Especial" : "Comum"}</small>
            </div>
            <div class="fig-acoes">
              <button class="btn" data-acao="fui" data-lugar="${esc(l.nome)}" aria-pressed="false">Colar: já fui</button>
              ${historia}
            </div>
          </div>`;
        }
        // Inclinação fixa por figurinha, de -2° a 2°: parece colada à mão, mas não pula a cada visita.
        return `<div class="figurinha colada ${especial ? "especial" : ""} ${l.nome === recemColado ? "nova" : ""}" style="--cor:${corDoIndice(n)};--gira:${((n * 7) % 5) - 2}deg">
            <div class="fig-cartao">
              <span class="fig-num">${numero(l)}</span>
              <span class="fig-arte">${foto ? `<img src="${foto}" alt="" loading="lazy">` : `<span aria-hidden="true">${l.icone}</span>`}</span>
              <span class="fig-faixa"><strong lang="${LANG}">${esc(l.nome)}</strong><small>${dataBr(fui)}</small></span>
              ${especial ? `<span class="fig-selo">Especial</span>` : ""}
              <span class="fig-brilho" aria-hidden="true"></span>
            </div>
            <div class="fig-acoes">
              <button class="btn on" data-acao="fui" data-lugar="${esc(l.nome)}" aria-pressed="true">✓ Já fui</button>
              ${historia}
            </div>
          </div>`;
      };
      const c = param === undefined ? null : pais.lugares[+param];
      if (c) {
        const i = +param;
        const k = NIVEIS_ALBUM.map(([id, rotulo, desc, f], n) => ({ id, rotulo, desc, n, ...contaAlbum(c.itens, f) }));
        const feitos = c.itens.filter((l) => jaFui[l.nome]).length;
        const vizinha = (j, seta) => {
          const x = pais.lugares[j];
          if (!x) return "<span></span>";
          const rotulo = seta === "←" ? `← ${esc(x.cidade)}` : `${esc(x.cidade)} →`;
          return `<a class="btn" href="#/album/${j}" data-virar="${seta === "←" ? "tras" : "frente"}">${rotulo}</a>`;
        };
        return `<a class="voltar" href="#/album" data-virar="tras">← Capa do álbum</a>
          <article class="album-pagina ${direcaoPagina ? `vira-${direcaoPagina}` : ""}" aria-labelledby="pagina-titulo">
            <header class="pagina-topo">
              <span class="pagina-num">Página ${i + 1} de ${pais.lugares.length}</span>
              <h1 id="pagina-titulo">${esc(c.cidade)}</h1>
              <span class="pagina-conta"><strong>${feitos}</strong>/${c.itens.length}</span>
            </header>
            ${k.map((x) => barra(x, `${x.rotulo} <small>${x.desc}</small>`)).join("")}
            <div class="carimbos">${k.filter((x) => x.total && x.feitos === x.total).map((x) => `
              <p class="carimbo ${comemorar === `${c.cidade}|${x.id}` ? "batendo" : ""}" style="--gira:${-6 + x.n * 5}deg">
                <span class="carimbo-nivel">${x.rotulo}</span>
                <span class="carimbo-data">${dataBr(x.ultima)}</span>
                <span class="carimbo-giria">${esc(giria(c.cidade, x.n))}</span>
              </p>`).join("")}
            </div>
            <div class="album-figurinhas">${c.itens.map(figurinha).join("")}</div>
            <nav class="pagina-nav" aria-label="Páginas do álbum">${vizinha(i - 1, "←")}${vizinha(i + 1, "→")}</nav>
          </article>`;
      }
      const nivel = NIVEIS_ALBUM.find((n) => n[0] === nivelAlbum) || NIVEIS_ALBUM[0];
      const k = contaAlbum(todos, nivel[3]);
      // Mapa esquemático: cada cidade ou região é uma peça, na posição de `mapa` no dado, colorida pela %.
      const colunas = pais.mapa ? Math.max(...Object.values(pais.mapa).map(([col, , larg = 1]) => col + larg - 1)) : 0;
      const mapa = pais.mapa ? `<div class="album-mapa" aria-hidden="true" style="grid-template-columns:repeat(${colunas}, minmax(0, 1fr))">${pais.lugares.map((x, i) => {
        const pos = pais.mapa[x.cidade];
        if (!pos) return "";
        const [col, lin, larg = 1, alt = 1] = pos;
        const p = contaAlbum(x.itens, nivel[3]).pct;
        return `<a class="album-peca" href="#/album/${i}" data-virar="frente" tabindex="-1" style="grid-column:${col} / span ${larg};grid-row:${lin} / span ${alt};--p:${p}"><span>${esc(x.cidade)}</span><strong>${p}%</strong></a>`;
      }).join("")}</div>` : "";
      return `<section class="album-capa">
          <span class="capa-bandeira">${bandeira(pais)}</span>
          <p class="capa-kicker">Álbum de figurinhas</p>
          <h1>${NOME_ALBUM}</h1>
          <p class="capa-sub">${esc(pais.nome)} · ${pais.lugares.length} páginas</p>
          <p class="capa-selo"><strong>${coladas}</strong><small>de ${todos.length}</small></p>
          <a class="btn capa-abrir" href="#/album/0" data-virar="frente">Abrir o álbum</a>
        </section>
        <p class="lead">Marque com “Já fui” os lugares que você conheceu ${esc(doNome)} e cole as figurinhas. Fica só neste aparelho.</p>
        <div class="filtros" role="group" aria-label="Nível do álbum">${NIVEIS_ALBUM.map(([id, rotulo]) => `
          <button class="btn ${id === nivel[0] ? "on" : ""}" data-acao="album-nivel" data-nivel="${id}" aria-pressed="${id === nivel[0]}">${rotulo}</button>`).join("")}
        </div>
        ${barra(k, `${nivel[1]} <small>${nivel[2]}</small>`)}
        ${mapa}
        <h2>Páginas</h2>
        <div class="album-indice">${pais.lugares.map((x, i) => {
          const p = contaAlbum(x.itens, nivel[3]);
          const completa = p.total && p.feitos === p.total;
          return `<a class="miniatura ${completa ? "completa" : ""}" href="#/album/${i}" data-virar="frente">
            <span class="mini-num">${i + 1}</span>
            <strong>${esc(x.cidade)}</strong>
            <span class="mini-slots" aria-hidden="true">${x.itens.map((l) => `<i class="${jaFui[l.nome] ? "on" : ""}"></i>`).join("")}</span>
            <small class="ponto-dist">${p.feitos} de ${p.total} · ${nivel[1]}${completa ? " · completa" : ""}</small>
          </a>`;
        }).join("")}</div>`;
    },
    favoritos() {
      const fs = favoritos.map((es) => todas.find((f) => f.es === es)).filter(Boolean);
      return `<h1>★ Salvos</h1>
        <p class="lead">Suas frases favoritas ficam guardadas neste aparelho.</p>
        ${fs.length ? lista(fs) : `<p class="vazio">Toque em ☆ Salvar em qualquer frase para guardá-la aqui.</p>`}`;
    },
    busca(termo) {
      const t = normal(termo);
      const achou = todas.filter((f) => normal(f.es + " " + f.pt + " " + (f.dica || "") + " " + (f.ex || "")).includes(t));
      const naHistoria = (pais.historias || []).flatMap((h) =>
        [...h.momentos, ...h.costumes, ...h.pessoas, ...h.estrelas, ...h.datas]
          .filter((x) => normal([x.titulo, x.nome, x.texto].filter(Boolean).join(" ")).includes(t))
          .map((x) => ({ h, x })));
      const lugaresAchados = pontos().filter((g) => normal([g.lugar, g.resumo, ...g.historia].join(" ")).includes(t));
      return `<h1>Resultados para “${esc(termo)}”</h1>
        <p class="lead">${achou.length} frase(s) · ${lugaresAchados.length} lugar(es) · ${naHistoria.length} na História</p>
        ${lugaresAchados.length ? `<div class="tabela">${lugaresAchados.map((g) => `
          <a class="item ponto" href="#/guia/${g.id}">
            <span class="emoji" aria-hidden="true">${lugarDo(g).icone}</span>
            <span class="ponto-texto"><strong lang="${LANG}">${destacar(g.lugar)}</strong><small class="suave">${destacar(g.resumo)}</small></span>
          </a>`).join("")}</div>` : ""}
        ${achou.length ? lista(achou) : ""}
        ${naHistoria.length ? `<h2>Na História</h2><div class="tabela">${naHistoria.map(({ h, x }) => `
          <a class="item ponto" href="#/historia/${h.id}">
            <span class="ponto-texto"><strong>${destacar(x.titulo || x.nome)}</strong><small class="suave">${destacar(x.texto)}</small><small class="ponto-dist">${esc(h.titulo)}</small></span>
          </a>`).join("")}</div>` : ""}
        ${achou.length || lugaresAchados.length || naHistoria.length ? "" : `<p class="vazio">Nada encontrado. Tente outra palavra${semTraducao ? "" : ", em português ou espanhol"}.</p>`}`;
    },
  };

  function render() {
    vistas = [];
    const termo = $("#busca").value.trim();
    termoBusca = normal(termo);
    const [, rota = "", param] = location.hash.split("/");
    let html;
    if (termo) html = telas.busca(termo);
    else if (rota === "s") html = telas.situacao(param);
    else if (telas[rota] && temSecao[rota] !== false) html = telas[rota](param);
    else html = telas.inicio();
    // Algumas ilustrações são do Uruguai (bandeira, "¡TA!"); `capas` no país escolhe as que servem.
    const nomeArte = !termo && !param && CAPAS[rota];
    const arte = nomeArte && (!pais.capas || pais.capas.includes(nomeArte)) ? nomeArte : "";
    main.innerHTML = `${arte ? capa(arte) : ""}${html}<p class="versao">Viajador · versão ${VERSAO_APP} · <a href="#/creditos">Créditos das imagens</a></p>`;
    if (comemorar && rota === "album") confete();
    recemColado = null;
    comemorar = null;
    direcaoPagina = "";
    document.querySelectorAll("#abas a").forEach((a) => {
      const ativa = !termo && (a.dataset.aba === rota || (a.dataset.aba === "" && rota === "s"));
      a.classList.toggle("ativa", ativa);
      if (ativa) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#mais-botao").classList.toggle("ativa", !!$("#mais a.ativa"));
  }

  // Confete de página completa: pedaços de papel com queda, giro e cor sorteados, que somem sozinhos.
  const semMovimento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function confete() {
    if (semMovimento()) return;
    const cores = ["#f2a900", "#0b3d91", "#e4002b", "#00843d", "#8fb6ff", "#ff8a7a"];
    const caixa = document.createElement("div");
    caixa.className = "confete";
    caixa.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("i");
      p.style.cssText = `--x:${Math.random() * 100}vw;--deriva:${Math.random() * 120 - 60}px;--giro:${Math.random() * 720 - 360}deg;--atraso:${Math.random() * 0.4}s;--cor:${cores[i % cores.length]}`;
      caixa.append(p);
    }
    document.body.append(caixa);
    setTimeout(() => caixa.remove(), 2800);
  }

  // Álbum: a página vira para a frente ou para trás conforme o link, e dá para folhear deslizando o dedo.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-virar]");
    if (a) direcaoPagina = a.dataset.virar;
  });
  let toque = null;
  main.addEventListener("touchstart", (e) => { toque = e.touches.length === 1 ? [e.touches[0].clientX, e.touches[0].clientY] : null; }, { passive: true });
  main.addEventListener("touchend", (e) => {
    const [, rota, param] = location.hash.split("/");
    if (!toque || rota !== "album" || param === undefined) return;
    const dx = e.changedTouches[0].clientX - toque[0];
    const dy = e.changedTouches[0].clientY - toque[1];
    toque = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 2) return;
    const j = +param + (dx < 0 ? 1 : -1);
    if (!pais.lugares[j]) return;
    direcaoPagina = dx < 0 ? "frente" : "tras";
    location.hash = `#/album/${j}`;
  });
  // Figurinha colada inclina na direção do mouse, com o reflexo acompanhando (só com mouse).
  main.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || semMovimento()) return;
    const cartao = e.target.closest(".figurinha.colada .fig-cartao");
    if (!cartao) return;
    const r = cartao.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cartao.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    cartao.style.setProperty("--rx", `${(0.5 - y) * 18}deg`);
    cartao.style.setProperty("--mx", `${x * 100}%`);
    cartao.style.setProperty("--my", `${y * 100}%`);
    cartao.classList.add("inclinada");
  });
  main.addEventListener("pointerout", (e) => {
    const cartao = e.target.closest(".fig-cartao.inclinada");
    if (cartao && !cartao.contains(e.relatedTarget)) {
      cartao.classList.remove("inclinada");
      cartao.style.removeProperty("--rx");
      cartao.style.removeProperty("--ry");
    }
  });

  // Menu "Mais": fecha ao escolher uma seção, ao tocar fora ou com Esc.
  function abrirMais(abrir) {
    $("#mais").hidden = !abrir;
    $("#mais-botao").setAttribute("aria-expanded", abrir);
  }
  $("#mais-botao").addEventListener("click", () => abrirMais($("#mais").hidden));
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#mais-botao") && (!e.target.closest("#mais") || e.target.closest("a"))) abrirMais(false);
  });

  main.addEventListener("click", (e) => {
    const b = e.target.closest("[data-acao]");
    if (!b) return;
    if (b.dataset.acao === "instalar") {
      pedidoInstalar.prompt();
      pedidoInstalar = null;
      render();
      return;
    }
    if (b.dataset.acao === "quiz-responder") {
      if (quizAtual.escolhida !== null) return;
      quizAtual.escolhida = +b.dataset.op;
      const q = quizAtual.perguntas[quizAtual.i];
      if (q.opcoes[quizAtual.escolhida] === q.certa) quizAtual.acertos++;
      const ja = vistasQuiz[quizAtual.id] || [];
      if (!ja.includes(q.pergunta)) vistasQuiz[quizAtual.id] = [...ja, q.pergunta];
      salvarVistasQuiz();
      return render();
    }
    if (b.dataset.acao === "quiz-proxima") {
      quizAtual.i++;
      quizAtual.escolhida = null;
      if (quizAtual.i >= quizAtual.perguntas.length) {
        recordes[quizAtual.id] = Math.max(recordes[quizAtual.id] || 0, quizAtual.acertos);
        try { localStorage.setItem(CHAVE_QUIZ, JSON.stringify(recordes)); } catch (err) {}
        // Quem já deu o nome entra no ranking sem precisar de outro toque.
        if (nomeJogador) salvarNoRanking(nomeJogador);
      }
      render();
      return window.scrollTo(0, 0);
    }
    if (b.dataset.acao === "ia-enviar") {
      const p = $("#pergunta-ia").value.trim();
      if (p && !pensando) perguntarAoGuia(p);
      return;
    }
    if (b.dataset.acao === "ia-sugestao") return perguntarAoGuia(b.textContent.trim());
    if (b.dataset.acao === "ia-falar") return ouvirPergunta();
    if (b.dataset.acao === "ia-ouvir") return narrar([conversa[+b.dataset.i].texto.replace(/[*_#]/g, "")]);
    if (b.dataset.acao === "ia-limpar") {
      conversa = [];
      return render();
    }
    if (b.dataset.acao === "ia-voz") {
      lerEmVoz = b.checked;
      return;
    }
    if (b.dataset.acao === "quiz-salvar") {
      const nome = $("#nome-ranking").value.trim().slice(0, 20);
      if (!nome) return avisar("Escreva um nome");
      nomeJogador = nome;
      salvarNoRanking(nome);
      if (!rankingOnline()) avisar("Salvo no ranking");
      return render();
    }
    if (b.dataset.acao === "quiz-repetir") {
      quizAtual = null;
      return render();
    }
    if (b.dataset.acao === "gps") return pedirPosicao();
    if (b.dataset.acao === "filtro") {
      filtroCidade = b.dataset.cidade;
      verTodos = false;
      return render();
    }
    if (b.dataset.acao === "regiao") {
      filtroRegiao = b.dataset.regiao;
      return render();
    }
    if (b.dataset.acao === "roteiro-cidade") {
      const c = b.dataset.cidade;
      roteiro.cidades = roteiro.cidades.includes(c) ? roteiro.cidades.filter((x) => x !== c) : [...roteiro.cidades, c];
      salvarRoteiro();
      return render();
    }
    if (b.dataset.acao === "roteiro-dias") {
      roteiro.dias = Math.min(30, Math.max(1, roteiro.dias + Number(b.dataset.delta)));
      salvarRoteiro();
      return render();
    }
    if (b.dataset.acao === "ver-todos") {
      verTodos = true;
      return render();
    }
    if (b.dataset.acao === "narrar") return narrar(pontos().find((g) => g.id === b.dataset.guia).historia);
    if (b.dataset.acao === "quero") {
      const nome = b.dataset.lugar;
      const on = !queroIr.includes(nome);
      queroIr = on ? [...queroIr, nome] : queroIr.filter((x) => x !== nome);
      salvarMarcas();
      avisar(on ? `${nome} no roteiro Do meu jeito` : "Tirado do roteiro Do meu jeito");
      return render();
    }
    if (b.dataset.acao === "fui") {
      // Já fui tira o lugar do "Quero ir": não faz sentido ir de novo no mesmo roteiro.
      const nome = b.dataset.lugar;
      const on = !jaFui[nome];
      const antes = paginasCompletas();
      if (on) { jaFui[nome] = new Date().toISOString().slice(0, 10); queroIr = queroIr.filter((x) => x !== nome); }
      else delete jaFui[nome];
      salvarMarcas();
      if (on) {
        recemColado = nome;
        comemorar = [...paginasCompletas()].find((x) => !antes.has(x)) || null;
      }
      avisar(on ? `Figurinha colada em ${NOME_ALBUM}` : `Tirado de ${NOME_ALBUM}`);
      return render();
    }
    if (b.dataset.acao === "roteiro-limite") {
      roteiro.limite = b.dataset.limite === "" ? null : Number(b.dataset.limite);
      salvarRoteiro();
      return render();
    }
    if (b.dataset.acao === "roteiro-modo") {
      roteiro.modo = b.dataset.modo;
      salvarRoteiro();
      return render();
    }
    if (b.dataset.acao === "album-nivel") {
      nivelAlbum = b.dataset.nivel;
      return render();
    }
    const f = vistas[+b.dataset.i];
    if (b.dataset.acao === "falar") falar(f.es);
    if (b.dataset.acao === "mostrar") mostrar(f, b);
    if (b.dataset.acao === "fav") {
      const on = !favoritos.includes(f.es);
      favoritos = on ? [...favoritos, f.es] : favoritos.filter((x) => x !== f.es);
      salvarFav();
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
      b.innerHTML = marcaFav(on) + " Salvar";
      avisar(on ? "Frase salva" : "Removida dos salvos");
    }
  });

  main.addEventListener("keydown", (e) => {
    if (e.target.id === "pergunta-ia" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const p = e.target.value.trim();
      if (p && !pensando) perguntarAoGuia(p);
    }
  });

  main.addEventListener("change", (e) => {
    const id = e.target.dataset.check;
    if (!id) return;
    marcados = e.target.checked ? [...marcados, id] : marcados.filter((x) => x !== id);
    try { localStorage.setItem(CHAVE_CHECK, JSON.stringify(marcados)); } catch (err) {}
  });

  $("#mostrar-fechar").addEventListener("click", fecharMostrar);
  $("#mostrar-menos").addEventListener("click", () => mudarEscala(-1));
  $("#mostrar-mais").addEventListener("click", () => mudarEscala(1));
  $("#mostrar-girar").addEventListener("click", () => girar(!$("#mostrar").classList.contains("girada")));
  $("#mostrar-ouvir").addEventListener("click", () => falar(fraseAberta.es));
  $("#mostrar").addEventListener("click", (e) => { if (e.target.id === "mostrar") fecharMostrar(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    fecharMostrar();
    if (!$("#mais").hidden) {
      abrirMais(false);
      $("#mais-botao").focus();
    }
  });

  $("#busca").addEventListener("input", render);
  window.addEventListener("hashchange", () => {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    quizAtual = null;
    placarOnline = {};
    placarFalhou = {};
    $("#busca").value = "";
    render();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  });
  $("#pular").addEventListener("click", (e) => {
    e.preventDefault();
    main.focus();
  });
  // Tocar na aba da rota atual não muda o hash, mas deve sair da busca.
  $("#topo").addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && $("#busca").value && a.getAttribute("href") === (location.hash || "#/")) {
      $("#busca").value = "";
      render();
    }
  });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    pedidoInstalar = e;
    if (!$("#busca").value) render();
  });
  window.addEventListener("appinstalled", () => {
    pedidoInstalar = null;
    avisar("App instalado");
  });

  // Offline: só em http(s), para o site continuar abrindo direto do arquivo.
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    const primeiraVez = !navigator.serviceWorker.controller;
    // Versão nova assumiu: recarrega uma vez para não misturar arquivos antigos e novos.
    let recarregou = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (primeiraVez || recarregou) return;
      recarregou = true;
      location.reload();
    });
    navigator.serviceWorker.register("sw.js").catch(() => {});
    if (primeiraVez) navigator.serviceWorker.ready.then(() => avisar("Pronto para usar sem internet"));
  }

  // Seletor de país: a troca recarrega, porque quase todo o estado acima depende do país.
  // A bandeira fica fora da lista, desenhada: o Windows não mostra emoji de bandeira (vira "UY").
  $("#pais").innerHTML = Object.values(paises)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt"))
    .map((p) => `<option value="${esc(p.codigo)}">${esc(p.nome)}</option>`)
    .join("");
  $("#pais-bandeira").innerHTML = bandeira(pais);
  $("#pais").value = pais.codigo;
  $("#pais").addEventListener("change", (e) => {
    try { localStorage.setItem(CHAVE_PAIS, e.target.value); } catch (err) {}
    history.replaceState(null, "", "#/");
    location.reload();
  });
  document.querySelectorAll("#abas [data-aba]").forEach((a) => { a.hidden = temSecao[a.dataset.aba] === false; });
  document.title = `Viajador · ${pais.nome}`;
  $("#mostrar-es").lang = LANG;
  if (semTraducao) {
    // Destino em português é turismo, não comunicação: abre em Perto de você (ou Lugares), e Situações vira Palavras.
    const abertura = temSecao.guia ? "#/guia" : "#/lugares";
    if (["", "#", "#/"].includes(location.hash)) history.replaceState(null, "", abertura);
    $(".marca").setAttribute("href", abertura);
    $('#abas a[data-aba=""]').innerHTML = `<span class="aba-icone" aria-hidden="true">💬</span>Palavras`;
    $("#busca").placeholder = `Buscar: ${pais.girias.slice(0, 3).map((g) => g.es.toLowerCase()).join(", ")}…`;
    $("#mais a[data-aba=dicas]").textContent = "🗣️ Jeito de falar";
  }
  render();
})();
