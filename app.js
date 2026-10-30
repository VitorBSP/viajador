(function () {
  const pais = window.VIAJADOR.paises.uy;
  const $ = (s) => document.querySelector(s);
  const main = $("#conteudo");
  const CHAVE_FAV = "viajador:favoritos";

  // Favoritos ficam no aparelho; tudo funciona mesmo se o armazenamento falhar.
  let favoritos = [];
  try { favoritos = JSON.parse(localStorage.getItem(CHAVE_FAV)) || []; } catch (e) {}
  const salvarFav = () => { try { localStorage.setItem(CHAVE_FAV, JSON.stringify(favoritos)); } catch (e) {} };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const normal = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Índice de todas as frases, para busca e favoritos.
  const todas = [];
  pais.situacoes.forEach((s) => s.frases.forEach((f) => todas.push({ ...f, origem: s.titulo })));
  pais.lugares.forEach((c) => c.itens.forEach((l) => l.frases.forEach((f) => todas.push({ ...f, origem: l.nome }))));
  pais.comidas.forEach((c) => todas.push({ es: c.pedir, pt: c.nome + " — " + c.desc, pr: "", origem: "Comidas" }));

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

  function mostrar(f) {
    $("#mostrar-es").textContent = f.es;
    $("#mostrar-pt").textContent = f.pt;
    $("#mostrar").hidden = false;
    $("#mostrar-fechar").focus();
  }
  function fecharMostrar() { $("#mostrar").hidden = true; }

  // Frases renderizadas guardam seu índice em `vistas` para os botões acharem os dados.
  let vistas = [];
  function cartaoFrase(f) {
    const i = vistas.push(f) - 1;
    const fav = favoritos.includes(f.es);
    return `<article class="frase">
      <p class="frase-es" lang="es">${esc(f.es)}</p>
      ${f.pr ? `<span class="frase-pr">🗣️ ${esc(f.pr)}</span>` : ""}
      <p class="frase-pt">${esc(f.pt)}</p>
      ${f.dica ? `<p class="frase-dica">💡 ${esc(f.dica)}</p>` : ""}
      <div class="frase-acoes">
        <button class="btn" data-acao="falar" data-i="${i}">🔊 Ouvir</button>
        <button class="btn" data-acao="mostrar" data-i="${i}">⛶ Mostrar</button>
        <button class="btn ${fav ? "on" : ""}" data-acao="fav" data-i="${i}" aria-pressed="${fav}">${fav ? "★" : "☆"} Salvar</button>
      </div>
    </article>`;
  }
  const lista = (frases) => `<div class="lista">${frases.map(cartaoFrase).join("")}</div>`;

  const telas = {
    inicio() {
      return `<div class="intro">${esc(pais.intro)}</div>
        <h1>O que você precisa agora?</h1>
        <p class="lead">Toque na situação, ouça a frase ou mostre a tela.</p>
        <div class="grade">${pais.situacoes.map((s) => `
          <a class="categoria" href="#/s/${s.id}">
            <span class="emoji" aria-hidden="true">${s.icone}</span>
            <strong>${esc(s.titulo)}</strong>
            <small>${s.frases.length} frases</small>
          </a>`).join("")}
        </div>`;
    },
    situacao(id) {
      const s = pais.situacoes.find((x) => x.id === id);
      if (!s) return telas.inicio();
      return `<a class="voltar" href="#/">← Situações</a>
        <h1>${s.icone} ${esc(s.titulo)}</h1>
        <p class="lead">${s.frases.length} frases úteis</p>
        ${lista(s.frases)}`;
    },
    lugares() {
      return `<h1>Lugares</h1>
        <p class="lead">Dicas e frases para cada ponto turístico.</p>
        ${pais.lugares.map((c) => `
          <h2>${esc(c.cidade)}</h2>
          ${c.itens.map((l) => `
            <section class="item lugar">
              <div class="lugar-topo"><span aria-hidden="true">${l.icone}</span><h3>${esc(l.nome)}</h3></div>
              <p class="suave">${esc(l.dica)}</p>
              ${lista(l.frases)}
            </section>`).join("")}`).join("")}
        <h2>Comidas típicas</h2>
        <div class="tabela">${pais.comidas.map((c) => `
          <div class="item">
            <h3>${esc(c.nome)}</h3>
            <p class="suave">${esc(c.desc)}</p>
            ${lista([{ es: c.pedir, pt: "Como pedir", pr: "" }])}
          </div>`).join("")}
        </div>`;
    },
    girias() {
      return `<h1>Gírias uruguaias</h1>
        <p class="lead">Para entender a conversa (e soltar uma de vez em quando).</p>
        ${lista(pais.girias.map((g) => ({ es: g.es, pr: g.pr, pt: g.pt, dica: g.ex ? "Ex.: " + g.ex : g.dica })))}`;
    },
    ditados() {
      return `<h1>Ditados e expressões</h1>
        <p class="lead">Frases feitas que você vai ouvir por aí.</p>
        ${lista(pais.ditados.map((d) => ({ es: d.es, pt: d.pt, pr: "", dica: d.uso })))}
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
            ${p.dica ? `<p class="suave">💡 ${esc(p.dica)}</p>` : ""}
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
      const achou = todas.filter((f) => normal(f.es + " " + f.pt + " " + (f.dica || "")).includes(t));
      return `<h1>Resultados para “${esc(termo)}”</h1>
        <p class="lead">${achou.length} frase(s)</p>
        ${achou.length ? lista(achou) : `<p class="vazio">Nada encontrado. Tente outra palavra, em português ou espanhol.</p>`}`;
    },
  };

  function render() {
    vistas = [];
    const termo = $("#busca").value.trim();
    const [, rota = "", param] = location.hash.split("/");
    let html;
    if (termo) html = telas.busca(termo);
    else if (rota === "s") html = telas.situacao(param);
    else if (telas[rota]) html = telas[rota]();
    else html = telas.inicio();
    main.innerHTML = html;
    document.querySelectorAll("#abas a").forEach((a) => {
      a.classList.toggle("ativa", !termo && (a.dataset.aba === rota || (a.dataset.aba === "" && rota === "s")));
    });
  }

  main.addEventListener("click", (e) => {
    const b = e.target.closest("[data-acao]");
    if (!b) return;
    const f = vistas[+b.dataset.i];
    if (b.dataset.acao === "falar") falar(f.es);
    if (b.dataset.acao === "mostrar") mostrar(f);
    if (b.dataset.acao === "fav") {
      const on = !favoritos.includes(f.es);
      favoritos = on ? [...favoritos, f.es] : favoritos.filter((x) => x !== f.es);
      salvarFav();
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
      b.innerHTML = (on ? "★" : "☆") + " Salvar";
      avisar(on ? "Frase salva" : "Removida dos salvos");
    }
  });

  $("#mostrar-fechar").addEventListener("click", fecharMostrar);
  $("#mostrar").addEventListener("click", (e) => { if (e.target.id === "mostrar") fecharMostrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMostrar(); });

  $("#busca").addEventListener("input", render);
  window.addEventListener("hashchange", () => {
    $("#busca").value = "";
    render();
    window.scrollTo(0, 0);
  });

  $("#pais").textContent = `${pais.bandeira} ${pais.cidades.join(" · ")}`;
  render();
})();
