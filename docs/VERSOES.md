# Versões do Viajador

A versão tem o formato **`território.número`**, como `1.28`.

| Primeiro número | Território |
|---|---|
| `0` | Uruguai (tudo até a chegada do RS) |
| `1` | Rio Grande do Sul |
| `2`, `3`… | Cada novo território |

- **O primeiro número sobe quando entra um território novo** e fica nele até o próximo chegar. Um ajuste no Uruguai depois disso também usa o número atual, porque a versão é do app inteiro.
- **O segundo número só cresce**, a cada publicação, e não volta a zero ao trocar de território. Ele dá nome ao cache offline: se repetir um número já usado, aparelhos podem ficar com arquivos velhos.
- A versão de antes desta regra era a 27, com os ajustes do Uruguai (0.1 a 0.24, na nova contagem) e a chegada do RS (25 a 27). A primeira com a regra nova é a **1.28**, com o roteiro e os 52 pontos do RS.

## Onde mudar

A cada publicação, suba o número nos dois lugares, sempre iguais:

- `app.js`: `VERSAO_APP` (aparece no rodapé, "Viajador · versão 1.28")
- `sw.js`: `VERSAO` (nome do cache, `viajador-1.28`)
