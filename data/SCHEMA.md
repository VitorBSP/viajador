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
| `conversas`, `etiqueta`, `checklist`, `guia` | lista | Opcionais. |

## Itens de cada lista

Na coluna "Opcionais", o campo pode faltar, mas não pode estar vazio. Nos demais, nenhum texto pode ser vazio.

| Lista | Obrigatórios | Opcionais | Único no país |
|---|---|---|---|
| `situacoes[]` | `id`, `icone`, `titulo`, `frases` | | `id` |
| `girias[]` | `es`, `pt`, `pr` | `ex`, `dica` | `es` |
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

## Falta para o segundo país aparecer no site

O formato já aceita vários países, mas o frontend ainda não:

- `index.html` carrega só `data/uy.js`.
- `app.js` fixa `window.VIAJADOR.paises.uy` e não tem seletor de país.
- `app.js` traz textos do Uruguai, como "Gírias uruguaias" e o idioma de reserva `es-UY`.
- A chave `viajador:favoritos` é uma só para todos os países.
