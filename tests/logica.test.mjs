// Testes de lógica do Viajador sobre os dados reais (data/uy.js e data/rs.js).
// Rodar: node --test tests/   (só node:test e node:assert/strict; nada de npm)
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { carregarApp } from "./carregar.mjs";

const uy = carregarApp("uy");
const rs = carregarApp("rs");
const nomes = (lista) => [...lista].map((x) => x.l.nome);
// Objetos criados dentro do vm têm outro Array/Object: copia para comparar com deepEqual.
const plano = (v) => JSON.parse(JSON.stringify(v));
const obrigatorios = (app, cidades) => app.dados.lugares.filter((c) => cidades.includes(c.cidade)).flatMap((c) => c.itens).filter((l) => l.prioridade === "obrigatorio").map((l) => l.nome);

describe("montarRoteiro", () => {
  const casos = [
    ["uy", uy, ["Montevidéu"], 2],
    ["uy", uy, ["Montevidéu", "Punta del Este"], 3],
    ["rs", rs, ["Metropolitana e Vales", "Serra Gaúcha"], 3],
    ["rs", rs, ["Metropolitana e Vales"], 2],
  ];

  for (const [sigla, app, cidades, dias] of casos) {
    test(`automático respeita o teto de 25% de estrada (${sigla}: ${cidades.join(" + ")}, ${dias} dias)`, () => {
      const r = app.montarRoteiro(cidades, dias, { limiteEstrada: 0.25 });
      assert.ok(r.escolhidos.size > 0, "o roteiro tem paradas");
      assert.ok(r.estrada.fracao <= 0.25 + 1e-9, `estrada em ${(r.estrada.fracao * 100).toFixed(1)}% do tempo`);
    });

    test(`automático põe todo obrigatório que cabe (${sigla}: ${cidades.join(" + ")})`, () => {
      const r = app.montarRoteiro(cidades, dias, { limiteEstrada: 0.25 });
      const dentro = new Set(nomes(r.escolhidos));
      const fora = new Set([...nomes(r.faltam), ...nomes(r.longe)]);
      for (const nome of obrigatorios(app, cidades)) assert.ok(dentro.has(nome) || fora.has(nome), `${nome} não está no roteiro nem listado como de fora`);
    });
  }

  test("sem limite de estrada, o roteiro pode passar de 25%; com limite, nunca passa", () => {
    const todas = uy.dados.lugares.map((c) => c.cidade);
    const comLimite = uy.montarRoteiro(todas, 3, { limiteEstrada: 0.25 });
    const semLimite = uy.montarRoteiro(todas, 3, { limiteEstrada: null });
    assert.ok(comLimite.estrada.fracao <= 0.25 + 1e-9);
    assert.ok(semLimite.estrada.fracao >= comLimite.estrada.fracao);
  });

  test("Do meu jeito usa só os lugares marcados com Quero ir, de qualquer cidade", () => {
    // Um de Montevidéu, um de Punta del Este e um de Piriápolis: nomes tirados do próprio dado.
    const [mvd, punta, piri] = ["Montevidéu", "Punta del Este", "Piriápolis"].map((c) => uy.dados.lugares.find((x) => x.cidade === c).itens[0].nome);
    const quero = new Set([mvd, punta, piri]);
    const r = uy.montarRoteiro(uy.dados.lugares.map((c) => c.cidade), 3, { so: quero, limiteEstrada: 0.25, podeTirarObrig: true });
    for (const nome of nomes(r.escolhidos)) assert.ok(quero.has(nome), `${nome} não foi marcado`);
    const todos = new Set([...nomes(r.escolhidos), ...nomes(r.faltam), ...nomes(r.sobras), ...nomes(r.longe)]);
    for (const nome of quero) assert.ok(todos.has(nome), `${nome} sumiu do resultado`);
    assert.ok(r.estrada.fracao <= 0.25 + 1e-9);
  });

  test("lugares em Já fui ficam de fora do automático", () => {
    const fui = new Set(["Teatro Solís", "Mercado del Puerto", "Ciudad Vieja & Peatonal Sarandí"]);
    const r = uy.montarRoteiro(["Montevidéu"], 3, { sem: fui, limiteEstrada: 0.25 });
    for (const nome of [...nomes(r.escolhidos), ...nomes(r.sobras)]) assert.ok(!fui.has(nome), `${nome} já foi visitado e voltou ao roteiro`);
  });

  test("troca de parada: o escolhido entra (como obrigatório) e o trocado sai", () => {
    const base = uy.montarRoteiro(["Montevidéu"], 2, { limiteEstrada: 0.25 });
    const de = nomes(base.escolhidos)[0];
    const para = uy.dados.lugares[0].itens.map((l) => l.nome).find((n) => !nomes(base.escolhidos).includes(n));
    assert.ok(para, "há um lugar de fora para trocar");
    const r = uy.montarRoteiro(["Montevidéu"], 2, { sem: new Set([de]), forcar: new Set([para]), limiteEstrada: 0.25 });
    assert.ok(nomes(r.escolhidos).includes(para), `${para} deveria entrar`);
    assert.ok(!nomes(r.escolhidos).includes(de), `${de} deveria sair`);
    assert.ok([...r.escolhidos].find((x) => x.l.nome === para).obrig, "o lugar da troca entra como obrigatório");
  });

  test("a agenda só tem lugares escolhidos, em manhã, tarde e noite", () => {
    const r = rs.montarRoteiro(["Metropolitana e Vales"], 2, { limiteEstrada: 0.25 });
    assert.equal(r.agenda.length, 2);
    const naAgenda = r.agenda.flat().flatMap((tu) => tu.itens).filter((y) => y.l && !y.continua && !y.estrada && !y.estradaSegue);
    for (const y of naAgenda) assert.ok(r.escolhidos.has(y), `${y.l.nome} na agenda sem estar escolhido`);
    for (const dia of r.agenda) assert.deepEqual(plano(dia.map((tu) => tu.id)), ["manha", "tarde", "noite"]);
  });

  test("diasParaIncluir nunca sugere menos dias que o já escolhido quando faltam obrigatórios", () => {
    const opcoes = { sem: new Set(), forcar: new Set(), limiteEstrada: 0.25 };
    const r = uy.montarRoteiro(["Montevidéu", "Punta del Este"], 1, opcoes);
    const semTempo = r.faltam.filter((x) => !r.longe.includes(x));
    assert.ok(semTempo.length > 0, "em 1 dia com 2 cidades falta obrigatório por tempo");
    const aviso = uy.diasParaIncluir(["Montevidéu", "Punta del Este"], 1, opcoes, semTempo);
    assert.ok(aviso.dias === null || aviso.dias > 1, `dias sugeridos (${aviso.dias}) deveria ser > 1 ou null`);
    if (aviso.dias !== null) {
      const t = uy.montarRoteiro(["Montevidéu", "Punta del Este"], aviso.dias, opcoes);
      const aindaFaltam = semTempo.filter((x) => !aviso.nunca.includes(x.l) && t.faltam.some((y) => y.l === x.l));
      assert.equal(aindaFaltam.length, 0, "nos dias sugeridos, os obrigatórios avisados devem entrar");
    }
  });
});

describe("lugaresCitados", () => {
  test("UY: acha até 3 lugares, na ordem em que aparecem", () => {
    const texto = "O Teatro Solís abriu em 1856. Fica a poucos passos da Plaza Independencia, e dali dá pra descer ao Mercado del Puerto e depois à Rambla.";
    assert.deepEqual(plano(uy.lugaresCitados(texto)), ["teatro-solis", "plaza-independencia", "mercado-del-puerto"]);
  });

  test("RS: aceita o nome curto (Mercado Público) e o nome inteiro", () => {
    const texto = "Você está perto do **Mercado Público**, inaugurado em 1869. Dali, a Casa de Cultura Mario Quintana fica a uns 700 m.";
    assert.deepEqual(plano(rs.lugaresCitados(texto)), ["mercado-publico-poa", "casa-de-cultura-mario-quintana"]);
  });

  test("ignora acento e caixa", () => {
    assert.deepEqual(plano(uy.lugaresCitados("passei no TEATRO SOLIS ontem")), ["teatro-solis"]);
  });

  test("texto sem lugar do guia não gera cartão", () => {
    assert.deepEqual(plano(uy.lugaresCitados("Peça a conta com ¿Me traés la cuenta?")), []);
    assert.deepEqual(plano(rs.lugaresCitados("Bah, tchê, que frio!")), []);
  });

  test("todo id devolvido existe no guia do país", () => {
    const ids = new Set(rs.dados.guia.map((g) => g.id));
    const texto = rs.dados.guia.slice(0, 10).map((g) => g.lugar).join(". ");
    const achados = rs.lugaresCitados(texto);
    assert.equal(achados.length, 3);
    for (const id of achados) assert.ok(ids.has(id));
  });
});

describe("calcularMoeda", () => {
  const cfg = uy.dados.moeda;
  const est = (o) => ({ taxa: cfg.taxaPadrao, valor: "740", direcao: "local-brl", gorjeta: false, ...o });

  test("UYU → BRL com a taxa padrão", () => {
    const r = uy.calcularMoeda(est({ taxa: 7.4, valor: "740" }));
    assert.equal(r.principal, "R$ 100,00");
    assert.match(r.detalhe, /1 R\$ = 7,40 UYU/);
  });

  test("BRL → UYU", () => {
    const r = uy.calcularMoeda(est({ taxa: 7.4, valor: "100", direcao: "brl-local" }));
    assert.equal(r.principal, `${cfg.simbolo} 740`);
  });

  test("taxa customizada e valor com vírgula", () => {
    assert.equal(uy.calcularMoeda(est({ taxa: 8, valor: "740" })).principal, "R$ 92,50");
    assert.equal(uy.calcularMoeda(est({ taxa: 8, valor: "12,5", direcao: "brl-local" })).principal, `${cfg.simbolo} 100`);
  });

  test("+10% de propina soma no total e aparece no detalhe", () => {
    assert.equal(cfg.gorjeta, 10);
    const r = uy.calcularMoeda(est({ taxa: 7.4, valor: "740", gorjeta: true }));
    assert.equal(r.principal, "R$ 110,00");
    assert.match(r.detalhe, /Conta: \$U 740 \(R\$ 100,00\) \+ 10% propina: \$U 74 \(R\$ 10,00\)/);
    assert.equal(uy.calcularMoeda(est({ taxa: 7.4, valor: "100", direcao: "brl-local", gorjeta: true })).principal, `${cfg.simbolo} 814`);
  });

  test("valor inválido vira zero, e taxa zero cai na padrão", () => {
    assert.equal(uy.calcularMoeda(est({ valor: "abc" })).principal, "R$ 0,00");
    assert.equal(uy.calcularMoeda(est({ taxa: 0, valor: String(cfg.taxaPadrao * 10) })).principal, "R$ 10,00");
  });

  test("RS não tem conversor", () => {
    assert.deepEqual(plano(rs.calcularMoeda()), { principal: "", detalhe: "" });
  });
});

describe("contexto do GuIA", () => {
  const perguntasRs = [...rs.dados.sugestoesIA, "Como peço a conta?", "O que é cacetinho?", "Me fala do Grenal", "O que ver nas Missões?", "e quem projetou?"];

  test("RS: a orientação não fala de espanhol nem manda dizer Hola", () => {
    for (const continua of [false, true]) {
      const o = rs.orientacaoDaConversa(continua);
      assert.doesNotMatch(o, /espanhol|hola|undefined/i, o);
    }
  });

  test("UY: a orientação continua ensinando frase em espanhol", () => {
    assert.match(uy.orientacaoDaConversa(false), /frase em espanhol/);
    assert.match(uy.orientacaoDaConversa(true), /Hola, che/);
  });

  test("RS: o contexto não tem 'Hola', '(undefined)', 'undefined' nem pronúncia de espanhol", () => {
    for (const p of perguntasRs) {
      const c = rs.montarContexto(p);
      assert.doesNotMatch(c, /\bhola\b/i, `pergunta: ${p}`);
      assert.doesNotMatch(c, /undefined/, `pergunta: ${p}`);
      assert.doesNotMatch(c, /\([a-zñ]*-?[A-ZÁÉÍÓÚ]{2,}-[a-zñ]/, `pronúncia vazou na pergunta: ${p}`);
    }
  });

  test("RS: 'espanhol' só aparece quando vem do próprio conteúdo histórico do guia", () => {
    const textoDoGuia = JSON.stringify(rs.dados).toLowerCase();
    for (const p of perguntasRs) {
      for (const frase of rs.montarContexto(p).split(/\n+/)) {
        if (!/espanhol/i.test(frase)) continue;
        // Os 30 caracteres antes da palavra têm de existir no próprio dado (é história ou vocabulário, não instrução).
        const i = frase.toLowerCase().indexOf("espanhol");
        const antes = frase.toLowerCase().slice(Math.max(0, i - 30), i);
        const corte = Math.max(antes.lastIndexOf(":"), antes.lastIndexOf("="), antes.lastIndexOf(")"));
        const trecho = (antes.slice(corte + 1) + "espanhol").trim();
        assert.ok(textoDoGuia.includes(trecho), `"espanhol" fora do conteúdo do guia: ${trecho}`);
      }
    }
  });

  test("o contexto cabe no limite e sempre traz o país", () => {
    for (const [app, p] of [[uy, "Me conta a história do Teatro Solís"], [rs, "O que fazer na Serra no inverno?"]]) {
      const c = app.montarContexto(p);
      assert.ok(c.length <= 12000);
      assert.match(c, new RegExp(`^País: ${app.dados.nome}`));
    }
  });

  test("UY: pergunta sobre um lugar traz o lugar e as frases com pronúncia", () => {
    const c = uy.montarContexto("Me conta a história do Teatro Solís");
    assert.match(c, /LUGAR: Teatro Solís/);
    assert.match(c, /\(DOS en-TRA-das/);
  });
});
