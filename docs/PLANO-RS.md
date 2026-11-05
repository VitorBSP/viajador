# Viajador RS e destinos em português

## Princípio

O viajante é brasileiro e já fala a língua. Num destino em português (o RS, outras regiões do Brasil e, no futuro, outros lugares lusófonos), o guia **não ensina a se comunicar**. O foco é **turismo: lugares, paisagens e história**. As palavras e ditados locais entram como curiosidade, explicados para quem é de longe.

| | Destino em outra língua (Uruguai) | Destino em português (RS) |
|---|---|---|
| Foco | Comunicar no dia a dia | Turismo, paisagens, lugares, história |
| Frases | Para falar, com tradução e pronúncia | Não há: só palavras locais explicadas |
| Pronúncia | Sim | Não (`pronuncia: []`, aba oculta) |
| Conversas e Preparar | Sim | Não |
| Perto de você e História | Sim | Sim, são o centro |
| Gírias, ditados, falsos amigos | Sim | Sim, para entender o que se ouve |

Um destino é tratado como "em português" quando `voz[0]` começa com `pt`. O app e o validador usam essa mesma regra.

## Formato no RS

| Seção | Uso no RS |
|---|---|
| `situacoes` | **Palavras do dia a dia** por tema (comida, chimarrão, rua, clima, tradição): `es` = a palavra, `pt` = o que quer dizer, `dica` = o contexto. Sem `pr` |
| `girias` | Gírias e interjeições, com `regioes` quando são de uma região só |
| `ditados`, `falsosAmigos` | Expressões e palavras que mudam de sentido no RS |
| `lugares` | As 8 regiões. Cada lugar tem dica de visita e **uma palavra local** em `frases` |
| `guia` | 13 lugares com coordenadas, história e fontes, em 6 regiões |
| `historias` | História do estado: momentos, costumes, personagens, artistas e datas |
| `comidas` | 9 pratos e doces |

Fontes: Wikipédia em português (fatos e datas) e Wikidata (coordenadas), conferidas em novembro de 2026. Fatos que mudam com o tempo (horário do Som e Luz e da Maria Fumaça, cota do free shop) não têm números e pedem para confirmar na hora.

## Feito em código (pequeno, para o RS funcionar)

- `scripts/validar.py`: com `voz` em português, `pr` e `pronuncia` passam a ser opcionais.
- `app.js`: a aba Pronúncia some quando `pronuncia` está vazia.

## Combinado com a sessão de ideias

A seção 6 de `docs/IDEIAS.md` (branch `claude/ideias-roadmap-93e9a5`) propõe um schema novo antes de publicar: id `br-rs`, campo `tipo` (país ou região), rótulos vindos do dado e `recursos` por coleção. Enquanto isso não existir, `data/rs.js` continua com `codigo: "rs"`.

## Falta

1. ~~**Frontend:** abrir na aba de turismo e trocar os textos de comunicação.~~ Feito no commit `9646301` (`claude/abas-navegacao`): o RS abre em Perto de você, "Situações" virou "Palavras" e os textos foram trocados.
2. **Conteúdo:** pontos de "Perto de você" em Campanha, Planalto e Região Central. Até lá, o filtro de regiões do guia esconde as três. Falta também um quiz do RS.
3. **Conteúdo:** revisão das gírias e expressões por alguém gaúcho; elas vêm de conhecimento geral, sem fonte.
