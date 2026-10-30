# Sugestões para os textos da interface

Nada aqui foi aplicado: `index.html` e `app.js` estão com a sessão de frontend. As linhas se referem ao commit base `9825eba`. O critério é o de [TOM-DE-VOZ.md](TOM-DE-VOZ.md).

## Prioridade alta: erro ou texto que confunde

| Onde | Hoje | Sugestão | Por quê |
|---|---|---|---|
| `app.js:83` | O que você precisa agora? | **Do que você precisa agora?** | Regência: quem precisa, precisa *de* algo. |
| `app.js:117` | `pt: "Como pedir"` nos cartões de comida | Tradução real do pedido | "Como pedir" aparece no lugar da tradução e também na tela Mostrar. Precisa de um campo novo em `comidas` (ver abaixo). |
| `app.js:161` | `${n} frase(s)` | **1 frase** / **12 frases** | Trocar o "(s)" por plural de verdade. |
| `app.js:74`, `app.js:193` | ★ Salvar, depois de salva | **★ Salva** | O botão continua dizendo "Salvar" quando a frase já foi salva. |
| `app.js:35` | Seu navegador não tem voz | **Sem voz em espanhol aqui. Use a pronúncia escrita ou toque em Mostrar.** | Diz o que fazer em seguida. |
| `index.html:31` | Ditados | **Expressões** | A aba também guarda os falsos amigos, o conteúdo mais útil dela. |

## Prioridade média: mais claro e mais a nossa cara

| Onde | Hoje | Sugestão |
|---|---|---|
| `app.js:84` | Toque na situação, ouça a frase ou mostre a tela. | Escolha a situação. Depois, é só ouvir a frase ou mostrar a tela. |
| `app.js:98` | `${n} frases úteis` | `${n} frases` |
| `app.js:103` | Dicas e frases para cada ponto turístico. | Dicas e frases para cada lugar. E, no fim, o que pedir pra comer. |
| `app.js:123` | Para entender a conversa (e soltar uma de vez em quando). | Mantém: é o tom certo. |
| `app.js:128` | Frases feitas que você vai ouvir por aí. | Mantém. |
| `app.js:131` | Palavras parecidas com o português, mas com outro sentido. | Parecem português, mas não são. Algumas dão até vergonha. |
| `app.js:136` | Não é: … | Mantém. |
| `app.js:141` | Pronúncia sem sufoco | Mantém. |
| `app.js:142` | As regras que mais fazem diferença para quem fala português. A sílaba em MAIÚSCULA é a forte. | A sílaba em MAIÚSCULA é a forte. Estas são as regras que mais fazem diferença pra quem fala português. |
| `app.js:154` | Suas frases favoritas ficam guardadas neste aparelho. | Suas frases ficam guardadas neste aparelho. |
| `app.js:155` | Toque em ☆ Salvar em qualquer frase para guardá-la aqui. | Nenhuma frase salva ainda. Toque em ☆ Salvar nas que você mais vai usar. |
| `app.js:162` | Nada encontrado. Tente outra palavra, em português ou espanhol. | Não achei nada. Tente outra palavra, em português ou espanhol. |
| `index.html:25` | Buscar: banheiro, conta, foto… | Mantém: curto e mostra o que dá pra buscar. |
| `index.html:7` | Guia de bolso de espanhol para brasileiros no Uruguai: frases, pronúncia, gírias e dicas para Montevidéu e Punta del Este. | Mantém. |

## Acessibilidade

| Onde | Hoje | Sugestão |
|---|---|---|
| `app.js:72-74` | Emojis e símbolos dentro dos botões (🔊 ⛶ ☆) | Colocar o símbolo em `aria-hidden` e dar contexto: `aria-label="Ouvir: ¿Dónde está el baño?"`. |
| `app.js:68` | 🗣️ antes da pronúncia | `aria-hidden` no emoji e rótulo "Pronúncia:" só para leitor de tela. |
| `index.html:17` | `aria-label="Início"` | `aria-label="Viajador, ir para o início"` |
| `index.html:24` | Buscar frase | Mantém. |

## Ideias que dependem de código ou de dados

- **Tela Mostrar:** um rótulo pequeno, em espanhol, para quem vai ler a tela: *"Un turista brasileño te quiere decir:"*. Deixa claro por que estão mostrando um celular.
- **Pronúncia nas comidas e nos ditados:** `comidas` e `ditados` não têm `pr`, então esses cartões saem sem pronúncia. Sugestão para a sessão de dados: acrescentar `pr` aos dois e `pedirPt` a `comidas`. Mantive a estrutura atual nesta revisão.
- **Busca:** hoje ela só cobre situações, lugares e comidas (`app.js:16-19`). Quem procura "bondi" ou "exquisito" não acha nada; vale incluir gírias, ditados e falsos amigos.
- **Aviso de voz:** se o aparelho não tiver nenhuma voz em espanhol, a frase é lida com a voz padrão, com sotaque errado e sem aviso (`app.js:38`). Vale avisar uma vez com o texto sugerido acima.
- **Legenda da pronúncia:** um link "como ler isto?" no cartão, levando à aba Pronúncia.
