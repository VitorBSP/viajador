// Testes da lógica pura do app, sobre os dados reais (data/uy.js e data/rs.js).
// Rodar: node --test tests/*.test.mjs   (no Node 22, `node --test tests/` tenta carregar a pasta como módulo)
import { test } from "node:test";
import assert from "node:assert/strict";
import { carregar } from "./carregar.mjs";

const nomes = (r) => [...r.escolhidos].map((x) => x.l.nome);
const todosNomes = (pais) => pais.lugares.flatMap((c) => c.itens.map((l) => l.nome));

for (const codigo of ["uy", "rs"]) {
  test(`${codigo}: montarRoteiro respeita o teto de 25% de estrada`, () => {
    const app = carregar(codigo);
    for (const dias of [2, 3, 5, 7]) {
      const r = app.montarRoteiro(app.pais.cidades, dias, { limiteEstrada: 0.25 });
      assert.ok(r.escolhidos.size > 0, `${dias} dias: algum lugar deve entrar`);
      assert.ok(r.estrada.fracao <= 0.25, `${dias} dias: estrada ${r.estrada.fracao} passou de 25%`);
    }
  });

  test(`${codigo}: modo automático escolhe só nas cidades marcadas`, () => {
    const app = carregar(codigo);
    const cidade = app.pais.cidades[0];
    const r = app.montarRoteiro([cidade], 3, { limiteEstrada: 0.25 });
    const daCidade = new Set(app.pais.lugares.find((c) => c.cidade === cidade).itens.map((l) => l.nome));
    assert.ok(r.escolhidos.size > 0);
    for (const n of nomes(r)) assert.ok(daCidade.has(n), `${n} não é de ${cidade}`);
  });

  test(`${codigo}: "Do meu jeito" só usa os lugares escolhidos`, () => {
    const app = carregar(codigo);
    const todos = todosNomes(app.pais);
    const so = new Set([todos[0], todos[Math.floor(todos.length / 2)], todos[todos.length - 1]]);
    const r = app.montarRoteiro(app.pais.cidades, 4, { so, limiteEstrada: 0.25, podeTirarObrig: true });
    for (const n of nomes(r)) assert.ok(so.has(n), `${n} não foi escolhido`);
    assert.ok(r.estrada.fracao <= 0.25);
    // O que o limite de estrada tirou aparece em `longe`, e não no plano.
    for (const x of r.longe) assert.ok(!r.escolhidos.has(x));
  });

  test(`${codigo}: lugares já visitados (jaFui) não entram no roteiro`, () => {
    const app = carregar(codigo);
    const base = app.montarRoteiro(app.pais.cidades, 4, { limiteEstrada: 0.25 });
    const fui = new Set(nomes(base).slice(0, 3));
    const r = app.montarRoteiro(app.pais.cidades, 4, { sem: fui, limiteEstrada: 0.25 });
    for (const n of fui) {
      assert.ok(!nomes(r).includes(n), `${n} já visitado voltou ao roteiro`);
      assert.ok(!r.faltam.some((x) => x.l.nome === n), `${n} já visitado virou "falta"`);
      assert.ok(!r.sobras.some((x) => x.l.nome === n), `${n} já visitado virou "sobra"`);
    }
  });

  test(`${codigo}: troca de parada tira o original e traz o escolhido`, () => {
    const app = carregar(codigo);
    const base = app.montarRoteiro(app.pais.cidades, 5, { limiteEstrada: 0.25 });
    const de = nomes(base).find((n) => !app.pais.lugares.some((c) => c.itens.some((l) => l.nome === n && l.prioridade === "obrigatorio")));
    const para = base.sobras.map((x) => x.l.nome)[0];
    assert.ok(de && para, "o dado precisa ter um lugar para trocar e uma sobra");
    const r = app.montarRoteiro(app.pais.cidades, 5, { sem: new Set([de]), forcar: new Set([para]), limiteEstrada: 0.25 });
    assert.ok(!nomes(r).includes(de), "o original saiu");
    assert.ok(nomes(r).includes(para), "a troca entrou");
  });

  test(`${codigo}: lugaresCitados acha até 3 lugares, na ordem do texto`, () => {
    const app = carregar(codigo);
    const g = app.pais.guia;
    const texto = `Comece por ${g[2].lugar}, depois vá a ${g[0].lugar}, aí ${g[1].lugar} e por fim ${g[3].lugar}.`;
    assert.deepEqual([...app.lugaresCitados(texto)], [g[2].id, g[0].id, g[1].id]);
    assert.deepEqual([...app.lugaresCitados(`ótimo dia`)], []);
    assert.deepEqual([...app.lugaresCitados("")], []);
    // Um nome pode citar outro lugar entre parênteses (ex.: "Casapueblo (Punta Ballena)"), então só o primeiro é garantido.
    assert.equal(app.lugaresCitados(g[4].lugar.toUpperCase())[0], g[4].id, "maiúsculas e acentos não atrapalham");
  });

  test(`${codigo}: montarContexto e orientacaoDaConversa não vazam undefined`, () => {
    const app = carregar(codigo);
    const perguntas = ["", "me conta mais", ...app.pais.guia.slice(0, 15).map((g) => g.lugar), "gíria comida churrasco chimarrão futebol"];
    for (const p of perguntas) {
      for (const texto of [app.montarContexto(p), app.montarContexto(p, "assunto anterior")]) {
        assert.ok(texto.length > 0);
        assert.ok(texto.length <= 12000);
        assert.doesNotMatch(texto, /undefined|\bNaN\b|\[object/, `contexto de "${p}"`);
      }
    }
    assert.doesNotMatch(app.orientacaoDaConversa(true) + app.orientacaoDaConversa(false), /undefined/);
  });
}

test("rs: sem espanhol, sem Hola e sem pronúncia no que vai para o guia", () => {
  const app = carregar("rs");
  assert.equal(app.semTraducao, true);
  for (const continua of [true, false]) {
    const o = app.orientacaoDaConversa(continua);
    assert.doesNotMatch(o, /espanhol|hola|che\b/i);
  }
  for (const p of ["", "o que é chimarrão", "bah tchê", ...app.pais.guia.slice(0, 15).map((g) => g.lugar)]) {
    const c = app.montarContexto(p);
    assert.doesNotMatch(c, /\bhola\b/i);
    assert.doesNotMatch(c, /\((undefined|null)\)/);
    assert.doesNotMatch(c, /\b(em|do|para o|pro) espanhol\b/i);
  }
});

test("uy: a orientação ensina espanhol só quando a conversa começa ou segue", () => {
  const app = carregar("uy");
  assert.match(app.orientacaoDaConversa(true), /não cumprimente nem diga Hola/);
  assert.match(app.orientacaoDaConversa(false), /pode cumprimentar/);
  assert.match(app.orientacaoDaConversa(false), /espanhol/);
});

test("uy: com posição, o contexto cita a distância e continua sem undefined", () => {
  const app = carregar("uy");
  app.definirPosicao(app.pais.guia[0].coords);
  const c = app.montarContexto("o que tem perto");
  assert.match(c, /do viajante/);
  assert.doesNotMatch(c, /undefined/);
});

test("uy: calcularMoeda converte UYU→BRL e BRL→UYU", () => {
  const app = carregar("uy");
  const m = app.moedaEst;
  assert.equal(m.taxa, 7.4);
  m.direcao = "local-brl"; m.valor = "740";
  assert.equal(app.calcularMoeda().principal, "R$ 100,00");
  assert.equal(app.calcularMoeda().detalhe, "1 R$ = 7,40 UYU");
  m.direcao = "brl-local"; m.valor = "100";
  assert.equal(app.calcularMoeda().principal, "$U 740");
});

test("uy: calcularMoeda usa taxa customizada e aceita vírgula", () => {
  const app = carregar("uy");
  const m = app.moedaEst;
  m.taxa = 8; m.direcao = "brl-local"; m.valor = "100";
  assert.equal(app.calcularMoeda().principal, "$U 800");
  m.direcao = "local-brl"; m.valor = "800";
  assert.equal(app.calcularMoeda().principal, "R$ 100,00");
  m.valor = "12,5"; // vírgula decimal, como se digita no celular
  assert.equal(app.calcularMoeda().principal, "R$ 1,56");
  m.taxa = 0; // taxa inválida volta para a padrão
  m.valor = "740";
  assert.equal(app.calcularMoeda().principal, "R$ 100,00");
});

test("uy: calcularMoeda soma +10% de propina", () => {
  const app = carregar("uy");
  const m = app.moedaEst;
  m.direcao = "local-brl"; m.valor = "1000"; m.gorjeta = true;
  const r = app.calcularMoeda();
  assert.equal(r.principal, "R$ 148,65");
  assert.match(r.detalhe, /\+ 10% propina: \$U 100 /);
  m.direcao = "brl-local"; m.valor = "100";
  assert.equal(app.calcularMoeda().principal, "$U 814");
  m.valor = "abc"; // entrada inválida vira zero, sem NaN
  assert.doesNotMatch(app.calcularMoeda().principal + app.calcularMoeda().detalhe, /NaN/);
});

test("rs: sem moeda própria, o conversor não devolve nada", () => {
  const app = carregar("rs");
  assert.deepEqual({ ...app.calcularMoeda() }, { principal: "", detalhe: "" });
});
