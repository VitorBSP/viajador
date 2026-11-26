// Carrega o app de verdade (data/*.js + app.js) num contexto isolado do Node, com o mínimo de navegador
// que ele usa ao iniciar. Devolve as funções puras que o app expõe em window.VIAJADOR_INTERNO.
// Zero dependência: só node:vm, node:fs e node:path.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = (arq) => readFileSync(join(RAIZ, arq), "utf8");

// Elemento falso: aceita tudo o que o app chama na inicialização e no render, sem fazer nada.
function elemento() {
  const el = {
    value: "", hidden: false, innerHTML: "", textContent: "", lang: "", placeholder: "", className: "", id: "",
    dataset: {}, style: { setProperty() {}, removeProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {}, removeEventListener() {}, setAttribute() {}, removeAttribute() {}, getAttribute: () => null,
    focus() {}, blur() {}, scrollIntoView() {}, append() {}, remove() {}, matches: () => false, closest: () => null,
    querySelector: () => elemento(), querySelectorAll: () => [],
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
  };
  el.parentElement = el;
  return el;
}

export function carregarApp(pais, armazenado = {}) {
  const guardado = new Map(Object.entries({ "viajador:pais": pais, ...armazenado }));
  const armazenamento = {
    getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
    setItem: (k, v) => guardado.set(k, String(v)),
    removeItem: (k) => guardado.delete(k),
  };
  const documento = { ...elemento(), documentElement: elemento(), body: elemento(), title: "", createElement: elemento,
    querySelector: () => elemento(), querySelectorAll: () => [], addEventListener() {} };
  const janela = {
    document: documento, localStorage: armazenamento, sessionStorage: armazenamento,
    navigator: { onLine: true, userAgent: "node" },
    location: { hash: "#/", protocol: "file:", href: "file:///index.html" },
    history: { replaceState() {} },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {}, scrollTo() {}, innerHeight: 800, innerWidth: 390,
    CSS: { escape: (s) => String(s) },
    crypto: globalThis.crypto, console, setTimeout, clearTimeout, Intl, AbortSignal, URL,
  };
  janela.window = janela;
  janela.self = janela;
  const contexto = vm.createContext(janela);
  for (const arq of ["data/uy.js", "data/rs.js", "app.js"]) vm.runInContext(ler(arq), contexto, { filename: arq });
  const interno = janela.VIAJADOR_INTERNO;
  if (!interno) throw new Error("app.js não expôs window.VIAJADOR_INTERNO");
  return { ...interno, dados: janela.VIAJADOR.paises[pais], armazenado: guardado };
}
