# Viajador — Roadmap de ideias

Base atual: site estático, frases por situação (es/pt/pronúncia), ouvir (Web Speech), mostrar em tela cheia, favoritos, gírias, ditados, falsos amigos, lugares. Sem build, dados em `data/<país>.js`.

Escala: impacto (I) e esforço (E) de 1 a 5. Prioridade = I ÷ E. Sempre pensando em quem está **na rua, com uma mão, 4G ruim**.

## 1. Funcionalidades ranqueadas

| # | Ideia | I | E | Nota |
|---|-------|---|---|------|
| 1 | **PWA offline + instalável** | 5 | 2 | Sem sinal na praia/rural = app inútil. Service worker + manifest. (sessão deploy/frontend) |
| 2 | **Busca global instantânea** (frases, gírias, comidas; tolera acento e português) | 5 | 2 | "banheiro", "cuenta", "troco" → resultado em 1 toque. Só JS sobre os dados atuais. |
| 3 | **Conversor de moeda offline** (BRL ↔ UYU, taxa editável + última taxa salva) | 4 | 1 | Taxa manual/cacheada; atualiza quando houver rede. Inclui "calcular gorjeta 10%" (propina). |
| 4 | **Modo "Mostrar" melhorado**: frase gigante + botão "Responder" com respostas prováveis (sim/não/quanto/onde) | 5 | 2 | O nativo responde em espanhol; o usuário precisa entender. Cartões de resposta (números, "a la derecha") mostrados *pelo outro lado*. |
| 5 | **Modo conversa guiado** ("Estou no restaurante" → fluxo: mesa → pedir → conta) | 4 | 3 | Sequência de 5–6 frases com ramificação simples. Dados: campo `fluxo` por situação. |
| 6 | **Checklist pré-viagem** (documentos, adaptador de tomada tipo C/L, dólar em espécie, seguro, chip) | 3 | 1 | localStorage, itens por país. Bom para retenção antes da viagem. |
| 7 | **Frases por localização** (GPS → "Você está em Pocitos: frases de praia/rambla") | 4 | 3 | Geolocalização simples contra caixas lat/lng de `lugares`; sempre com opção manual. Sem rede não exige API. |
| 8 | **Números & preços em voz alta**: digita "1.850" → mostra "mil ochocientos cincuenta" + toca | 4 | 2 | Maior dor real: entender preço. Gerador de extenso es-UY. |
| 9 | **Áudios de nativos** (gravados, não TTS) | 4 | 4 | TTS de navegador varia muito (Android sem voz es-UY). Começar com 30 frases-chave; hospedar `.mp3` curtos, cache no SW. |
| 10 | **Câmera para traduzir cardápio** | 4 | 5 | Exige OCR + tradução (API paga/ML pesado). Alternativa barata: **glossário de cardápio** (chivito, milanesa, etc.) pesquisável. Deixar para depois. |
| 11 | **Pedir de forma mais educada**: variações de formalidade (vos / usted) | 2 | 3 | Útil, mas cobre pouco o dia a dia turístico. |
| 12 | **Sugestão de frases pelo usuário** (backend) | 2 | 4 | Só quando houver base de usuários. |

**Fazer primeiro (maior I÷E):** 3, 2, 1, 6, 4, 8.

## 2. Próximos países

Ordem sugerida (demanda de turistas brasileiros × reaproveitamento do rioplatense):

1. **Argentina** (Buenos Aires, Bariloche, Mendoza, Ushuaia) — 70% do conteúdo reaproveita `uy`. Maior público brasileiro.
2. **Chile** (Santiago, Valparaíso, Atacama, Patagônia) — alta demanda, espanhol bem diferente.
3. **Paraguai** (Assunção, Ciudad del Este) — guarani misturado, compras; Ciudad del Este atrai muita gente.
4. **Peru** (Cusco, Lima, Machu Picchu) — turismo forte, altitude/quéchua.
5. **Colômbia** (Bogotá, Medellín, Cartagena) — crescimento, espanhol "limpo".
6. **México** (Cancún, CDMX) — voos diretos, voz `es-MX` bem suportada.
7. **Espanha** — quem vai já costuma saber algo; maior diferença (vosotros, ES).

| País | O que muda |
|------|-----------|
| **Argentina** | Voseo igual ao UY; "ll/y" vira **"sh"** (*calle* = `KA-she`; no UY é mais "dj/ch"). Gírias: *che, boludo (cuidado), quilombo, laburo, mango, bondi, birra, copado, re*. "Dólar blue" e câmbio/pagamento complicado → seção de dinheiro. Comidas: asado, empanadas, choripán, fernet. Voz: `es-AR`. |
| **Chile** | **Tuteo + voseo chileno** misto; fala rápida, come "s" final (*¿cómo estai?*). Gírias: *cachai, po, weón (cuidado), bacán, pololo, once, luca*. Dica de pronúncia: "ch" forte, "s" aspirado. Voz: `es-CL`. |
| **Paraguai** | Voseo + guarani (*che, ndaje, mba'éichapa*). Moeda: guaraníes (números enormes → conversor/leitor de números essencial). Falsos amigos de compras. Voz: `es-PY` (fallback es-AR). |
| **Peru** | Tuteo, sem voseo. Quéchua em Cusco (*apu, ñan*), altitude (*soroche*), comida (ceviche, anticuchos, ají). Voz: `es-PE`. |
| **Colômbia** | Tuteo / *usted* até entre conhecidos; "¿a la orden?", *parce, chévere, vaina*. Pronúncia clara e lenta (boa para iniciantes). Voz: `es-CO`. |
| **México** | *Usted* e diminutivos (*ahorita, ándale, órale*). Falsos amigos específicos (*coger* é pior ainda). Voz: `es-MX`. |

**Estrutura de dados para suportar isso:** campo `herda: "uy"` em `data/<país>.js` — o novo país só declara o que difere (override por `id` de frase), reduzindo cópia. Cada frase pode ter `variantes: { ar: "...", cl: "..." }`.

## 3. Diferenciais vs. Google Tradutor / Duolingo

1. **Pronúncia "do jeito brasileiro" com tônica marcada.** O Tradutor dá IPA/áudio; o Duolingo ensina em semanas. O Viajador entrega `DON-de es-TÁ el BA-nho` pronto para ler em voz alta na hora, pensado em quem fala português.
2. **Espanhol local e cultural, não genérico.** Voseo, gírias, "ta", falsos amigos que dão vexame (*embarazada, coger*), dicas de gorjeta/horário/costume por cidade. O Tradutor devolve espanhol neutro; o Duolingo ensina "tú" que ninguém usa em Montevidéu.
3. **Feito para a rua: offline, tela cheia, 3 toques.** Tradutor exige rede para o melhor resultado e digitação; Duolingo exige sessão. Aqui o fluxo é situação → frase → mostrar/ouvir, com cartões de resposta para entender o que o outro diz. *(Extra:* conteúdo curado por lugar — "estou na Feria de Tristán Narvaja" — que nenhum dos dois tem.)*

## 4. MVP — próximas 2 semanas

**Meta:** o app funciona sem internet e responde "como falo X?" em segundos.

**Semana 1 — Utilidade na rua**
- [ ] PWA offline + manifest (itens 1)
- [ ] Busca global tolerante a acento, PT e ES (2)
- [ ] Conversor BRL↔UYU + gorjeta (3)
- [ ] Leitor de números/preços em espanhol (8)

**Semana 2 — Conversa e retenção**
- [ ] "Mostrar" com cartões de resposta (sim/não/quanto/direita/esquerda) (4)
- [ ] Checklist pré-viagem Uruguai (6)
- [ ] Refatorar `data/` para suportar `herda`/variantes (preparar Argentina)
- [ ] Rascunho de `data/ar.js` (situações herdadas + gírias/dinheiro diferentes)

**Fora do MVP:** câmera/OCR, backend, áudios de nativos (começar a gravar 30 frases em paralelo), localização por GPS.

**Critério de pronto:** testado em celular real em modo avião; qualquer frase em ≤3 toques ou 1 busca; Lighthouse PWA verde.

## Perguntas em aberto
- A voz `es-UY` existe no Android/iOS dos usuários? Medir antes de investir em áudios gravados.
- Fonte de taxa de câmbio sem custo (ex.: API pública) vs. só manual.
