// Service worker do Viajador: com internet usa sempre a versão nova; sem internet, o cache.
// Ao adicionar um país (data/<código>.js), inclua-o em NUCLEO e suba VERSAO.
const VERSAO = "viajador-1.48"; // igual a VERSAO_APP, em app.js
const NUCLEO = [
  "./",
  "styles.css",
  "app.js",
  "data/uy.js",
  "data/rs.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "img/duck-loading.webp",
  "img/duck-loading.jpg",
  "img/duck-loading.webm",
  "img/duck-loading.mp4",
  "img/arte/inicio.svg",
  "img/arte/origem-rs.svg",
  "img/arte/ia.svg",
  "img/arte/guia.svg",
  "img/arte/historia.svg",
  "img/arte/futebol.svg",
  "img/arte/quiz.svg",
  "img/arte/conversas.svg",
  "img/arte/lugares.svg",
  "img/arte/girias.svg",
  "img/arte/ditados.svg",
  "img/arte/dicas.svg",
  "img/arte/preparar.svg",
  "img/arte/favoritos.svg",
  "img/arte/nivel-turista.svg",
  "img/arte/nivel-viajante.svg",
  "img/arte/nivel-uruguaio.svg",
  "img/arte/nivel-extreme.svg",
  "img/arte/nivel-futebol.svg",
  "img/arte/medalha-ouro.svg",
  "img/arte/medalha-prata.svg",
  "img/arte/medalha-bronze.svg",
  "img/arte/mate-consolo.svg",
];
// Fotos ficam offline também (UY + RS), baixadas em lotes curtos sem travar a instalação se alguma falhar.
const FOTOS = [
  "img/guia/aldeia-imigrante.jpg", "img/guia/ametista-do-sul.jpg", "img/guia/antonio-prado.jpg", "img/guia/apa-ibirapuita.jpg", "img/guia/arboretum-lussich.jpg",
  "img/guia/arena-gremio.jpg", "img/guia/argentino-hotel.jpg", "img/guia/barrio-sur.jpg", "img/guia/beira-rio.jpg", "img/guia/cafe-brasilero.jpg",
  "img/guia/caminhos-de-pedra.jpg", "img/guia/candelaria.jpg", "img/guia/canion-fortaleza.jpg", "img/guia/caracol.jpg", "img/guia/casa-de-cultura-mario-quintana.jpg",
  "img/guia/casapueblo.jpg", "img/guia/cassino.jpg", "img/guia/castelinho-erechim.jpg", "img/guia/castillo-piria.jpg", "img/guia/catedral-angelopolitana.jpg",
  "img/guia/catedral-de-pedra.jpg", "img/guia/catedral-maldonado.jpg", "img/guia/catedral-metropolitana-poa.jpg", "img/guia/catedral-pelotas.jpg", "img/guia/catedral-santa-cruz.jpg",
  "img/guia/cerro-do-jarau.jpg", "img/guia/chale-praca-xv.jpg", "img/guia/chateau-deau.jpg", "img/guia/ciudad-vieja.jpg", "img/guia/delta-jacui.jpg",
  "img/guia/el-prado.jpg", "img/guia/eolico-osorio.jpg", "img/guia/espigao-alto.jpg", "img/guia/espinilho.jpg", "img/guia/estadio-centenario.jpg",
  "img/guia/faro-jose-ignacio.jpg", "img/guia/faro-punta-brava.jpg", "img/guia/faro-punta.jpg", "img/guia/farol-mostardas.jpg", "img/guia/farol-santander.jpg",
  "img/guia/feria-artigas.jpg", "img/guia/ferrabraz.jpg", "img/guia/fortaleza-cerro.jpg", "img/guia/gorlero.jpg", "img/guia/guarita.jpg",
  "img/guia/gurvich.jpg", "img/guia/hamburgo-velho.jpg", "img/guia/hotel-carrasco.jpg", "img/guia/igreja-das-dores.jpg", "img/guia/ilha-dos-lobos.jpg",
  "img/guia/isla-gorriti.jpg", "img/guia/isla-lobos.jpg", "img/guia/itaimbezinho.jpg", "img/guia/itapeva.jpg", "img/guia/itapua.jpg",
  "img/guia/jardim-botanico-poa.jpg", "img/guia/khadro-ling.jpg", "img/guia/la-barra.jpg", "img/guia/la-carreta.jpg", "img/guia/la-mano.jpg",
  "img/guia/lago-joaquina-bier.jpg", "img/guia/lago-negro.jpg", "img/guia/lagoa-do-peixe.jpg", "img/guia/lagoa-dos-quadros.jpg", "img/guia/lagoa-mirim.jpg",
  "img/guia/laguna-sauce.jpg", "img/guia/maca.jpg", "img/guia/mampituba.jpg", "img/guia/mansa-brava.jpg", "img/guia/mapi.jpg",
  "img/guia/marcelino-ramos.jpg", "img/guia/margs.jpg", "img/guia/matriz-gramado.jpg", "img/guia/matriz-viamao.jpg", "img/guia/medianeira.jpg",
  "img/guia/memorial-rs.jpg", "img/guia/mercado-del-puerto.jpg", "img/guia/mercado-publico-poa.jpg", "img/guia/mini-mundo.jpg", "img/guia/mnav.jpg",
  "img/guia/monte-negro.jpg", "img/guia/monumento-acorianos.jpg", "img/guia/monumento-imigrante.jpg", "img/guia/morro-de-osorio.jpg", "img/guia/mundo-a-vapor.jpg",
  "img/guia/museo-carnaval.jpg", "img/guia/museo-mar.jpg", "img/guia/museu-da-baronesa.jpg", "img/guia/museu-das-missoes.jpg", "img/guia/museu-dom-diogo.jpg",
  "img/guia/museu-julio-castilhos.jpg", "img/guia/museu-oceanografico.jpg", "img/guia/museu-pucrs.jpg", "img/guia/museu-santo-angelo.jpg", "img/guia/museu-sao-leopoldo.jpg",
  "img/guia/palacete-bage.jpg", "img/guia/palacio-dos-festivais.jpg", "img/guia/palacio-legislativo.jpg", "img/guia/palacio-piratini.jpg", "img/guia/paleobotanico-mata.jpg",
  "img/guia/pan-de-azucar.jpg", "img/guia/parque-da-gare.jpg", "img/guia/parque-internacional.jpg", "img/guia/parque-rodo.jpg", "img/guia/plaza-independencia.jpg",
  "img/guia/plaza-matriz.jpg", "img/guia/pocitos.jpg", "img/guia/ponte-barao-de-maua.jpg", "img/guia/ponte-do-fandango.jpg", "img/guia/praca-alfandega.jpg",
  "img/guia/praca-pedro-osorio.jpg", "img/guia/praca-tamandare.jpg", "img/guia/pueblo-garzon.jpg", "img/guia/puente-garzon.jpg", "img/guia/puerta-ciudadela.jpg",
  "img/guia/puerto-punta.jpg", "img/guia/punta-ballena.jpg", "img/guia/ralli.jpg", "img/guia/rambla-piriapolis.jpg", "img/guia/rambla.jpg",
  "img/guia/redencao.jpg", "img/guia/salto-do-yucuma.jpg", "img/guia/salto-ventoso.jpg", "img/guia/santa-teresa.jpg", "img/guia/sao-domingos-torres.jpg",
  "img/guia/sao-lourenco-martir.jpg", "img/guia/sao-miguel-arcanjo.jpg", "img/guia/sao-nicolau.jpg", "img/guia/sete-de-abril.jpg", "img/guia/taim.jpg",
  "img/guia/tainhas.jpg", "img/guia/teatro-solis.jpg", "img/guia/theatro-sao-pedro.jpg", "img/guia/torres-garcia.jpg", "img/guia/tres-cruces.jpg",
  "img/guia/tristan-narvaja.jpg", "img/guia/usina-gasometro.jpg", "img/guia/vale-dos-vinhedos.jpg", "img/guia/viaduto-13.jpg", "img/guia/vila-belga.jpg",
  "img/pessoas/agustini.jpg", "img/pessoas/andrade.jpg", "img/pessoas/artigas.jpg", "img/pessoas/batlle.jpg", "img/pessoas/benedetti.jpg",
  "img/pessoas/cavani.jpg", "img/pessoas/drexler.jpg", "img/pessoas/figari.jpg", "img/pessoas/forlan.jpg", "img/pessoas/francescoli.jpg",
  "img/pessoas/galeano.jpg", "img/pessoas/gardel.jpg", "img/pessoas/ghiggia.jpg", "img/pessoas/ibarbourou.jpg", "img/pessoas/lavalleja.jpg",
  "img/pessoas/luisi.jpg", "img/pessoas/mujica.jpg", "img/pessoas/nasazzi.jpg", "img/pessoas/onetti.jpg", "img/pessoas/oreiro.jpg",
  "img/pessoas/oribe.jpg", "img/pessoas/paez.jpg", "img/pessoas/rada.jpg", "img/pessoas/rivera.jpg", "img/pessoas/seregni.jpg",
  "img/pessoas/suarez.jpg", "img/pessoas/torres.jpg", "img/pessoas/valverde.jpg", "img/pessoas/varela.jpg", "img/pessoas/zorrilla.jpg",
  "img/arte/origem.jpg",
];
// Mesma URL do <link> em index.html.
const FONTES_CSS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap";
const HOSTS_FONTES = ["fonts.googleapis.com", "fonts.gstatic.com"];

// Na 1ª visita a página busca as fontes antes de o SW assumir, então elas são baixadas aqui.
// Só os subconjuntos latinos: o resto nunca é usado. Sem fontes o app segue funcionando.
async function guardarFontes(cache) {
  try {
    const resp = await fetch(FONTES_CSS);
    if (!resp.ok) return;
    const css = await resp.clone().text();
    const urls = [];
    for (const [, subset, bloco] of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*{[^}]*})/g)) {
      const url = /url\((https:[^)]+)\)/.exec(bloco);
      if (url && (subset === "latin" || subset === "latin-ext")) urls.push(url[1]);
    }
    await Promise.all([...new Set(urls)].map((u) => cache.add(u)));
    await cache.put(FONTES_CSS, resp);
  } catch (e) {}
}

async function guardarFotos(cache) {
  const LOTE = 10;
  for (let i = 0; i < FOTOS.length; i += LOTE) {
    await Promise.allSettled(FOTOS.slice(i, i + LOTE).map((u) => cache.add(u)));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSAO);
    await cache.addAll(NUCLEO.map((u) => new Request(u, { cache: "reload" })));
    await guardarFontes(cache);
    await guardarFotos(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

// Fontes não mudam: cache primeiro. As respostas do Google variam por Sec-Fetch-*, daí o ignoreVary.
async function primeiroCache(request) {
  const cache = await caches.open(VERSAO);
  const salvo = await cache.match(request, { ignoreVary: true });
  if (salvo) return salvo;
  const resp = await fetch(request);
  if (resp.ok || resp.type === "opaque") cache.put(request, resp.clone());
  return resp;
}

// Páginas e dados: rede primeiro, para nunca misturar versões. Internet lenta ou ausente cai no cache.
const ESPERA_REDE = 3500;
async function redePrimeiro(chave) {
  const cache = await caches.open(VERSAO);
  const salvo = await cache.match(chave);
  const rede = fetch(chave, { cache: "no-cache" }).then((resp) => {
    if (resp.ok) cache.put(chave, resp.clone());
    return resp;
  });
  if (!salvo) return rede;
  const limite = new Promise((ok) => setTimeout(() => ok(salvo), ESPERA_REDE));
  return Promise.race([rede.catch(() => salvo), limite]);
}

// Vídeo do loading: Safari pede trechos (Range) e só toca com resposta 206. Sai do cache cortado no trecho pedido.
async function trechoDoCache(request) {
  const cache = await caches.open(VERSAO);
  const salvo = await cache.match(request.url, { ignoreSearch: true });
  if (!salvo) return fetch(request);
  const dados = await salvo.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(request.headers.get("range") || "");
  const ini = m && m[1] ? Number(m[1]) : 0;
  const fim = m && m[2] ? Math.min(Number(m[2]), dados.byteLength - 1) : dados.byteLength - 1;
  return new Response(dados.slice(ini, fim + 1), {
    status: 206,
    headers: {
      "Content-Type": salvo.headers.get("Content-Type") || "video/mp4",
      "Content-Range": `bytes ${ini}-${fim}/${dados.byteLength}`,
      "Content-Length": String(fim - ini + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Perguntas ao GuIA Turístico vão direto para a rede.
  if (url.pathname.includes("/functions/v1/")) return;
  if (url.origin === self.location.origin && request.headers.has("range") && /\.(mp4|webm)$/.test(url.pathname)) {
    event.respondWith(trechoDoCache(request));
    return;
  }
  if (HOSTS_FONTES.includes(url.hostname)) {
    event.respondWith(primeiroCache(request));
  } else if (url.origin === self.location.origin) {
    // O app tem uma página só (rotas no #): toda navegação usa a raiz.
    event.respondWith(redePrimeiro(request.mode === "navigate" ? new URL("./", self.location).href : request));
  }
});
