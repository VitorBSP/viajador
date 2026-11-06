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
  const VERSAO_APP = "1.38";
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
  // Contornos para o mapa da capa do álbum, a partir do IBGE (RS, malha estadual) e do Natural Earth (Uruguai, 1:50m),
  // ambos de uso livre. `proj` leva latitude e longitude ao desenho: x = (lon·k − x0)·esc, y = (−lat − y0)·esc.
  const CONTORNOS = {
    uy: { w: 300, h: 322.8, proj: [0.845287, -49.397018, 30.101074, 66.805762], d: "M286.2 243.2 283.4 245.7 280.4 250.4 276.9 261.6 265.1 277.1 262.7 285.9 250 295 241.1 305.3 235.3 305 230 309.4 199.7 322.8 188.8 320.3 180.7 320.3 173.2 314.4 156.1 312.3 145.4 314.6 131 321.1 126.7 321 123.6 320.7 115.8 318 111.5 312.3 89.4 305.7 71.6 290.7 50.5 290.4 34.4 292.4 31.9 290.4 30.3 286.5 26.9 281 13.1 267.8 2.1 254.6 0 241.7 1.5 227.7 4.8 211 4.2 205.8 8.2 202.9 12.2 202.3 16.1 198 19.5 191.5 20.1 186.6 17.4 177.4 15.6 164.7 13.4 158.4 17.8 148.4 18 143.5 15.4 139.2 14.7 134.8 15.9 130.3 15.7 126 14.1 121.8 15.3 118.4 19.3 115.6 22.4 111.4 24.3 105.8 25.4 101.5 25.4 98.5 24.2 95.8 21.7 93.1 22.9 87.9 27.7 80.1 30.8 73.1 32.2 67 32.1 62.1 30.5 58.4 31.2 55.9 34.1 54.5 35.4 50.6 35 40.8 31.9 32.7 34.3 26.3 41 18.9 44.5 13 44.7 8.4 46.8 5.8 50 10.7 59.5 12 69.1 12.2 70.7 10.9 74.4 2.9 79.4 0.6 84.8 0 90.7 0.4 96.9 5.7 114.7 23.1 127.7 35.2 131.7 40.9 135.2 45.2 137.7 49.2 136.6 59.5 136.8 64 137.4 65.3 140.4 65.5 144.8 64.7 148.5 62.5 151.4 59.2 154.3 56.5 156.6 55 157.4 52.8 158.7 50.6 160.1 50.1 162.7 51.8 168.8 57.7 173.5 63.1 174.6 66.3 176.5 69.5 178.4 72.4 179.8 75.1 184.4 78.7 189 81 192.1 78.7 200 86.2 217.4 92.5 220.6 96.3 223.6 101.7 229.7 109.8 238.2 117.2 244.9 120.3 251.5 122.1 255.1 123.7 257.6 126.5 261.6 129.5 264.1 130.7 264.9 133.4 267.5 139.3 270.2 146.8 273.1 153.8 279.5 160.5 286.6 165.7 294 168.6 298.2 172.3 300 176.1 295 181.7 289.6 188.8 284.8 194.4 279.8 198.2 278.2 200.9 277.1 205.1 277.1 227.1 276.7 235.3 277.1 237.5 277.8 238.9 280.9 241.1 284.6 242.9 286.2 243.2Z" },
    rs: { w: 300, h: 291.6, proj: [0.867178, -49.944326, 27.0931, 43.84106], d: "M138.6 213.1 147.1 219.4 148.9 225.6 150.2 232 158 239.2 168 244 174.8 241 175.9 236.6 182.2 234.7 185.1 231.3 181.5 229.8 185.3 221.9 189 221.5 186.5 229.1 189.8 235.3 189.1 243.1 185.2 251.7 181 255.2 174.6 250.1 169.9 249.9 168 259.1 164.8 263.7 162.3 261.8 156.8 270.2 158.5 278.1 155.4 282.2 154.8 289.2 158.6 291.6 160.6 291.6 183.1 271.4 189 263.5 193.8 253.1 196.6 242.7 201.5 230 209 222.2 208.3 212.6 202.9 208.5 204.2 205.9 206.9 201.9 211.3 201.8 212.2 197.5 212.3 193.2 215.7 184.9 219.8 183.8 227.2 183.1 226.8 178 230.2 176.3 233.9 175.1 231.7 170.2 233.6 165.7 236.5 165.7 236.2 155.7 238.6 155.8 240.6 148.5 245.5 146.6 242.7 140.7 238.2 137.4 239.2 129.8 240.4 129.2 241.8 135.5 248.3 138.8 248.6 144.6 253.4 146.5 253.9 141.8 263.8 140 265.1 136.1 268.1 138.5 266.6 148.9 261 143.6 262.6 149.4 262.5 158.4 260.1 163.3 252 166.7 252.4 171.4 243.9 177.2 244.7 183.8 241.7 191.3 237 194.6 234.4 192.9 225.7 204.9 218.8 206.4 216.4 209.4 208.9 207.9 212.1 211.7 209.7 221.4 219.1 211.6 234.5 201.8 243.6 193.4 256.7 179.6 259.5 176.1 276 149.4 279.1 140.8 280.2 137.8 282.2 131.7 284.2 126.4 285.8 122.4 286.3 121.3 288 117.5 291.2 111 291.7 110.2 296.2 103 299.6 97.9 296.6 96.1 292.5 93 290.3 92.3 284.4 94.9 287.4 98.9 287.2 99.2 283.2 95.4 283.5 92.1 288.1 91.6 290.3 86.6 290.4 81.4 290.6 78.9 291.2 71.6 294.8 71 297 66.5 300 67.4 300 67.3 299.1 62.5 295.7 60.3 289.8 59.1 286.1 60.8 272.6 58.8 265.4 57 262.3 51.6 260.2 50.7 255.4 41.6 251.5 37.5 250.6 38.1 248.5 34.8 248.7 34 240.3 28.2 239 27.5 233.3 22.6 229.9 20.4 228.7 21.2 226.6 17.3 224 17 220.7 18.5 218.9 18.8 218.1 16.7 213.3 12.4 210.8 11.1 208.6 11 204.1 10.4 202.7 7.2 201.3 9.9 197.6 8.7 196.7 8.3 196.2 5.5 192.3 7.3 192 6.5 186.4 8.4 182.8 4.9 182.2 4.8 180.3 3.4 175.8 5.5 174.9 2.1 174 0 171.7 0.6 167.5 4.3 162.4 5.1 163.4 1.7 161.1 0.8 156.1 4.4 153.8 3.7 151.9 4.2 147.4 3.9 143.5 3.6 142.8 3.3 138.7 2.6 134.5 7.5 132.4 9.2 129.5 7.5 128.4 12.8 125.8 15.6 121 13.7 118.6 17 114.2 16 112.6 19.8 109.1 20.6 105.6 19.4 102.3 26.6 98.6 30.6 96.7 33.3 90.9 33.5 88.1 36.8 85.7 38.3 84.3 41.3 82 43.5 69.3 50.3 73.2 54.7 72.3 58 66.3 55.3 65 60.8 59.7 62.7 60.5 65.1 53.2 73.7 49.2 75.2 48.3 80.3 44.2 87.1 38.2 88.9 35.3 96.5 31 102 23.7 111.8 17.6 117.4 13.6 117.8 10.1 122.5 10.1 126.2 4.9 132.3 0 135.3 1 138.5 7.8 140.7 14.8 139.9 18.2 132.4 28.3 131.3 35.6 136.3 39.8 143.3 43 144.3 46.2 149.4 49.6 150.8 53.5 154 54.9 158.4 59.7 161.9 60.2 174.9 65.5 174.4 73.3 169.3 76.6 164 82 171.5 85.3 172.9 89.2 182.3 95.8 185.8 97.3 183.7 104.8 190.7 110 190.4 114.3 191.3 118.7 196.3 119.4 199.9 133.3 212.1 138.6 213.1Z" },
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

  // Chamada para o GuIA. Com `pergunta`, abre o GuIA já perguntando sobre aquilo.
  function chamadaGuia(titulo, texto, pergunta) {
    if (!temSecao.ia) return "";
    const conteudo = `<span class="chamada-icone" aria-hidden="true">✨</span>
      <span><strong>${titulo}</strong><small>${esc(texto)}</small></span>
      <span class="chamada-seta" aria-hidden="true">→</span>`;
    return pergunta
      ? `<button class="chamada-guia" data-acao="ia-atalho" data-pergunta="${esc(pergunta)}">${conteudo}</button>`
      : `<a class="chamada-guia" href="#/ia">${conteudo}</a>`;
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
  // `tirados`: lugares que a pessoa tirou do automático. `detalhes`: tudo aberto. `salvos`: Meus roteiros.
  // `trocas`: [{ de, para }] escolhidas pela pessoa no automático.
  let roteiro = { cidades: [], dias: 3, modo: "auto", tirados: [], trocas: [], detalhes: false, salvos: [] };
  // Blocos que a pessoa abriu (Ajustar, um lugar, uma troca): continuam abertos quando a tela se redesenha.
  const abertos = new Set();
  const aberto = (chave) => (abertos.has(chave) ? "open" : "");
  main.addEventListener("toggle", (e) => {
    const d = e.target;
    if (!d.dataset || !d.dataset.chave) return;
    if (d.open) abertos.add(d.dataset.chave);
    else abertos.delete(d.dataset.chave);
  }, true);
  // "Do meu jeito" sem nenhum Quero ir mostra o automático; para tudo o mais, vale como "Montar pra mim".
  const modoMeu = () => roteiro.modo === "meu" && queroIr.some((n) => lugarPorNome(n));
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
  // O que define um roteiro salvo: dois iguais nestes campos são o mesmo roteiro.
  const escolhaRoteiro = () => modoMeu()
    ? { modo: "meu", dias: roteiro.dias, limite: roteiro.limite === undefined ? 0.25 : roteiro.limite, lugares: [...queroIr].sort() }
    : { modo: "auto", dias: roteiro.dias, cidades: pais.cidades.filter((c) => roteiro.cidades.includes(c)), tirados: [...(roteiro.tirados || [])].sort(),
      trocas: [...(roteiro.trocas || [])].map((x) => `${x.de}>${x.para}`).sort() };
  const mesmaEscolha = (a, b) => JSON.stringify({ ...a, nome: 0, em: 0 }) === JSON.stringify({ ...b, nome: 0, em: 0 });

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
  // `forcar`: lugares que a pessoa escolheu numa troca; entram na frente, como os obrigatórios.
  function montarRoteiro(cidades, dias, { so = null, sem = null, forcar = null, limiteEstrada = null, podeTirarObrig = false } = {}) {
    let grupos = pais.lugares.filter((c) => cidades.includes(c.cidade)).map((c) => ({
      cidade: c.cidade,
      itens: c.itens.filter((l) => (!so || so.has(l.nome)) && !(sem && sem.has(l.nome))).map((l) => ({
        l, cidade: c.cidade, obrig: l.prioridade === "obrigatorio" || Boolean(forcar && forcar.has(l.nome)), noite: l.turno === "noite",
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
  let rankingNivel = null; // nível cujo ranking aparece na lista de níveis
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
  function responderQuiz(op) {
    const z = quizAtual;
    if (!z || z.escolhida !== null || z.i >= z.perguntas.length) return;
    const q = z.perguntas[z.i];
    if (!q.opcoes[op]) return;
    z.escolhida = op;
    z.respostas[z.i] = op;
    const acertou = q.opcoes[op] === q.certa;
    if (acertou) z.acertos++;
    z.seguidas = acertou ? z.seguidas + 1 : 0;
    const ja = vistasQuiz[z.id] || [];
    if (!ja.includes(q.pergunta)) vistasQuiz[z.id] = [...ja, q.pergunta];
    salvarVistasQuiz();
    render();
    // O resultado e o "Próxima" ficam à vista e o foco vai para o botão, para seguir com Enter ou um toque.
    const prox = $("#quiz-proxima");
    if (prox) {
      prox.focus({ preventScroll: true });
      prox.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }
  // Teclado: 1 a 4 (ou A a D) respondem a pergunta aberta.
  document.addEventListener("keydown", (e) => {
    if (!quizAtual || e.ctrlKey || e.metaKey || e.altKey || !/^#\/quiz\//.test(location.hash) || /input|textarea|select/i.test(e.target.tagName)) return;
    const op = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
    if (op >= 0 && e.key.length === 1 && quizAtual.escolhida === null) responderQuiz(op);
  });
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
      respostas: [], // índice escolhido em cada pergunta, para a barra e a revisão no fim
      seguidas: 0,
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
          <div class="tabela">${niveis.map((n) => {
            const vistas = (vistasQuiz[n.id] || []).length;
            const rec = recordes[n.id];
            return `
            <a class="item ponto nivel nivel-${n.id}" href="#/quiz/${n.id}">
              <img class="selo" src="img/arte/nivel-${n.id}.svg" alt="">
              <span class="ponto-texto">
                <strong>${esc(n.titulo)}</strong>
                <small class="suave">${esc(n.descricao)}</small>
                <span class="nivel-progresso" role="progressbar" aria-label="Perguntas vistas" aria-valuemin="0" aria-valuemax="${n.perguntas.length}" aria-valuenow="${vistas}"><span style="width:${(vistas / n.perguntas.length) * 100}%"></span></span>
                <small class="nivel-info">${vistas} de ${n.perguntas.length} vistas${rec === undefined ? "" : ` · <span class="recorde">Recorde ${rec}/${RODADA}</span>`}</small>
              </span>
            </a>`;
          }).join("")}
          </div>
          <h2>Ranking</h2>
          <p class="gps-nota">${rankingOnline() ? "Os melhores resultados de todo mundo." : "Fica só neste celular. Passe o aparelho para os amigos jogarem."}</p>
          ${niveis.length > 1 ? `<div class="filtros" role="group" aria-label="Nível do ranking">${niveis.map((n) => `
            <button class="btn ${n.id === (rankingNivel || niveis[0].id) ? "on" : ""}" data-acao="ranking-nivel" data-nivel="${n.id}" aria-pressed="${n.id === (rankingNivel || niveis[0].id)}">${n.icone} ${esc(n.titulo)}</button>`).join("")}
          </div>` : ""}
          ${niveis.length ? tabelaRanking(rankingNivel || niveis[0].id) : ""}`;
      }
      if (!quizAtual || quizAtual.id !== nivel.id) iniciarQuiz(nivel);
      const z = quizAtual;
      // Barra em segmentos: verde para acerto, vermelho para erro, contorno na pergunta atual.
      const segmentos = () => `<ol class="quiz-segmentos" aria-label="${z.acertos} ${z.acertos === 1 ? "acerto" : "acertos"} em ${z.respostas.length} ${z.respostas.length === 1 ? "resposta" : "respostas"}">${z.perguntas.map((p, k) => {
          const r = z.respostas[k];
          const estado = r === undefined ? (k === z.i ? "atual" : "") : p.opcoes[r] === p.certa ? "certa" : "errada";
          return `<li class="${estado}"></li>`;
        }).join("")}</ol>`;
      // "Era: ¿Hablás portugués?." vira "Era: ¿Hablás portugués?": ponto só quando a resposta não termina em pontuação.
      const comPonto = (s) => (/[.!?…]$/.test(s) ? s : s + ".");
      // Explicações geradas a partir de frases trazem "a-KÁ?." : tira o ponto depois de ? ou !.
      const semPontoDuplo = (s) => s.replace(/([?!])\.(?=\s|$)/g, "$1");
      if (z.i >= z.perguntas.length) {
        const erros = z.perguntas.map((p, k) => ({ p, r: z.respostas[k] })).filter((x) => x.p.opcoes[x.r] !== x.p.certa);
        return `<a class="voltar" href="#/quiz">← Níveis</a>
          <div class="quiz-resultado">
            <img class="medalha" src="img/arte/${z.acertos >= 9 ? "medalha-ouro" : z.acertos >= 7 ? "medalha-prata" : z.acertos >= 5 ? "medalha-bronze" : "mate-consolo"}.svg" alt="">
            <h1>${z.acertos} de ${z.perguntas.length}</h1>
            <p class="lead">${z.acertos === z.perguntas.length ? "Perfeito. Pode pedir a cidadania." : z.acertos >= z.perguntas.length / 2 ? "Bien ahí! Mandou bem." : "Tranqui: a seção de História ajuda."}</p>
            ${segmentos()}
            ${recordes[nivel.id] === z.acertos && z.acertos > 0 ? `<p><span class="recorde">Seu melhor resultado em ${esc(nivel.titulo)}</span></p>` : ""}
          </div>
          <button class="btn btn-principal ver-todos" data-acao="quiz-repetir">Jogar de novo, com novas perguntas</button>
          ${erros.length ? `<details class="item quiz-revisao" open>
            <summary>Revise ${erros.length === 1 ? "a que errou" : `as ${erros.length} que errou`}</summary>
            <ol>${erros.map(({ p, r }) => `<li>
              <strong>${esc(p.pergunta)}</strong>
              <p><span class="quiz-marca errada" aria-hidden="true">✗</span> <span class="sr">Sua resposta:</span> ${esc(p.opcoes[r])}</p>
              <p><span class="quiz-marca certa" aria-hidden="true">✓</span> <span class="sr">Resposta certa:</span> ${esc(p.certa)}</p>
              ${p.explica ? `<p class="suave">${esc(semPontoDuplo(p.explica))}</p>` : ""}
            </li>`).join("")}</ol>
          </details>` : ""}
          <h2>Ranking de ${esc(nivel.titulo)}</h2>
          ${z.salvo ? "" : `<label class="ranking-nome">Seu nome no ranking${rankingOnline() ? " (fica visível para todos)" : ""}
            <input id="nome-ranking" type="text" maxlength="20" value="${esc(nomeJogador)}" autocomplete="off">
          </label>
          <button class="btn btn-gps ver-todos" data-acao="quiz-salvar">Salvar no ranking</button>`}
          ${tabelaRanking(nivel.id)}
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
          <p><strong>${esc(nivel.titulo)}</strong><br><span class="suave">Pergunta ${z.i + 1} de ${z.perguntas.length}</span></p>
          <p class="quiz-placar"><span class="quiz-acertos">${z.acertos}</span> ${z.acertos === 1 ? "acerto" : "acertos"}${z.seguidas >= 3 ? `<br><span class="quiz-seguidas">${z.seguidas} seguidas</span>` : ""}</p>
        </div>
        ${segmentos()}
        <h1 class="quiz-pergunta">${esc(q.pergunta)}</h1>
        ${q.imagem ? `<img class="quiz-imagem" src="${esc(q.imagem)}" alt="Imagem da pergunta">` : ""}
        <div class="quiz-opcoes">${q.opcoes.map((o, i) => {
          const certa = o === q.certa;
          const classe = !respondida ? "" : certa ? "certa" : i === z.escolhida ? "errada" : "apagada";
          const marca = !respondida ? "" : certa ? `<span class="quiz-marca certa" aria-hidden="true">✓</span><span class="sr"> (resposta certa)</span>` : i === z.escolhida ? `<span class="quiz-marca errada" aria-hidden="true">✗</span><span class="sr"> (sua resposta)</span>` : "";
          return `<button class="quiz-opcao ${classe}" data-acao="quiz-responder" data-op="${i}" ${respondida ? "disabled" : ""}><span class="quiz-letra" aria-hidden="true">${"ABCD"[i] || ""}</span><span class="quiz-texto">${esc(o)}</span>${marca}</button>`;
        }).join("")}</div>
        ${respondida ? `<div class="quiz-retorno ${q.opcoes[z.escolhida] === q.certa ? "certa" : "errada"}" role="status">
            <strong>${q.opcoes[z.escolhida] === q.certa ? "✓ Acertou!" : "✗ Não foi dessa vez"}</strong>
            ${q.opcoes[z.escolhida] === q.certa ? "" : `<p>Resposta: <strong>${esc(comPonto(q.certa))}</strong></p>`}
            ${q.explica ? `<p>${esc(semPontoDuplo(q.explica))}</p>` : ""}
          </div>
          ${revelada}
          <button class="btn btn-principal ver-todos" id="quiz-proxima" data-acao="quiz-proxima">${z.i + 1 < z.perguntas.length ? "Próxima pergunta →" : "Ver resultado"}</button>` : ""}`;
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
          ${chamadaGuia(`Quer saber mais? Pergunte ao Gu<span class="ia">IA</span>`, `O que tem perto, quanto tempo ficar, curiosidades de ${g.lugar}.`, `Me conta mais sobre ${g.lugar}: o que não posso perder e o que tem perto?`)}
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
        ${chamadaGuia(`Não sabe aonde ir? Pergunte ao Gu<span class="ia">IA</span>`, "Ele sugere o que ver perto de você, com a sua localização.", "O que tem de interessante perto de mim agora?")}
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
        ${chamadaGuia(`Pergunte ao Gu<span class="ia">IA</span> Turístico`, "Onde comer, o que ver perto, como falar: é só perguntar.")}
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
      const meu = modoMeu();
      const meuVazio = roteiro.modo === "meu" && !meu;
      const fui = new Set(Object.keys(jaFui));
      const meus = new Set(queroIr.filter((n) => lugarPorNome(n)));
      const cidades = pais.cidades.filter((c) => roteiro.cidades.includes(c));
      const det = Boolean(roteiro.detalhes);
      const daqui = (n) => { const x = lugarPorNome(n); return x && cidades.includes(x.cidade); };
      const tirados = (roteiro.tirados || []).filter(daqui);
      const trocas = (roteiro.trocas || []).filter((x) => daqui(x.para));
      // Estrada: no automático, no máximo 25% do tempo; no "Do meu jeito", o limite que a pessoa escolher.
      const limite = meu ? (roteiro.limite === undefined ? 0.25 : roteiro.limite) : 0.25;
      const r = meu
        ? (meus.size ? montarRoteiro(pais.cidades, roteiro.dias, { so: meus, limiteEstrada: limite, podeTirarObrig: true }) : null)
        : (cidades.length ? montarRoteiro(cidades, roteiro.dias, {
          sem: new Set([...fui, ...tirados, ...trocas.map((x) => x.de)]), forcar: new Set(trocas.map((x) => x.para)), limiteEstrada: limite,
        }) : null);
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
      const trocados = new Set(trocas.map((x) => x.para));
      const opcoesTroca = (x) => {
        const grupo = pais.lugares.find((c) => c.itens.includes(x.l));
        if (!grupo) return [];
        const aqui = coordsDoLugar(x.l);
        const dist = (o) => { const c = coordsDoLugar(o); return aqui && c ? distanciaKm(aqui, c) : null; };
        return grupo.itens
          .filter((o) => o !== x.l && !noPlano.has(o.nome) && !fui.has(o.nome) && !tirados.includes(o.nome)
            && (o.turno === "noite") === x.noite && (o.minutos || MIN_PADRAO) <= x.min + 60)
          .map((o) => ({ o, km: dist(o) }))
          .sort((a, b) => (a.km === null) - (b.km === null) || a.km - b.km)
          .slice(0, 6);
      };
      const trocar = (x) => {
        // Só para o que está no roteiro: nos que ficaram de fora não há o que trocar.
        const ops = noPlano.has(x.l.nome) ? opcoesTroca(x) : [];
        if (!ops.length) return "";
        return `<details class="roteiro-trocar" data-chave="t:${esc(x.l.nome)}" ${aberto(`t:${x.l.nome}`)}>
          <summary><span aria-hidden="true">⇄</span> Trocar por outro lugar</summary>
          <p class="suave">Só o que cabe no tempo deste, ou passa no máximo 1h.</p>
          <ul class="roteiro-opcoes">${ops.map(({ o, km }) => {
            const dif = (o.minutos || MIN_PADRAO) - x.min;
            return `<li><button class="roteiro-opcao" data-acao="roteiro-trocar" data-de="${esc(x.l.nome)}" data-para="${esc(o.nome)}">
              <span><span aria-hidden="true">${o.icone}</span> <span lang="${LANG}">${esc(o.nome)}</span></span>
              <small>${formatarTempo(o.minutos || MIN_PADRAO)}${dif > 0 ? ` · ${formatarTempo(dif)} a mais` : dif < 0 ? ` · ${formatarTempo(-dif)} a menos` : ""}${km !== null ? ` · ${formatarDist(km)}` : ""}</small>
            </button></li>`;
          }).join("")}</ul>
        </details>`;
      };
      const lugar = (x) => `
        <li class="roteiro-item roteiro-lugar">
          <details data-chave="l:${esc(x.l.nome)}" ${det || abertos.has(`l:${x.l.nome}`) ? "open" : ""}>
            <summary>
              <span class="roteiro-nome"><span aria-hidden="true">${x.l.icone}</span> <span lang="${LANG}">${esc(x.l.nome)}</span>${x.l.prioridade === "obrigatorio" ? ` <span class="estrela-obrig"><span aria-hidden="true">★</span><span class="sr">obrigatório</span></span>` : ""}${trocados.has(x.l.nome) ? ` <span class="etiqueta-troca">sua troca</span>` : ""}</span>
              <span class="roteiro-tempo">${x.min > DIA_INTEIRO ? "dia inteiro" : formatarTempo(x.min)}</span>
            </summary>
            <div class="roteiro-mais">
              <p class="suave">${esc(x.l.dica)}</p>
              ${/domingo/i.test(x.l.dica) ? `<p class="frase-dica"><span aria-hidden="true">📅</span> Encaixe este num domingo.</p>` : ""}
              ${planoB(x.l)}
              ${trocar(x)}
              ${historia(x.l)}
              ${botoesLugar(x.l.nome)}
            </div>
          </details>
          <button class="btn-tirar" data-acao="roteiro-tirar" data-lugar="${esc(x.l.nome)}" aria-label="Tirar ${esc(x.l.nome)} do roteiro"><span aria-hidden="true">✕</span></button>
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
          corpo = `<li class="roteiro-item"><strong><span aria-hidden="true">🍽️</span> Jantar${c ? `: ${esc(c.nome)}` : ""}</strong>${c && det ? `<p class="suave">${esc(c.desc)}</p>` : ""}</li>`;
        }
        if (!corpo) corpo = `<li class="roteiro-item"><strong>Tempo livre</strong>${det ? `<p class="suave">Para descansar, comer bem ou voltar a um lugar de que gostou.</p>` : ""}</li>`;
        return `<div class="roteiro-turno"><h3>${rotulo}</h3><ol class="roteiro-lista">${corpo}</ol></div>`;
      };
      const qtd = r ? [...r.escolhidos].filter((x) => x.l.prioridade === "obrigatorio").length : 0;
      const modo = (id, rotulo) => `<button class="btn ${(roteiro.modo || "auto") === id ? "on" : ""}" data-acao="roteiro-modo" data-modo="${id}" aria-pressed="${(roteiro.modo || "auto") === id}">${rotulo}</button>`;
      const dias = `${roteiro.dias} ${roteiro.dias === 1 ? "dia" : "dias"}`;
      // Escolhas do roteiro: abertas enquanto não há roteiro; depois viram uma linha de resumo que abre ao tocar.
      const ajustes = `<p class="lead">${meu
          ? "Os lugares que você marcou com Quero ir, na melhor ordem, em manhã, tarde e noite, com o tempo de estrada."
          : `Escolha as ${nome} e quantos dias vai ficar. O roteiro se monta sozinho: primeiro o obrigatório, depois o recomendado, na ordem do caminho.`}</p>
        ${meu ? "" : `<div class="filtros" role="group" aria-label="${semTraducao ? "Regiões" : "Cidades"}">${pais.cidades.map((c) => `
          <button class="btn ${cidades.includes(c) ? "on" : ""}" data-acao="roteiro-cidade" data-cidade="${esc(c)}" aria-pressed="${cidades.includes(c)}">${esc(c)}</button>`).join("")}
        </div>`}
        ${meu ? `<div class="filtros" role="group" aria-label="Tempo máximo em estrada"><span class="filtros-rotulo">Estrada, no máximo:</span>${[[0.15, "15%"], [0.25, "25%"], [0.4, "40%"], [null, "Sem limite"]].map(([v, rot]) => `
          <button class="btn ${limite === v ? "on" : ""}" data-acao="roteiro-limite" data-limite="${v === null ? "" : v}" aria-pressed="${limite === v}">${rot}</button>`).join("")}
        </div>` : ""}
        <div class="roteiro-dias" role="group" aria-label="Dias de viagem">
          <button class="btn" data-acao="roteiro-dias" data-delta="-1" aria-label="Menos um dia" ${roteiro.dias <= 1 ? "disabled" : ""}>−</button>
          <strong aria-live="polite">${dias}</strong>
          <button class="btn" data-acao="roteiro-dias" data-delta="1" aria-label="Mais um dia" ${roteiro.dias >= 30 ? "disabled" : ""}>+</button>
        </div>`;
      const resumo = meu ? `${meus.size} ${meus.size === 1 ? "lugar" : "lugares"} · ${dias}` : `${cidades.join(", ")} · ${dias}`;
      const salvos = roteiro.salvos || [];
      const atual = escolhaRoteiro();
      const salvo = salvos.some((s) => mesmaEscolha(s, atual));
      const listaSalvos = salvos.length ? `<details class="item roteiro-salvos" data-chave="salvos" ${aberto("salvos")}>
          <summary><span aria-hidden="true">📌</span> Meus roteiros (${salvos.length})</summary>
          <ul class="roteiro-salvos-lista">${salvos.map((s, i) => `
            <li>
              <button class="roteiro-abrir" data-acao="roteiro-abrir" data-i="${i}">${esc(s.nome)}<small>${s.modo === "meu" ? "Do meu jeito" : "Montar pra mim"}${mesmaEscolha(s, atual) ? " · aberto agora" : ""}</small></button>
              <button class="btn-tirar" data-acao="roteiro-apagar" data-i="${i}" aria-label="Apagar o roteiro ${esc(s.nome)}"><span aria-hidden="true">🗑️</span></button>
            </li>`).join("")}
          </ul>
        </details>` : "";
      return `<p class="kicker"><span aria-hidden="true">✨</span> Assistente de viagem</p>
        <h1>Roteiro</h1>
        ${listaSalvos}
        <div class="filtros roteiro-modos" role="group" aria-label="Como montar o roteiro">${modo("auto", "Montar pra mim")}${modo("meu", `Do meu jeito${meus.size ? ` (${meus.size})` : ""}`)}</div>
        ${meuVazio ? `<p class="frase-dica roteiro-aviso"><span aria-hidden="true">💡</span> Você ainda não marcou nenhum lugar com ＋ Quero ir. Enquanto isso, ${r ? "este é o roteiro do <strong>Montar pra mim</strong>" : `o <strong>Montar pra mim</strong> monta um para você: escolha as ${nome} abaixo`}. Toque num lugar e em ＋ Quero ir (aqui, em <a href="#/guia">Perto de você</a> ou em <a href="#/lugares">Lugares</a>) para montar do seu jeito.</p>` : ""}
        ${!r ? `${ajustes}<p class="vazio">Toque em uma ou mais ${nome} para começar.</p>` : `
          <details class="item roteiro-ajustes" data-chave="ajustes" ${aberto("ajustes")}>
            <summary><span class="roteiro-resumo">${esc(resumo)}</span><span class="roteiro-ajustar">Ajustar</span></summary>
            ${ajustes}
          </details>
          <div class="roteiro-barra">
            <button class="btn ${salvo ? "on" : ""}" data-acao="roteiro-salvar" aria-pressed="${salvo}">${salvo ? "✓ Salvo" : `<span aria-hidden="true">📌</span> Salvar roteiro`}</button>
            <button class="btn" data-acao="roteiro-detalhes" aria-pressed="${det}">${det ? "Menos detalhes" : "Mais detalhes"}</button>
          </div>
          <p class="gps-nota">${r.escolhidos.size} ${r.escolhidos.size === 1 ? "lugar" : "lugares"}${meu && r.escolhidos.size < meus.size ? ` de ${meus.size}` : ""} · estrada ${Math.round(r.estrada.fracao * 100)}% do tempo${det ? `${limite !== null ? ` (limite de ${Math.round(limite * 100)}%)` : ""}. ${meu ? "" : `${qtd} ${qtd === 1 ? "obrigatório" : "obrigatórios"} (★). `}Tempos e estradas são estimativas.` : ""}</p>
          ${(tirados.length || trocas.length) && !meu ? `<p class="gps-nota">Você ${[tirados.length ? `tirou ${tirados.length} ${tirados.length === 1 ? "lugar" : "lugares"}` : "", trocas.length ? `trocou ${trocas.length}` : ""].filter(Boolean).join(" e ")}. <button class="link-btn" data-acao="roteiro-devolver">Desfazer</button></p>` : ""}
          ${det && r.longe.length ? `<p class="gps-nota">Para a estrada não passar do limite, ${r.longe.length === 1 ? "ficou de fora" : "ficaram de fora"}: ${r.longe.map((x) => esc(x.l.nome)).join(", ")}.${meu ? " Aumente o limite de estrada para incluir." : " Para incluir, use o Do meu jeito e escolha um limite maior."}</p>` : ""}
          ${det && limite !== null && r.estrada.fracao > limite ? `<p class="gps-nota">Mesmo com poucos lugares, a estrada passa do limite: as regiões escolhidas são longe umas das outras.</p>` : ""}
          ${det && visitados ? `<p class="gps-nota">${visitados === 1 ? "Um lugar onde você já foi ficou" : `${visitados} lugares onde você já foi ficaram`} de fora. Para incluir de novo, desmarque Já fui.</p>` : ""}
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
          ${!meu && r.sobras.length ? `<details class="item roteiro-fora" data-chave="sobras" ${det || abertos.has("sobras") ? "open" : ""}><summary>Se sobrar tempo: mais ${r.sobras.length} ${r.sobras.length === 1 ? "lugar" : "lugares"}</summary><ol class="roteiro-lista">${r.sobras.map(lugar).join("")}</ol></details>` : ""}`}`;
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
      const pctTotal = todos.length ? Math.round((coladas / todos.length) * 100) : 0;
      return `<section class="album-capa ${CONTORNOS[pais.codigo] ? "com-mapa" : ""}">
          ${mapaDoAlbum(pctTotal, nivel[3])}
          <div class="capa-texto">
            <p class="capa-kicker">Álbum de figurinhas</p>
            <h1>${NOME_ALBUM}</h1>
            <p class="capa-sub">${esc(pais.nome)} · ${pais.lugares.length} páginas</p>
            <p class="capa-pct"><strong>${pctTotal}%</strong> ${pctTotal === 100 ? "do álbum completo!" : "do mapa pintado com a bandeira"}</p>
            <a class="btn capa-abrir" href="#/album/0" data-virar="frente">Abrir o álbum</a>
          </div>
          <p class="capa-selo"><strong>${coladas}</strong><small>de ${todos.length}</small></p>
        </section>
        <p class="lead">Marque com “Já fui” os lugares que você conheceu ${esc(doNome)} e cole as figurinhas. Fica só neste aparelho.</p>
        <div class="filtros" role="group" aria-label="Nível do álbum">${NIVEIS_ALBUM.map(([id, rotulo]) => `
          <button class="btn ${id === nivel[0] ? "on" : ""}" data-acao="album-nivel" data-nivel="${id}" aria-pressed="${id === nivel[0]}">${rotulo}</button>`).join("")}
        </div>
        ${barra(k, `${nivel[1]} <small>${nivel[2]}</small>`)}
        <h2>Páginas</h2>
        <div class="album-indice">${pais.lugares.map((x, i) => {
          const p = contaAlbum(x.itens, nivel[3]);
          const completa = p.total && p.feitos === p.total;
          // Foto de capa da página: a do primeiro lugar que tem foto, em cinza até a página ir sendo completada.
          const comFoto = x.itens.map((l) => pontos().find((g) => g.lugar === l.nome)).find((g) => g && fotoLugar(g.id));
          return `<a class="miniatura ${completa ? "completa" : ""}" href="#/album/${i}" data-virar="frente" style="--p:${p.pct}">
            ${comFoto ? `<span class="mini-foto"><img src="${fotoLugar(comFoto.id)}" alt="" loading="lazy"></span>` : ""}
            <span class="mini-num">${i + 1}</span>
            <strong>${esc(x.cidade)}</strong>
            <span class="mini-slots" aria-hidden="true">${x.itens.filter(nivel[3]).map((l) => `<i class="${jaFui[l.nome] ? "on" : ""}"></i>`).join("")}</span>
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

  // Mapa da capa do álbum: o contorno vai se enchendo com a bandeira, de baixo para cima, na proporção das figurinhas
  // coladas; o resto fica em cinza. Cada cidade ou região vira um alfinete na média das coordenadas dos seus pontos.
  function mapaDoAlbum(pct, filtroNivel) {
    const c = CONTORNOS[pais.codigo];
    if (!c) return "";
    const [k, x0, y0, e] = c.proj;
    const ponto = ([lat, lon]) => [(lon * k - x0) * e, (-lat - y0) * e];
    const miolo = (BANDEIRAS[pais.codigo] || "").replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
    const flag = `<svg width="${c.w}" height="${c.h}" viewBox="0 0 27 18" preserveAspectRatio="xMidYMid slice">${miolo}</svg>`;
    const altura = (c.h * pct) / 100;
    const pinos = pais.lugares.map((x, i) => {
      const cs = pontos().filter((g) => lugarDo(g).cidade === x.cidade).map((g) => g.coords);
      if (!cs.length) return "";
      const [px, py] = ponto([cs.reduce((s, q) => s + q[0], 0) / cs.length, cs.reduce((s, q) => s + q[1], 0) / cs.length]);
      const p = contaAlbum(x.itens, filtroNivel).pct;
      return `<a href="#/album/${i}" data-virar="frente" tabindex="-1" class="pino ${p === 100 ? "completo" : ""}" style="--p:${p}">
        <title>${esc(x.cidade)}: ${p}%</title>
        <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9"/>
        ${p === 100 ? `<path d="M${(px - 4).toFixed(1)} ${py.toFixed(1)}l3 3 5-6" />` : ""}
      </a>`;
    }).join("");
    return `<svg class="capa-mapa" viewBox="-12 -12 ${c.w + 24} ${c.h + 24}" role="img" aria-label="Mapa ${esc(doNome)}: ${pct}% pintado com a bandeira">
      <defs>
        <clipPath id="album-contorno"><path d="${c.d}"/></clipPath>
        <clipPath id="album-nivel"><rect class="mapa-nivel" x="-12" y="${(c.h - altura).toFixed(1)}" width="${c.w + 24}" height="${(altura + 12).toFixed(1)}"/></clipPath>
        <filter id="album-cinza"><feColorMatrix type="saturate" values="0"/></filter>
      </defs>
      <path class="mapa-sombra" d="${c.d}"/>
      <g clip-path="url(#album-contorno)">
        <rect x="-12" y="-12" width="${c.w + 24}" height="${c.h + 24}" fill="#fff" opacity=".22"/>
        <g filter="url(#album-cinza)" opacity=".5">${flag}</g>
        <g clip-path="url(#album-nivel)">${flag}</g>
      </g>
      <path class="mapa-borda" d="${c.d}"/>
      ${pinos}
    </svg>`;
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
      return responderQuiz(+b.dataset.op);
    }
    if (b.dataset.acao === "ranking-nivel") {
      rankingNivel = b.dataset.nivel;
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
    if (b.dataset.acao === "ia-atalho") {
      location.hash = "#/ia";
      return perguntarAoGuia(b.dataset.pergunta);
    }
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
    if (b.dataset.acao === "roteiro-tirar") {
      // No Do meu jeito, tirar é desmarcar o Quero ir; no automático, o lugar fica de fora até Devolver.
      const nome = b.dataset.lugar;
      if (modoMeu()) {
        queroIr = queroIr.filter((x) => x !== nome);
        salvarMarcas();
      } else {
        // Tirar um lugar que veio de uma troca desfaz a troca, e o original continua de fora.
        const t = (roteiro.trocas || []).find((x) => x.para === nome);
        roteiro.trocas = (roteiro.trocas || []).filter((x) => x !== t);
        roteiro.tirados = [...new Set([...(roteiro.tirados || []), t ? t.de : nome])];
        salvarRoteiro();
      }
      avisar(`${nome} saiu do roteiro`);
      return render();
    }
    if (b.dataset.acao === "roteiro-trocar") {
      const { de, para } = b.dataset;
      if (modoMeu()) {
        queroIr = [...queroIr.filter((x) => x !== de), para];
        salvarMarcas();
      } else {
        // Trocar de novo um lugar que já veio de troca mantém o original; voltar ao original desfaz a troca.
        const antiga = (roteiro.trocas || []).find((x) => x.para === de);
        const original = antiga ? antiga.de : de;
        roteiro.trocas = (roteiro.trocas || []).filter((x) => x !== antiga);
        if (para !== original) roteiro.trocas.push({ de: original, para });
        salvarRoteiro();
      }
      abertos.delete(`t:${de}`);
      abertos.add(`l:${para}`);
      avisar(`${de} trocado por ${para}`);
      return render();
    }
    if (b.dataset.acao === "roteiro-devolver") {
      const daqui = (n) => { const x = lugarPorNome(n); return x && roteiro.cidades.includes(x.cidade); };
      roteiro.tirados = (roteiro.tirados || []).filter((n) => !daqui(n));
      roteiro.trocas = (roteiro.trocas || []).filter((x) => !daqui(x.para));
      salvarRoteiro();
      avisar("Roteiro como o app montou");
      return render();
    }
    if (b.dataset.acao === "roteiro-detalhes") {
      roteiro.detalhes = !roteiro.detalhes;
      [...abertos].filter((k) => /^l:/.test(k)).forEach((k) => abertos.delete(k));
      salvarRoteiro();
      return render();
    }
    if (b.dataset.acao === "roteiro-salvar") {
      // Tocar de novo em "Salvo" tira de Meus roteiros.
      const atual = escolhaRoteiro();
      roteiro.salvos = roteiro.salvos || [];
      const i = roteiro.salvos.findIndex((s) => mesmaEscolha(s, atual));
      if (i >= 0) {
        roteiro.salvos.splice(i, 1);
        avisar("Tirado de Meus roteiros");
      } else {
        const dias = `${atual.dias} ${atual.dias === 1 ? "dia" : "dias"}`;
        const nome = atual.modo === "meu" ? `Do meu jeito: ${atual.lugares.length} lugares, ${dias}` : `${atual.cidades.join(", ")}: ${dias}`;
        roteiro.salvos.unshift({ ...atual, nome, em: new Date().toISOString().slice(0, 10) });
        avisar("Roteiro salvo neste aparelho");
      }
      salvarRoteiro();
      return render();
    }
    if (b.dataset.acao === "roteiro-abrir") {
      const s = roteiro.salvos[+b.dataset.i];
      roteiro.modo = s.modo;
      roteiro.dias = s.dias;
      if (s.modo === "meu") {
        roteiro.limite = s.limite;
        queroIr = s.lugares.filter((n) => lugarPorNome(n));
        salvarMarcas();
      } else {
        // Os tirados de outras regiões continuam; os destas voltam a ser os do roteiro salvo.
        roteiro.cidades = s.cidades;
        const fora = (n) => { const x = lugarPorNome(n); return x && !s.cidades.includes(x.cidade); };
        roteiro.tirados = [...(roteiro.tirados || []).filter(fora), ...s.tirados];
        roteiro.trocas = [...(roteiro.trocas || []).filter((x) => fora(x.para)), ...(s.trocas || []).map((x) => { const [de, para] = x.split(">"); return { de, para }; })];
      }
      salvarRoteiro();
      avisar(`Aberto: ${s.nome}`);
      render();
      return window.scrollTo(0, 0);
    }
    if (b.dataset.acao === "roteiro-apagar") {
      const [s] = roteiro.salvos.splice(+b.dataset.i, 1);
      salvarRoteiro();
      avisar(`Apagado: ${s.nome}`);
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
