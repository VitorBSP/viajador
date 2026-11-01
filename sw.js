// Service worker do Viajador: com internet usa sempre a versão nova; sem internet, o cache.
// Ao adicionar um país (data/<código>.js), inclua-o em NUCLEO e suba VERSAO.
const VERSAO = "viajador-v16";
const NUCLEO = [
  "./",
  "styles.css",
  "app.js",
  "data/uy.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "img/arte/inicio.svg",
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
// Fotos ficam offline também, mas sem travar a instalação se alguma falhar.
const FOTOS = ["img/guia/teatro-solis.jpg", "img/guia/mercado-del-puerto.jpg", "img/guia/estadio-centenario.jpg", "img/guia/la-mano.jpg", "img/guia/casapueblo.jpg", "img/guia/ciudad-vieja.jpg", "img/guia/rambla.jpg", "img/guia/plaza-independencia.jpg", "img/guia/tristan-narvaja.jpg", "img/guia/pocitos.jpg", "img/guia/museo-carnaval.jpg", "img/guia/el-prado.jpg", "img/guia/tres-cruces.jpg", "img/guia/puerto-punta.jpg", "img/guia/isla-gorriti.jpg", "img/guia/mansa-brava.jpg", "img/guia/la-barra.jpg", "img/guia/gorlero.jpg", "img/guia/feria-artigas.jpg", "img/guia/arboretum-lussich.jpg", "img/guia/plaza-matriz.jpg", "img/guia/torres-garcia.jpg", "img/guia/mapi.jpg", "img/guia/cafe-brasilero.jpg", "img/guia/palacio-legislativo.jpg", "img/guia/la-carreta.jpg", "img/guia/parque-rodo.jpg", "img/guia/faro-punta-brava.jpg", "img/guia/fortaleza-cerro.jpg", "img/guia/barrio-sur.jpg", "img/guia/mnav.jpg", "img/guia/gurvich.jpg", "img/guia/hotel-carrasco.jpg", "img/guia/faro-punta.jpg", "img/guia/candelaria.jpg", "img/guia/isla-lobos.jpg", "img/guia/punta-ballena.jpg", "img/guia/faro-jose-ignacio.jpg", "img/guia/puente-garzon.jpg", "img/guia/maca.jpg", "img/guia/museo-mar.jpg", "img/guia/laguna-sauce.jpg", "img/guia/catedral-maldonado.jpg", "img/guia/pueblo-garzon.jpg", "img/guia/castillo-piria.jpg", "img/guia/argentino-hotel.jpg", "img/guia/rambla-piriapolis.jpg", "img/guia/pan-de-azucar.jpg", "img/guia/puerta-ciudadela.jpg", "img/guia/ralli.jpg", "img/pessoas/artigas.jpg", "img/pessoas/lavalleja.jpg", "img/pessoas/rivera.jpg", "img/pessoas/oribe.jpg", "img/pessoas/batlle.jpg", "img/pessoas/mujica.jpg", "img/pessoas/seregni.jpg", "img/pessoas/luisi.jpg", "img/pessoas/varela.jpg", "img/pessoas/ghiggia.jpg", "img/pessoas/nasazzi.jpg", "img/pessoas/andrade.jpg", "img/pessoas/francescoli.jpg", "img/pessoas/forlan.jpg", "img/pessoas/suarez.jpg", "img/pessoas/cavani.jpg", "img/pessoas/valverde.jpg", "img/pessoas/galeano.jpg", "img/pessoas/benedetti.jpg", "img/pessoas/onetti.jpg", "img/pessoas/agustini.jpg", "img/pessoas/ibarbourou.jpg", "img/pessoas/torres.jpg", "img/pessoas/figari.jpg", "img/pessoas/paez.jpg", "img/pessoas/gardel.jpg", "img/pessoas/drexler.jpg", "img/pessoas/rada.jpg", "img/pessoas/zorrilla.jpg", "img/pessoas/oreiro.jpg", "img/arte/origem.jpg"];
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

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSAO);
    await cache.addAll(NUCLEO.map((u) => new Request(u, { cache: "reload" })));
    await guardarFontes(cache);
    await Promise.allSettled(FOTOS.map((u) => cache.add(u)));
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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (HOSTS_FONTES.includes(url.hostname)) {
    event.respondWith(primeiroCache(request));
  } else if (url.origin === self.location.origin) {
    // O app tem uma página só (rotas no #): toda navegação usa a raiz.
    event.respondWith(redePrimeiro(request.mode === "navigate" ? new URL("./", self.location).href : request));
  }
});
