// Carrega app.js e os dados reais em um contexto isolado (node:vm) com um DOM de mentira,
// e devolve window.VIAJADOR_INTERNO. Zero dependência.
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ler = (f) => readFileSync(join(raiz, f), "utf8");

// Elemento "aceita tudo": qualquer propriedade é outro elemento, qualquer chamada devolve outro elemento.
function elemento() {
  const alvo = function () {};
  const mem = { classList: { contains: () => false, add() {}, remove() {}, toggle() {} }, dataset: {}, style: {}, hidden: false, value: "" };
  const p = new Proxy(alvo, {
    get(_, k) {
      if (k === Symbol.toPrimitive) return () => "";
      if (k === "then") return undefined;
      if (k === "length") return 0;
      if (k === Symbol.iterator) return function* () {};
      if (k in mem) return mem[k];
      if (["querySelectorAll", "children"].includes(k)) return () => [];
      return p;
    },
    set(_, k, v) { mem[k] = v; return true; },
    apply() { return p; },
  });
  return p;
}

export function carregar(codigo) {
  const guardado = new Map([["viajador:pais", codigo]]);
  const el = elemento();
  const janela = {
    localStorage: { getItem: (k) => (guardado.has(k) ? guardado.get(k) : null), setItem: (k, v) => guardado.set(k, String(v)), removeItem: (k) => guardado.delete(k) },
    document: { querySelector: () => el, querySelectorAll: () => [], addEventListener() {}, createElement: () => el, body: el, documentElement: el },
    navigator: { onLine: false, language: "pt-BR" },
    location: { hash: "#/", protocol: "file:" },
    history: { replaceState() {} },
    crypto: { randomUUID: () => "teste" },
    addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }),
    scrollTo() {}, requestAnimationFrame: (f) => f(), setTimeout: () => 0, clearTimeout() {},
    console, Intl, Date, Math, JSON, Set, Map, Promise, URL, AbortSignal,
  };
  janela.window = janela;
  janela.self = janela;
  const ctx = vm.createContext(janela);
  // Os dois arquivos de dados entram, como em index.html; o país ativo vem de "viajador:pais".
  for (const f of ["data/uy.js", "data/rs.js", "app.js"]) vm.runInContext(ler(f), ctx, { filename: f });
  return janela.VIAJADOR_INTERNO;
}
