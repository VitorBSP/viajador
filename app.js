(function () {
  const pais = window.VIAJADOR.paises.uy;
  const $ = (s) => document.querySelector(s);
  const main = $("#conteudo");
  const CHAVE_FAV = "viajador:favoritos";
  const CHAVE_ESCALA = "viajador:escala";
  const CHAVE_CHECK = "viajador:checklist";
  const CHAVE_QUIZ = "viajador:quiz";
  const CHAVE_QUIZ_VISTAS = "viajador:quiz-vistas";
  const RODADA = 10;
  const CHAVE_RANKING = "viajador:ranking";
  const CHAVE_NOME = "viajador:nome";
  const VERSAO_APP = "13";
  const SUPABASE = window.VIAJADOR_SUPABASE || {};
  const rankingOnline = () => Boolean(SUPABASE.url && SUPABASE.chave);
  const TAM_RANKING = 10;
  const ESCALAS = [0.75, 1, 1.25, 1.5, 1.85];
  // Atalhos da tela inicial: `chave` é um trecho da frase em espanhol, procurado no conteúdo do país.
  const RAPIDAS = [
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

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const normal = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Índice de todas as frases, para busca e favoritos.
  const todas = [];
  pais.situacoes.forEach((s) => s.frases.forEach((f) => todas.push({ ...f, origem: s.titulo })));
  pais.lugares.forEach((c) => c.itens.forEach((l) => l.frases.forEach((f) => todas.push({ ...f, origem: l.nome }))));
  pais.comidas.forEach((c) => todas.push({ es: c.pedir, pt: c.nome + " — " + c.desc, pr: "", origem: "Comidas" }));
  const giriaFrase = (g) => ({ es: g.es, pr: g.pr, pt: g.pt, ex: g.ex, dica: g.ex ? "" : g.dica });
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
    u.lang = voz ? voz.lang : "es-UY";
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
      <p class="frase-es" lang="es">${destacar(f.es)}</p>
      ${f.pr ? `<span class="frase-pr"><span aria-hidden="true">🗣️</span> ${esc(f.pr)}</span>` : ""}
      <p class="frase-pt">${destacar(f.pt)}</p>
      ${f.dica ? `<p class="frase-dica"><span aria-hidden="true">💡</span> ${destacar(f.dica)}</p>` : ""}
      ${f.ex ? `<p class="frase-dica">Ex.: <span lang="es">${destacar(f.ex)}</span></p>` : ""}
      <div class="frase-acoes">
        <button class="btn" data-acao="falar" data-i="${i}"><span aria-hidden="true">🔊</span> Ouvir</button>
        <button class="btn" data-acao="mostrar" data-i="${i}"><span aria-hidden="true">⛶</span> Mostrar</button>
        <button class="btn ${fav ? "on" : ""}" data-acao="fav" data-i="${i}" aria-pressed="${fav}">${marcaFav(fav)} Salvar</button>
      </div>
    </article>`;
  }
  const lista = (frases) => `<div class="lista">${frases.map(cartaoFrase).join("")}</div>`;

  function rapidas() {
    const botoes = RAPIDAS.map((r) => {
      const f = todas.find((x) => normal(x.es).includes(normal(r.chave)));
      if (!f) return "";
      return `<button class="rapida" data-acao="mostrar" data-i="${vistas.push(f) - 1}">
        <span class="emoji" aria-hidden="true">${r.icone}</span>
        ${esc(r.rotulo)}<span class="sr">: <span lang="es">${esc(f.es)}</span></span>
      </button>`;
    }).join("");
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
  let posicao = null;
  let estadoGps = "";
  let filtroCidade = "";
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

  const momentos = (itens) => `<ol class="linha-tempo">${itens.map((m) => `
    <li><span class="linha-data">${esc(m.data)}</span><strong>${esc(m.titulo)}</strong><p class="suave">${esc(m.texto)}</p></li>`).join("")}</ol>`;
  const pessoas = (itens) => `<div class="tabela">${itens.map((p) => `
    <div class="item"><h3>${esc(p.nome)}</h3><p class="ponto-dist">${p.area ? `${esc(p.area)} · ` : ""}${esc(p.origem)}</p><p class="suave">${esc(p.texto)}</p></div>`).join("")}</div>`;
  const cartoes = (itens) => `<div class="tabela">${itens.map((c) => `<div class="item"><h3>${esc(c.titulo)}</h3><p class="suave">${esc(c.texto)}</p></div>`).join("")}</div>`;
  const secao = (titulo, itens, html) => (itens.length ? `<h2>${titulo}</h2>${html(itens)}` : "");

  const telas = {
    origem() {
      const h = (pais.historias || [])[0];
      return `<h1>🇺🇾 Como nasceu o Uruguai</h1>
        <p class="lead">Banda Oriental, Província Oriental, Províncias Unidas, e o papel de Argentina, Brasil e Inglaterra.</p>
        ${cartoes(h.fundacao || [])}
        ${secao("Linha do tempo", h.momentos.filter((m) => /^1[6-8]/.test(m.data)), momentos)}
        <a class="btn btn-gps ver-todos" href="#/historia/uruguai">Ver a História completa</a>
        <a class="btn btn-gps ver-todos" href="#/quiz/uruguaio">Fazer o quiz Quase uruguaio</a>
        <h2>Fontes</h2>
        <ul class="fontes">${h.fontes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`).join("")}</ul>`;
    },
    futebol() {
      const f = pais.futebol;
      return `<h1>⚽ Futebol uruguaio</h1>
        <p class="lead">${esc(f.intro)}</p>
        ${secao("Títulos", f.titulos, cartoes)}
        ${secao("Momentos que marcaram", f.momentos, momentos)}
        ${secao("Peñarol, Nacional e os outros", f.clubes, cartoes)}
        ${secao("Estádios", f.estadios, cartoes)}
        <a class="btn btn-gps ver-todos" href="#/guia/estadio-centenario">Ver a história do Centenario</a>
        ${secao("Ídolos", f.idolos, pessoas)}
        ${secao("Cultura do futebol", f.cultura, cartoes)}
        ${secao("Como ir a um jogo", f.jogo, cartoes)}
        <h2>Frases para o jogo</h2>
        ${lista(f.frases)}
        <a class="btn btn-gps ver-todos" href="#/quiz/futebol">Fazer o quiz de futebol</a>
        <h2>Fontes</h2>
        <ul class="fontes">${f.fontes.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.titulo)}</a></li>`).join("")}</ul>`;
    },
    historia(id) {
      const lista = pais.historias || [];
      const h = lista.find((x) => x.id === id) || lista[0];
      return `<h1>${h.icone} ${esc(h.titulo)}</h1>
        <p class="lead">${esc(h.intro)}</p>
        <div class="filtros" role="group" aria-label="Escolher país ou cidade">${lista.map((x) => `
          <a class="btn ${x.id === h.id ? "on" : ""}" href="#/historia/${x.id}"${x.id === h.id ? ' aria-current="page"' : ""}>${esc(x.titulo)}</a>`).join("")}
        </div>
        ${secao("Como nasceu o Uruguai", h.fundacao || [], cartoes)}
        ${secao("Momentos históricos", h.momentos, momentos)}
        ${secao("Costumes", h.costumes, cartoes)}
        ${secao("Pessoas históricas", h.pessoas, pessoas)}
        ${secao("Estrelas", h.estrelas, pessoas)}
        ${secao("Datas importantes", h.datas, momentos)}
        <a class="btn btn-gps ver-todos" href="#/quiz">Testar o que aprendi no quiz</a>
        <h2>Fontes</h2>
        <ul class="fontes">${h.fontes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`).join("")}</ul>`;
    },
    quiz(id) {
      const niveis = pais.quiz || [];
      const nivel = niveis.find((x) => x.id === id);
      if (!nivel) {
        return `<h1>Quiz do Uruguai</h1>
          <p class="lead">Três níveis gerais e um de futebol. Cada rodada tem 10 perguntas, e elas só se repetem depois que você vir todas.</p>
          <div class="tabela">${niveis.map((n) => `
            <a class="item ponto" href="#/quiz/${n.id}">
              <span class="emoji" aria-hidden="true">${n.icone}</span>
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
          <h1>${nivel.icone} ${z.acertos} de ${z.perguntas.length}</h1>
          <p class="lead">${z.acertos === z.perguntas.length ? "Perfeito. Pode pedir a cidadania." : z.acertos >= z.perguntas.length / 2 ? "Bien ahí! Mandou bem." : "Tranqui: a seção de História ajuda."}</p>
          ${z.salvo ? "" : `<label class="ranking-nome">Seu nome no ranking${rankingOnline() ? " (fica visível para todos)" : ""}
            <input id="nome-ranking" type="text" maxlength="20" value="${esc(nomeJogador)}" autocomplete="off">
          </label>
          <button class="btn btn-gps ver-todos" data-acao="quiz-salvar">Salvar no ranking</button>`}
          <h2>Ranking de ${esc(nivel.titulo)}</h2>
          ${tabelaRanking(nivel.id)}
          <button class="btn btn-gps ver-todos" data-acao="quiz-repetir">Jogar com novas perguntas</button>
          <a class="btn btn-gps ver-todos" href="#/historia">Rever a História</a>`;
      }
      const q = z.perguntas[z.i];
      const respondida = z.escolhida !== null;
      return `<a class="voltar" href="#/quiz">← Níveis</a>
        <p class="ponto-dist">${esc(nivel.titulo)} · Pergunta ${z.i + 1} de ${z.perguntas.length} · ${z.acertos} ${z.acertos === 1 ? "acerto" : "acertos"}</p>
        <h1 class="quiz-pergunta">${esc(q.pergunta)}</h1>
        <div class="quiz-opcoes">${q.opcoes.map((o, i) => {
          const classe = !respondida ? "" : o === q.certa ? "certa" : i === z.escolhida ? "errada" : "";
          return `<button class="quiz-opcao ${classe}" data-acao="quiz-responder" data-op="${i}" ${respondida ? "disabled" : ""}>${esc(o)}</button>`;
        }).join("")}</div>
        ${respondida ? `<p class="frase-dica" role="status"><strong>${q.opcoes[z.escolhida] === q.certa ? "Acertou." : `Era: ${esc(q.certa)}.`}</strong> ${esc(q.explica)}</p>
          <button class="btn btn-gps ver-todos" data-acao="quiz-proxima">${z.i + 1 < z.perguntas.length ? "Próxima pergunta" : "Ver resultado"}</button>` : ""}`;
    },
    guia(id) {
      const g = pontos().find((x) => x.id === id);
      if (g) {
        const l = lugarDo(g);
        return `<a class="voltar" href="#/guia">← Perto de você</a>
          <h1 lang="es">${l.icone} ${esc(g.lugar)}</h1>
          <p class="lead">${esc(l.cidade)}${posicao ? ` · a ${formatarDist(distanciaKm(posicao, g.coords))} de você` : ""}</p>
          <div class="frase-acoes"><button class="btn" data-acao="narrar" data-guia="${esc(g.id)}"><span aria-hidden="true">🔊</span> Ouvir a história</button></div>
          <div class="historia">${g.historia.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <p class="frase-dica"><strong>O que reparar:</strong> ${esc(g.reparar)}</p>
          <p class="frase-dica"><strong>Dica:</strong> ${esc(l.dica)}</p>
          <h2>Frases para este lugar</h2>
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
      const filtros = [["", "Todas"], ...pais.lugares.map((c) => [c.cidade, c.cidade])];
      return `<h1>Perto de você</h1>
        <p class="lead">${pontos().length} lugares com história. Funciona sem internet, menos os links das fontes.</p>
        <button class="btn btn-gps" data-acao="gps"><span aria-hidden="true">📍</span> ${posicao ? "Atualizar localização" : "Usar minha localização"}</button>
        <p class="gps-nota">${esc(estadoGps || "Sua localização fica só neste aparelho e é usada para ordenar a lista.")}</p>
        <div class="filtros" role="group" aria-label="Filtrar por cidade">${filtros.map(([v, r]) => `
          <button class="btn ${v === filtroCidade ? "on" : ""}" data-acao="filtro" data-cidade="${esc(v)}" aria-pressed="${v === filtroCidade}">${esc(r)}</button>`).join("")}
        </div>
        <div class="tabela">${visiveis.map(({ p, km, l }) => `
          <a class="item ponto" href="#/guia/${p.id}">
            <span class="emoji" aria-hidden="true">${l.icone}</span>
            <span class="ponto-texto">
              <strong lang="es">${esc(p.lugar)}</strong>
              <small class="suave">${esc(p.resumo)}</small>
              <small class="ponto-dist">${esc(l.cidade)}${km === null ? "" : ` · ${formatarDist(km)}`}</small>
            </span>
          </a>`).join("")}
        </div>
        ${visiveis.length < ordem.length ? `<button class="btn btn-gps ver-todos" data-acao="ver-todos">Ver todos os ${ordem.length}</button>` : ""}`;
    },
    inicio() {
      return `${rapidas()}
        <div class="intro">${esc(pais.intro)}</div>
        <h1>O que você precisa agora?</h1>
        <p class="lead">Toque na situação, ouça a frase ou mostre a tela.</p>
        <div class="grade">${pais.situacoes.map((s) => `
          <a class="categoria" href="#/s/${s.id}">
            <span class="emoji" aria-hidden="true">${s.icone}</span>
            <strong>${esc(s.titulo)}</strong>
            <small>${s.frases.length} frases</small>
          </a>`).join("")}
        </div>
        ${instalar()}`;
    },
    situacao(id) {
      const s = pais.situacoes.find((x) => x.id === id);
      if (!s) return telas.inicio();
      return `<a class="voltar" href="#/">← Situações</a>
        <h1>${s.icone} ${esc(s.titulo)}</h1>
        <p class="lead">${s.frases.length} frases úteis</p>
        ${lista(s.frases)}`;
    },
    conversas(id) {
      const c = (pais.conversas || []).find((x) => x.id === id);
      if (!c) {
        return `<h1>Conversas prontas</h1>
          <p class="lead">O que dizer e o que vão te responder, na ordem em que acontece.</p>
          <div class="grade">${(pais.conversas || []).map((x) => `
            <a class="categoria" href="#/conversas/${x.id}">
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
        <p class="lead">Dicas e frases para cada ponto turístico.</p>
        ${pais.lugares.map((c) => `
          <h2>${esc(c.cidade)}</h2>
          ${c.itens.map((l) => `
            <section class="item lugar">
              <div class="lugar-topo"><span aria-hidden="true">${l.icone}</span><h3 lang="es">${esc(l.nome)}</h3></div>
              <p class="suave">${esc(l.dica)}</p>
              ${pontos().filter((g) => g.lugar === l.nome).map((g) => `<a class="voltar" href="#/guia/${g.id}">Conhecer a história →</a>`).join("")}
              ${lista(l.frases)}
            </section>`).join("")}`).join("")}
        <h2>Comidas típicas</h2>
        <div class="tabela">${pais.comidas.map((c) => `
          <div class="item">
            <h3 lang="es">${esc(c.nome)}</h3>
            <p class="suave">${esc(c.desc)}</p>
            ${lista([{ es: c.pedir, pt: "Como pedir", pr: "" }])}
          </div>`).join("")}
        </div>`;
    },
    girias() {
      return `<h1>Gírias uruguaias</h1>
        <p class="lead">Para entender a conversa (e soltar uma de vez em quando).</p>
        ${lista(pais.girias.map(giriaFrase))}`;
    },
    ditados() {
      return `<h1>Ditados e expressões</h1>
        <p class="lead">Frases feitas que você vai ouvir por aí.</p>
        ${lista(pais.ditados.map(ditadoFrase))}
        <h2>Cuidado: falsos amigos</h2>
        <p class="lead">Palavras parecidas com o português, mas com outro sentido.</p>
        <div class="tabela">${pais.falsosAmigos.map((f) => `
          <div class="item">
            <h3 lang="es">${esc(f.es)}</h3>
            <p class="${f.pt.startsWith("⚠️") ? "alerta" : ""}">= ${esc(f.pt)}</p>
            <p class="suave">Não é: ${esc(f.errado)}</p>
          </div>`).join("")}
        </div>`;
    },
    dicas() {
      return `<h1>Pronúncia sem sufoco</h1>
        <p class="lead">As regras que mais fazem diferença para quem fala português. A sílaba em MAIÚSCULA é a forte.</p>
        <div class="tabela">${pais.pronuncia.map((p) => `
          <div class="item">
            <h3>${esc(p.regra)}</h3>
            <p lang="es">${esc(p.ex)}</p>
            ${p.dica ? `<p class="suave"><span aria-hidden="true">💡</span> ${esc(p.dica)}</p>` : ""}
          </div>`).join("")}
        </div>`;
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
            <span class="ponto-texto"><strong lang="es">${destacar(g.lugar)}</strong><small class="suave">${destacar(g.resumo)}</small></span>
          </a>`).join("")}</div>` : ""}
        ${achou.length ? lista(achou) : ""}
        ${naHistoria.length ? `<h2>Na História</h2><div class="tabela">${naHistoria.map(({ h, x }) => `
          <a class="item ponto" href="#/historia/${h.id}">
            <span class="ponto-texto"><strong>${destacar(x.titulo || x.nome)}</strong><small class="suave">${destacar(x.texto)}</small><small class="ponto-dist">${esc(h.titulo)}</small></span>
          </a>`).join("")}</div>` : ""}
        ${achou.length || lugaresAchados.length || naHistoria.length ? "" : `<p class="vazio">Nada encontrado. Tente outra palavra, em português ou espanhol.</p>`}`;
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
    else if (telas[rota]) html = telas[rota](param);
    else html = telas.inicio();
    main.innerHTML = `${html}<p class="versao">Viajador · versão ${VERSAO_APP}</p>`;
    document.querySelectorAll("#abas a").forEach((a) => {
      const ativa = !termo && (a.dataset.aba === rota || (a.dataset.aba === "" && rota === "s"));
      a.classList.toggle("ativa", ativa);
      if (ativa) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

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
    if (b.dataset.acao === "quiz-salvar") {
      const nome = $("#nome-ranking").value.trim().slice(0, 20);
      if (!nome) return avisar("Escreva um nome");
      nomeJogador = nome;
      salvarNoRanking(nome);
      avisar("Salvo no ranking");
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
    if (b.dataset.acao === "ver-todos") {
      verTodos = true;
      return render();
    }
    if (b.dataset.acao === "narrar") return narrar(pontos().find((g) => g.id === b.dataset.guia).historia);
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMostrar(); });

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

  $("#pais").textContent = `${pais.bandeira} ${pais.nome}`;
  render();
})();
