# Proposta: roteiro montado pela pessoa e álbum de lugares

**Implementado na versão 1.30**, com as escolhas do usuário: botões "Quero ir" e "Já fui", roteiro "Do meu jeito" e álbum "Por onde andei" com os níveis Turista (obrigatórios), Viajante (recomendados) e Explorador (todos), figurinhas por região, mapa esquemático na capa, carimbo e frase local ao completar. Ficaram para depois: compartilhar o álbum como imagem, trocar o plano B com um toque e reordenar com ↑↓.

O texto abaixo é a proposta que levou a essas escolhas. Vale para o Uruguai (por cidade) e para o RS (por região). Junta as sugestões das sessões de storytelling, Ideias e UX (frontend).

## O que a UX mediu no site (1.29)

- As 7 abas cabem em 375 px (botões de 52 px). Em 320 px ficam com 45 px, ainda acima do mínimo de 44 px, mas "Situações" encosta nas bordas. Sugestão: rótulo mais curto ("Frases", como "Palavras" no RS) ou, abaixo de 360 px, rótulo só na aba ativa.
- **Não cabe uma 8ª aba.** O álbum vai para Mais; o roteiro próprio fica dentro da aba Roteiro.
- No máximo **três ações por cartão**: Salvar, "+ Roteiro" e "✓ Já fui". Toda ação na metade de baixo da tela, em folhas que sobem de baixo (uma mão só).

## Um gesto para as duas ideias

Cada lugar (em Perto de você, Lugares e Roteiro) ganha dois botões pequenos:

- **"Quero ir"** — guarda o lugar para o roteiro próprio.
- **"Já fui"** — cola a figurinha no álbum.

A pessoa marca uma vez e a informação serve às duas funções. Fica no aparelho, por país, como os favoritos e o quiz. Dá para desmarcar.

## 1. Roteiro montado pela pessoa

### Como encaixar

| Opção | Como funciona | A favor | Contra |
|---|---|---|---|
| **A. "Quero ir" + modo no Roteiro** (recomendada) | O Roteiro ganha duas abas: "Montar para mim" (o automático de hoje) e "Do meu jeito" (só os lugares marcados com "Quero ir"). | Escolhe enquanto lê sobre o lugar; o mesmo gesto do álbum. | Precisa de uma dica na primeira vez para a pessoa descobrir o botão. |
| B. Ajustar o automático | O app monta e a pessoa tira (✕) ou troca pelo plano B (🔁) dentro do roteiro. | Zero esforço para começar. | Quem já sabe o que quer precisa desmarcar muita coisa. |
| C. Tela de escolha à parte | Lista com caixas de marcar, por cidade ou região. | Tudo numa tela. | Lista longa no celular (76 lugares no RS); duplica a escolha. |

**Recomendação:** A, com o ✕ e o 🔁 de B dentro do roteiro para ajustes finos.

**Como a UX desenha a opção A:**

- O botão do cartão se chama "+ Roteiro" e vira "✓ No roteiro", com "Desfazer" no aviso. A aba Roteiro mostra um número com quantos lugares foram escolhidos.
- No topo do Roteiro, um seletor: "Montar pra mim" (o de hoje) ou "Escolho os lugares". No segundo, os escolhidos aparecem como chips, com "+ Adicionar lugares" (lista da região com busca) e o botão "Organizar" embaixo, ao alcance do polegar.
- Ajuste fino com ↑↓ em cada item; arrastar para reordenar fica para depois.
- Plano B: um ⇄ em cada período abre o B; ao trocar, o original vai para "não couberam" em vez de sumir.

### Quando o escolhido não cabe nos dias

Nada sai em silêncio. O roteiro mostra "Cabem 14 de 19 lugares" e oferece:

1. **+1 dia** (mostrando quantos dias seriam precisos para tudo);
2. **Tirar os de menor prioridade**: primeiro os recomendados, depois os que têm plano B mais curto, por último os obrigatórios, sempre dizendo o que saiu e por quê;
3. **Deixar para a próxima**: o que não coube vai para uma lista "Fica para a próxima".

Na tela (sugestão da UX): um bloco recolhido no fim, "3 lugares não couberam · ver". Cada lugar tem o motivo numa linha ("longe demais para 1 dia") e dois botões: "Trocar por…" (abre os itens do dia que dá para tirar) e "Adicionar 1 dia".

### Nome do modo

- **"Do meu jeito"** (recomendado): curto e informal.
- "Meus lugares".
- "Roteiro sob medida".

## 2. Álbum de lugares

A pessoa marca onde já foi. Cada cidade (Uruguai) ou região (RS) mostra o progresso em três níveis, cada um com a sua %. O nível de cada lugar sai do campo `prioridade`, que já existe: não precisa de dado novo.

### Nomes dos três níveis

| Conjunto | Obrigatórios | Recomendados | Todos |
|---|---|---|---|
| **Fotos de viagem** (recomendado) | Cartão-postal | Roteiro cheio | Álbum completo |
| Progressão da pessoa | Turista | Viajante | Explorador |
| Pé na estrada | Pé na estrada | Já sou de casa | Conheço tudo |
| Passaporte | Carimbo | Visto | Cidadão |

**Recomendação:** "Cartão-postal → Roteiro cheio → Álbum completo". Os nomes explicam o que cada % mede e servem para qualquer país. O toque local vem na frase de parabéns, com uma gíria da região ("Tri bom! Tu fechou a Serra" ou "¡Pa, Montevideo completo!").

### Forma visual

| Opção | Como funciona | Esforço |
|---|---|---|
| **A. Figurinhas por região + mapa na capa** (recomendada) | Uma página por cidade ou região, com cada lugar como figurinha cinza que "cola" colorida ao marcar e as três barras de % no topo. Na capa, o mapa do RS ou do Uruguai vai se colorindo com o % de cada região. | Médio: figurinhas usam os ícones que já existem; o mapa é um SVG simples, com uma peça por região. |
| B. Só figurinhas | Igual à A, sem o mapa na capa. | Baixo |
| C. Raspadinha | O lugar vem coberto e a pessoa "raspa" ao marcar. | Alto: pede animação e mostra pior o progresso por região. |

### Onde fica e como mostrar as % (sugestão da UX)

- Em **Mais**, como "🗺️ Meu álbum", e um resumo no topo de Perto de você: "Você já foi a 12 de 52 lugares do RS · ver álbum".
- No álbum, uma barra por território com um seletor dos três níveis (o padrão é o primeiro, que dá progresso mais rápido). Embaixo, as regiões ou cidades, cada uma com um anel de % e "4/7". Ao abrir, os visitados aparecem em cor e os outros em cinza tracejado: é o efeito de "raspar".
- Nas outras telas, nenhuma %: só o "✓ Já fui" no cartão.
- O mapa de raspar de verdade (as 8 regiões pintando conforme a %) fica como capa, numa segunda etapa, porque pede uma arte nova.

### Recompensas leves (sem internet e sem servidor)

- **Carimbo de passaporte** ao chegar a 100% de qualquer nível numa região, com o nome da região e a data.
- **Frase local** de prêmio, tirada das gírias que já temos.
- Depois: **compartilhar** a imagem do álbum com os % (WhatsApp).

### Cuidados

- Marcar à mão; o GPS só sugere ("Você está perto do Mercado Público. Marcar no álbum?").
- "Álbum completo" do estado inteiro é quase inalcançável (76 lugares no RS): destacar o % por região, que é o que motiva.
- Guardar por país, para RS e Uruguai não se misturarem.

## Ordem sugerida

Primeiro o **álbum** (menos telas, reaproveita os cartões e o campo `prioridade`), depois o **roteiro próprio**. A sessão de frontend se ofereceu para implementar.

## Perguntas para decidir

1. Roteiro: "Quero ir" + modo "Do meu jeito" (recomendado), ou só ajustar o automático?
2. Nome dos níveis: "Cartão-postal, Roteiro cheio, Álbum completo" (recomendado), "Turista, Viajante, Explorador" ou outro?
3. Visual do álbum: figurinhas com mapa na capa (recomendado) ou só figurinhas, para sair mais rápido?
