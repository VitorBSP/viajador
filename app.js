(function () {
  const pais = window.VIAJADOR.paises.uy;
  const $ = (s) => document.querySelector(s);
  const main = $("#conteudo");
  const CHAVE_FAV = "viajador:favoritos";
  const CHAVE_ESCALA = "viajador:escala";
  const CHAVE_CHECK = "viajador:checklist";
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

  const telas = {
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
      const lugaresAchados = pontos().filter((g) => normal([g.lugar, g.resumo, ...g.historia].join(" ")).includes(t));
      return `<h1>Resultados para “${esc(termo)}”</h1>
        <p class="lead">${achou.length} frase(s) · ${lugaresAchados.length} lugar(es)</p>
        ${lugaresAchados.length ? `<div class="tabela">${lugaresAchados.map((g) => `
          <a class="item ponto" href="#/guia/${g.id}">
            <span class="emoji" aria-hidden="true">${lugarDo(g).icone}</span>
            <span class="ponto-texto"><strong lang="es">${destacar(g.lugar)}</strong><small class="suave">${destacar(g.resumo)}</small></span>
          </a>`).join("")}</div>` : ""}
        ${achou.length ? lista(achou) : ""}
        ${achou.length || lugaresAchados.length ? "" : `<p class="vazio">Nada encontrado. Tente outra palavra, em português ou espanhol.</p>`}`;
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
    main.innerHTML = html;
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
    navigator.serviceWorker.register("sw.js").catch(() => {});
    if (primeiraVez) navigator.serviceWorker.ready.then(() => avisar("Pronto para usar sem internet"));
  }

  $("#pais").textContent = `${pais.bandeira} ${pais.nome}`;
  render();
})();
