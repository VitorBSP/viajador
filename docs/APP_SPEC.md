# Viajador — Especificação de Marca, UX e Produto (`APP_SPEC.md` · v2.0)

> Documento-contrato vivo (*app.md*) para evoluir o **Viajador** de projeto pessoal para uma **marca séria de viagem do ecossistema Duck AI Labs**, sem perder a originalidade, a leveza offline-first nem a voz de amigo local na rua.

---

## 1. Essência da Marca

- **Nome:** **Viajador** *(submarca opcional de assinatura: `por Duck AI`)*
- **Posicionamento:** Guia de bolso offline-first para brasileiros viajarem melhor — **entender o lugar, não passar aperto no idioma, montar um roteiro sem virar refém da estrada e guardar as memórias num álbum de figurinhas**.
- **Origem real (DNA):** Nasceu de uma viagem real ao Uruguai (medo de errar no espanhol rioplatense, dúvida do que priorizar no pouco tempo e vontade de registrar as memórias) e cresceu para o **Rio Grande do Sul** a partir da pergunta: *"será que a gente aproveita o próprio RS tanto quanto aproveita uma viagem fora?"*.
- **Personalidade:** Amigo local inteligente e direto ([`docs/TOM-DE-VOZ.md`](TOM-DE-VOZ.md)). **Nunca** soa como agência de turismo, site de reserva ou chatbot genérico.
- **Princípio técnico inegociável:** Funciona **100% offline** para o núcleo de viagem (frases, lugares, fotos, roteiro, álbum, conversor). Zero login obrigatório na entrada.

---

## 2. Sistema Visual (Preservando a Originalidade + Elevando o Acabamento)

### 2.1 Paleta Editorial (Marca Neutra Multi-Território)
Em vez de amarrar a marca inteira à bandeira do Uruguai, a marca **Viajador** usa uma paleta própria de **caderno/passaporte editorial**, e cada destino aplica apenas um **acento territorial** (bandeira, capa do álbum, chips ativos).

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--papel` (fundo) | `#F7F5EF` | `#0E131E` | Fundo principal, sensação de guia impresso |
| `--superficie` (card) | `#FFFFFF` | `#161E2E` | Cards, sheets, bottom bar |
| `--tinta` (texto) | `#162032` | `#EEF2F8` | Títulos e corpo |
| `--suave` | `#5B6678` | `#99A5B8` | Metadados, distâncias, legendas |
| `--borda` | `#E6E1D5` | `#263147` | Divisórias sutis (`1px`) |
| `--primaria` (azul passaporte) | `#0F356B` | `#8BB4FF` | Ações principais, cabeçalhos, destaques |
| `--ouro` (selo/sol) | `#E59A00` | `#FFC445` | Selos, estrelas obrigatórias, destaque **Duck AI PRO** |
| `--destaque-territorio` | Variável por país | Variável por país | Ex.: UY `#0B5ED7`, RS `#1B7A4A` (sutil, só em badges/capas) |

### 2.2 Tipografia
- **Display / Títulos:** `Fraunces` (600–700) — dá assinatura editorial e calor humano.
- **Interface / Leitura / Números:** `Inter` (400–600) com `font-variant-numeric: tabular-nums` em distâncias, tempos, moedas e placares.

### 2.3 Regra de Ícones (Zero Emoji na Navegação)
- **Proibido usar emojis** na barra principal, botões de ação e atalhos estruturais (emojis variam entre iOS/Android/Windows e dão cara de protótipo).
- **Padrão:** ícones **SVG inline minimalistas**, traço único `stroke-width: 1.75`, `stroke-linecap: round`, `stroke-linejoin: round`, `20px–24px`.
- Emojis ficam restritos, no máximo, a bandeiras/detalhes lúdicos pontuais do conteúdo quando não houver ícone vetorial correspondente.

### 2.4 Direções de Símbolo da Marca (Decisão Aberta no Protótipo v2.0)
Para substituir o círculo amarelo `.sol` (preso ao Uruguai), avaliamos 3 símbolos autorais:
- **Opção A — Carimbo / Bússola de Passaporte:** anel duplo editorial com ponteiro diagonal — comunica viagem séria, curadoria e coleção de carimbos.
- **Opção B — Pato Viajante Editorial:** silhueta geométrica/traço limpo de pato com chapéu/bússola minimalista — cria elo imediato com a **Duck AI** mantendo sobriedade.
- **Opção C — Horizonte & Estrada:** evolução minimalista do sol atual com linha de estrada/horizonte — máxima continuidade com a v1.x e neutro para qualquer destino.

---

## 3. O Que Extraímos dos 3 UI Kits de Referência

Os 3 UI kits estudados fornecem **estrutura de componentes**, nunca cores nem copy genérica:

1. **De *Tour & Travel App UI*:**
   - **Timeline vertical do Roteiro:** linha conectora à esquerda com ponto de cor por turno (manhã/tarde/noite), miniatura quadrada arredondada, título, tempo sugerido e distância (`km`).
   - **Detalhe de Lugar em Sheet sobre Foto Hero:** foto full-bleed no topo com botão voltar circular translúcido e card branco arredondado (`border-radius: 24px 24px 0 0`) subindo com história, *o que reparar*, frases e botões *Quero ir / Já fui*.
   - **Busca em pílula + atalhos rápidos em cards quadrados** com ícone SVG dentro de círculo suave.
2. **De *Woosh (Travel Booking Mobile UI Kit)*:**
   - **Barra inferior fixa de 5 ícones SVG** com o **botão central elevado em destaque** (reservado para o **GuIA**).
   - **Cards fotográficos limpos** (`radius 18px`) com badge discreto no canto superior esquerdo (ex.: `Obrigatório` / `Perto · 450 m`) e botão circular translúcido de salvar/marcar no canto superior direito.
   - **Mosaico fotográfico inclinado** na capa de abertura do **Álbum ("Por onde andei")**.
3. **De *GoTravel Mobile App*:**
   - **Onboarding opcional de 1 passo na primeira visita:** escolha do território (Uruguai ou Rio Grande do Sul) sem login nem cadastro.
   - **Listas limpas de seleção com check à esquerda** para montar o roteiro *"Do meu jeito"* e selecionar regiões.

---

## 4. Arquitetura de Informação (De 8+10 Abas para 5 Pilares)

No celular, a navegação concentra tudo em **5 abas fixas** (com o **GuIA** em destaque central):

| # | Aba | Ícone SVG | O que vive aqui |
|---|---|---|---|
| 1 | **Explorar** | Bússola / Pin | Busca global em pílula, **Perto de você** (GPS), **Lugares & Comidas**, **História**, **Futebol** e **Quiz** (via chips no topo) |
| 2 | **Falar** | Balão | Situações e frases com pronúncia à brasileira, **Modo Mostrar** em tela cheia, **Conversas**, **Gírias**, **Ditados**, **Pronúncia** e **Conversor offline** (em destinos com moeda estrangeira) |
| 3 | **GuIA** *(central)* | Estrela/Faísca | Chat com IA ancorado nos fatos curados do guia (RAG client-side), entrada por voz e badge de cota / **Duck AI PRO** |
| 4 | **Roteiro** | Mapa / Trilha | Assistente automático e *"Do meu jeito"* em **Timeline vertical**, indicador de estrada (`≤ 25%`), troca de parada e **Meus roteiros** |
| 5 | **Álbum** | Caderno / Selo | Álbum de figurinhas *"Por onde andei"* com capa pintada pela bandeira, progresso por região, **Salvos** e **Preparar** (checklist/etiqueta) |

*No Rio Grande do Sul (`semTraducao: true`), a aba 2 se chama **Vocabulário** (gírias por região, palavras locais e jeito de falar), e o app abre direto em **Explorar**.*

---

## 5. Telas-Chave & Microinterações

1. **Cabeçalho Compacto:** Símbolo da marca + wordmark `Viajador` à esquerda; pílula compacta de seleção de território (bandeira desenhada + nome + seta) à direita. Busca global em pílula logo abaixo.
2. **Roteiro Timeline:**
   - Barra de resumo no topo: `3 dias · 9 paradas · 18% de estrada (limite 25%)`.
   - Cada parada é um cartão na linha do tempo com foto `56×56`, tempo (`1h30`), distância do ponto anterior, selo `★ Obrigatório` e menu rápido (`Trocar`, `Tirar`, `Já fui`).
3. **Álbum de Figurinhas:**
   - Capa interativa com mosaico das fotos já desbloqueadas + mapa preenchido pela bandeira.
   - Figurinhas visitadas em cor viva com carimbo de data; não visitadas em sépia/contorno pontilhado com CTA *"Quero ir"*.
4. **Modo Mostrar (Tela Cheia):**
   - Mantém o diferencial de rua: frase gigante, pronúncia em destaque, zoom `A− / A+`, girar 180°, ouvir e tela sempre acesa (*Wake Lock*).

---

## 6. Camada Duck AI PRO (Monetização Futura — Sem Atrapalhar o Núcleo Gratuito)

- **Núcleo sempre gratuito e offline:** frases, pronúncia, lugares, fotos, GPS, conversor offline, roteiro local, álbum local e GuIA com cota diária gratuita.
- **Benefícios previstos do `Duck AI PRO`** (quando entrar conta + persistência em nuvem):
  1. **GuIA Turístico sem limite diário** (removendo a trava gratuita de 30 perguntas/dia por aparelho).
  2. **Sincronização na nuvem de Roteiros e Álbum ("Por onde andei")** entre aparelhos, com exportação/compartilhamento de roteiro e álbum da viagem.
  3. **Acesso antecipado a novos territórios** (ex.: Argentina, Chile, novos estados do Brasil).
- **Visual do selo:** badge discreto `PRO` em dourado (`#E59A00` sobre escuro `#0E131E`) seguindo o sistema de 3 níveis da marca **Duck AI**. **Nunca** exibir paywall agressivo ou bloquear quem está na rua sem sinal.

---

## 7. Plano de Implementação da v2.0 (Sem Quebrar Nada)

1. **Onda 1 (Concluída — `v1.39` / `v1.40`):** Blindagem técnica UY + RS (offline das 171 fotos, fix do GuIA no RS, `validar.py` no CI, conversor BRL ↔ UYU offline + propina 10%).
2. **Onda 2 (Aprovação visual):** Escolha do símbolo (A, B ou C) no protótipo interativo v2.0.
3. **Onda 3 (v2.0 — Fundação visual no PWA):** Novo logo SVG + ícones do manifest, troca de todos os emojis de navegação por SVGs, barra inferior de 5 pilares e tokens atualizados em `styles.css`.
4. **Onda 4 (v2.1 — Telas-estrela):** Timeline vertical no Roteiro, sheet sobre foto hero nos detalhes de lugar e capa em mosaico no Álbum.
5. **Onda 5 (v2.2 — Duck AI PRO):** Auth + sincronização Supabase (com revisão LGPD) e liberação de cota ilimitada no GuIA para assinantes PRO.
