// Service worker do Viajador: abre instantâneo do cache e atualiza em segundo plano.
// Ao adicionar um país (data/<código>.js), inclua-o em NUCLEO e suba VERSAO.
const VERSAO = "viajador-v3";
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

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSAO);
    await cache.addAll(NUCLEO.map((u) => new Request(u, { cache: "reload" })));
    await guardarFontes(cache);
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

// Páginas e dados: responde do cache e atualiza para a próxima abertura.
async function cacheEAtualiza(event, chave) {
  const cache = await caches.open(VERSAO);
  const salvo = await cache.match(chave);
  const rede = fetch(chave).then((resp) => {
    if (resp.ok) return cache.put(chave, resp.clone()).then(() => resp);
    return resp;
  });
  if (salvo) {
    event.waitUntil(rede.catch(() => {}));
    return salvo;
  }
  return rede;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (HOSTS_FONTES.includes(url.hostname)) {
    event.respondWith(primeiroCache(request));
  } else if (url.origin === self.location.origin) {
    // O app tem uma página só (rotas no #): toda navegação usa a raiz.
    event.respondWith(cacheEAtualiza(event, request.mode === "navigate" ? new URL("./", self.location).href : request));
  }
});
