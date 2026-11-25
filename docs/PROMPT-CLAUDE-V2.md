# Prompts prontos para o Claude Code — Viajador v2.0

> Dica de ouro: rode **uma onda por vez**, começando sempre em **Plan Mode** (`Shift+Tab` no Claude Code) para revisar o plano antes de editar código. Depois de cada onda, abra `http://localhost:5510` em viewport mobile (`390×844`), tire print (claro e escuro, UY e RS) e mande de volta para o Claude refinar.

---

## Prompt 1 — Onda A: Fundação de Marca, Ícones SVG e Navegação em 5 Pilares

```text
Leia CLAUDE.md, docs/APP_SPEC.md, docs/TOM-DE-VOZ.md e docs/referencias/README.md.
Abra também as imagens em docs/referencias/ (ui-kit-tour-travel.png, ui-kit-woosh-booking.png, ui-kit-gotravel.png) e o arquivo docs/referencias/prototipo-v2.html como referência visual de estrutura.

Quero executar APENAS a Onda A do redesign v2.0 (sem mexer ainda nos algoritmos de roteiro ou nos arquivos data/*.js):
1. Substituir a marca no topo e o ícone do app (`icons/icon.svg` e marca no header) pelo símbolo [ESCOLHA: Opção A Carimbo/Bússola | Opção B Pato Viajante Editorial | Opção C Horizonte/Estrada] com assinatura discreta "Viajador · por Duck AI".
2. Refinar os tokens visuais em styles.css (paleta papel #F7F5EF, azul passaporte #0F356B, ouro #E59A00, dark mode #0E131E e acento territorial sutil para UY e RS) mantendo 100% de acessibilidade (contraste AA+, :focus-visible, safe-area-inset).
3. Substituir TODOS os emojis da navegação e botões estruturais por um conjunto coeso de ícones SVG inline (stroke-width 1.75, round).
4. Reorganizar a barra de navegação mobile e desktop para os 5 pilares de docs/APP_SPEC.md: Explorar, Falar (Vocabulário no RS), GuIA (botão central elevado), Roteiro e Álbum — garantindo acesso limpo às seções secundárias (História, Futebol, Quiz, Conversas, Gírias, Ditados, Pronúncia, Preparar/Conversor, Salvos) sem perder nenhuma rota `#/...` existente.
5. Subir versão sincronizada em app.js e sw.js e rodar `python3 scripts/validar.py`, `node --check app.js` e `node --check sw.js`.

Antes de editar qualquer arquivo, apresente um plano objetivo listando os arquivos que vai alterar, como as rotas antigas continuam funcionando e quais melhorias visuais você propõe além do protótipo.
```

---

## Prompt 2 — Onda B: Telas-Estrela (Roteiro Timeline, Lugar em Sheet/Hero e Álbum Passaporte)

```text
Seguindo CLAUDE.md, docs/APP_SPEC.md e docs/referencias/ (especialmente ui-kit-tour-travel.png, ui-kit-woosh-booking.png e prototipo-v2.html), vamos executar a Onda B focada nas 3 telas-estrela — preservando toda a lógica de montarRoteiro(), localStorage e dados reais de uy.js e rs.js:

1. Roteiro em Timeline Vertical: transformar a lista de paradas por dia numa linha do tempo vertical limpa (marcador colorido por prioridade/turno, miniatura da foto do lugar quando existir, tempo sugerido, distância/deslocamento e barra visual do orçamento de estrada ≤ 25%), mantendo todas as ações (Mais detalhes, Trocar, Tirar, Já fui, Ajustar, Do meu jeito, Meus roteiros).
2. Cards Fotográficos & Detalhe de Lugar: elevar os cards de Perto de você / Lugares (badge de obrigatório/distância e ação Quero ir / Já fui sobre a foto) e o visual da página/detalhe do ponto com foto hero full-bleed e conteúdo em sheet arredondado (sem quebrar créditos Wikimedia Commons).
3. Álbum ("Por onde andei") estilo Passaporte/Mosaico: refinar a capa com visual de passaporte editorial + progresso claro por região/nível e figurinhas colecionáveis com contraste nítido entre visitado e pendente.
4. GuIA Turístico: elevar o visual do chat (balões mais limpos, sugestões em chips horizontais, espaço discreto para cota diária e selo futuro "Duck AI PRO" sem paywall invasivo).

Primeiro proponha o plano de alterações (arquivos e seletores) e depois implemente. Ao final, suba a versão em app.js e sw.js e valide com `python3 scripts/validar.py`, `node --check app.js` e `node --check sw.js`.
```

---

## Prompt 3 — Onda C: Auditoria Visual Mobile + Dark Mode + Offline

```text
Inicie o servidor local (`python3 -m http.server 5510`), abra o Viajador em mobile (390x844) e desktop (1280x800) e faça uma auditoria rigorosa nos 4 cenários:
1. Uruguai — modo claro
2. Uruguai — modo escuro
3. Rio Grande do Sul — modo claro
4. Rio Grande do Sul — modo escuro

Verifique e corrija:
- Sobreposições da barra inferior com conteúdo (padding-bottom suficiente + safe-area);
- Overflow horizontal em telas de 360px;
- Contraste WCAG AA em textos secundários, badges e botões;
- Ausência de menções a espanhol no RS (`semTraducao`);
- Funcionamento completo do conversor UYU↔BRL, modo Mostrar em tela cheia, troca de lugar no Roteiro e carimbo no Álbum;
- Execução limpa de `python3 scripts/validar.py`, `node --check app.js` e `node --check sw.js`.
```
