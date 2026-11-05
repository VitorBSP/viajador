# Formato de um país

Cada país é um arquivo `data/<código>.js` que registra um objeto em `window.VIAJADOR.paises`. Só dados literais: nada de variáveis, funções ou textos concatenados com `+`.

```js
window.VIAJADOR = window.VIAJADOR || { paises: {} };
window.VIAJADOR.paises.uy = { codigo: "uy", /* ... */ };
```

Para começar um país novo, copie `data/_modelo.js`. Arquivos que começam com `_` não são validados por padrão.

Para validar:

```bash
python scripts/validar.py
```

## Campos do país

Todos são obrigatórios, porque `app.js` usa cada um sem conferir se existe.

| Campo | Tipo | Regra |
|---|---|---|
| `codigo` | texto | 2 letras minúsculas (ISO 3166). Igual ao nome do arquivo e à chave em `paises`. |
| `nome` | texto | Nome em português. |
| `bandeira` | texto | Emoji da bandeira. |
| `voz` | lista de textos | Idiomas para a voz do navegador, do mais específico ao mais geral. Pelo menos 1. |
| `cidades` | lista de textos | Cidades cobertas. Deve bater com `lugares[].cidade`. |
| `intro` | texto | Uma ou duas frases sobre o espanhol local. |
| `situacoes` | lista | Pelo menos 1. |
| `girias`, `ditados`, `falsosAmigos`, `pronuncia`, `comidas`, `lugares` | lista | Podem estar vazias (gera aviso e a tela fica em branco), mas precisam existir. |
| `conversas`, `etiqueta`, `checklist`, `guia`, `historias`, `quiz` | lista | Opcionais. |
| `imagens` | objeto | Opcional: créditos em `lugares` (por id do guia), `pessoas` (por nome) e `origem`. |
| `artigo` | texto | Opcional: `o`, `a`, `os` ou `as`, para o app escrever "Quiz do Uruguai" e "Como nasceu a Argentina". Sem ele, "Quiz de Cuba". |
| `origem` | objeto | Opcional: aba "Origem do país". `lead`, `imagem` (caminho no repositório), `alt`, `legenda` e, se quiser, `quiz` (id de um nível). Exige `fundacao` na primeira história. |
| `rapidas` | lista | Opcional: atalhos da tela inicial, `{ rotulo, icone, es }`, com o `es` exato de uma frase de `situacoes` ou `lugares`. Sem ela, o app procura "baño", "la cuenta", "sacás una foto" e "ayuda"; se nada bater, a faixa some. |
| `capas` | lista de textos | Opcional: ilustrações do topo que o país usa (`inicio`, `lugares`, `girias`...). Sem ela, todas aparecem; várias são do Uruguai. |
| `sugestoesIA` | lista de textos | Opcional: perguntas prontas do GuIA Turístico. Sem ela, o app usa sugestões genéricas. |
| `futebol` | objeto | Opcional: `intro`, `titulos`, `momentos`, `clubes`, `estadios`, `idolos`, `cultura`, `jogo`, `frases`, `fontes`. |

## Itens de cada lista

Na coluna "Opcionais", o campo pode faltar, mas não pode estar vazio. Nos demais, nenhum texto pode ser vazio.

| Lista | Obrigatórios | Opcionais | Único no país |
|---|---|---|---|
| `situacoes[]` | `id`, `icone`, `titulo`, `frases` | | `id` |
| `girias[]` | `es`, `pt`, `pr` | `ex`, `dica`, `regioes` | `es` |
| `ditados[]` | `es`, `pt`, `uso` | | `es` |
| `falsosAmigos[]` | `es`, `pt`, `errado` | | `es` |
| `pronuncia[]` | `regra`, `ex` | `dica` | `regra` |
| `comidas[]` | `nome`, `desc`, `pedir` | | `nome` |
| `lugares[]` | `cidade`, `itens` | | `cidade` |
| `lugares[].itens[]` | `nome`, `icone`, `dica`, `frases` | | `nome` (na cidade) |
| frase (em `frases[]`) | `es`, `pt`, `pr` | `dica` | ver abaixo |
| `conversas[]` | `id`, `icone`, `titulo`, `passos` | | `id` |
| `conversas[].passos[]` | `titulo`, `es` | | |
| `etiqueta[]` | `titulo`, `texto` | | |
| `checklist[]` | `id`, `texto` | `nota` | `id` |
| `guia[]` | `id`, `lugar`, `coords`, `revisado`, `resumo`, `historia`, `reparar`, `fontes` | | `id` |
| `guia[].fontes[]` | `titulo`, `url` | | |
| `historias[]` | `id`, `titulo`, `icone`, `intro`, `momentos`, `costumes`, `pessoas`, `estrelas`, `datas`, `fontes` | `fundacao` | `id` |
| `historias[].momentos[]`, `datas[]` | `data`, `titulo`, `texto` | | |
| `historias[].costumes[]` | `titulo`, `texto` | | |
| `historias[].pessoas[]` | `nome`, `origem`, `texto` | | |
| `historias[].estrelas[]` | `nome`, `area`, `origem`, `texto` | | |
| `quiz[]` | `id`, `titulo`, `icone`, `descricao`, `perguntas` | | `id` |
| `quiz[].perguntas[]` | `pergunta`, `certa`, `erradas` (3 ou mais), `explica` | `imagem` | |

- **`id` da situação:** só `a-z`, `0-9` e `-`, porque vai na URL (`#/s/comer`).
- **`frases`:** pelo menos 1 em cada situação e em cada lugar.
- **`girias[]`:** use `ex` ou `dica`. Se houver os dois, o app mostra só `ex`.
- **`conversas[].passos[].es`:** lista de frases de `situacoes` ou `lugares`, citadas pelo texto exato de `es`. Citação inexistente é erro.
- **`guia[]`:** `lugar` é o `nome` exato de um item de `lugares`, de onde vêm as frases. `coords` é `[latitude, longitude]`. `revisado` é o mês da última conferência (`AAAA-MM`). `historia` é uma lista de parágrafos, e cada fato precisa estar nas `fontes`.
- **`falsosAmigos[].pt`:** começar com `⚠️` destaca o item como alerta (palavrão, por exemplo).
- **`ditados[]` e `comidas[].pedir`:** não têm campo de pronúncia, e o app não mostra pronúncia neles.

## Pronúncia (`pr`)

Escrita do jeito brasileiro, com a sílaba tônica em MAIÚSCULA: `DON-de es-TÁ el BA-nho`. O validador avisa quando:

- nenhuma letra está em maiúscula;
- `es` e `pr` têm números diferentes de palavras (o teste é ignorado se `es` tiver algarismos);
- `es` e `pr` têm números diferentes de opções separadas por `/`.

## O que o validador reporta

- **Erro** (saída 1): campo obrigatório ausente ou vazio, tipo errado, id ou chave repetidos, arquivo que não pode ser lido.
- **Aviso** (não reprova): campo desconhecido, seção vazia, cidade que não bate, pronúncia suspeita, frase repetida.

Frases iguais em `situacoes`, `lugares` ou `comidas[].pedir` geram aviso porque os favoritos guardam o texto de `es`: salvar uma marca as duas.

## Como um país aparece no site

1. Inclua `<script src="data/<código>.js"></script>` em `index.html`, depois do Uruguai. O primeiro script é o país padrão.
2. Inclua o arquivo em `NUCLEO`, no `sw.js`, e suba `VERSAO`, para funcionar sem internet.
3. O seletor no topo lista os países carregados. A escolha, os favoritos, o checklist, o quiz e o ranking do aparelho ficam guardados por país.
4. Se o primeiro idioma de `voz` for português (`pt-BR`), o app entende que não há tradução: `es` é como se fala no lugar e `pt` é o que quer dizer. Somem "Ouvir" e "Mostrar", "Pronúncia" vira "Jeito de falar" e a busca sugere gírias do lugar.
5. As abas de seções opcionais (`guia`, `historias`, `origem`, `futebol`, `quiz`, `conversas`, `checklist`/`etiqueta`) somem quando o país não as tem. O GuIA Turístico aparece só no Uruguai.

Ainda só do Uruguai, no backend:

- **Ranking online:** `supabase/ranking.sql` só aceita os níveis do Uruguai, então os outros países usam só o ranking do aparelho.
- **GuIA Turístico:** as instruções em `supabase/functions/guia/index.ts` falam como "um amigo uruguaio", por isso a aba some fora do Uruguai. Para liberar outro país, o texto precisa vir do país.
- **Fotos:** ficam em `img/guia/<id>.jpg` e `img/pessoas/<id>.jpg`, sem pasta por país, então os ids não podem se repetir entre países.
