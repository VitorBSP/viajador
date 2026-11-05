# Viajador RS: plano de conteúdo

Rascunho para alinhar com a sessão de ideias. Nada aqui foi implementado ainda.

## Princípio

O viajante é brasileiro e fala português. O guia do RS não traduz frases: ele **decifra o gaúcho** e avisa do que é diferente do resto do Brasil (clima, comida, costumes, palavras).

## O que muda em relação ao Uruguai

| Seção do Uruguai | No RS |
|---|---|
| Situações com frases es/pt/pronúncia | **Sai.** Vira "Situações que pegam de surpresa": dica curta + palavras locais da situação |
| Conversas | **Sai** |
| Preparar | **Sai** |
| Pronúncia | **Sai** como regra; fica só como curiosidade (o "tu" com verbo na 3ª pessoa, o "bah", o "e" final aberto da Serra) |
| Falsos amigos | **Fica**, adaptado: palavras que existem no Brasil todo com outro sentido aqui |
| Gírias e expressões | **Fica**, é o centro do guia |
| Lugares, comidas, história, quiz, Perto de você | **Fica**, organizado pelas 8 regiões |

Formato sugerido de cada verbete: `palavra`, `significa`, `ex` (frase como o gaúcho fala), `regioes` (lista; pode repetir entre regiões), `dica?`.

## Base comum (vale para todas as regiões)

**Gírias e palavras:** bah, tchê, tri (tri legal), barbaridade, capaz! (= de jeito nenhum / imagina), guri / guria, piá (Norte e Planalto), bergamota (mexerica), cacetinho (pão francês), negrinho (brigadeiro), sinaleira (semáforo), lomba (ladeira), cusco (cachorro pequeno), pandorga (pipa), vianda (marmita), patente (vaso sanitário), bolicho (venda de interior), atucanado (apressado/estressado), faceiro (contente), tchê loco, de vereda (agora mesmo), mas bah, pila (real, dinheiro), chinelagem, gaudério, prenda / peão, xis (o sanduíche), cueca virada (doce frito).

**Situações que pegam de surpresa:**
- **Frio de verdade:** inverno com geada e temperaturas negativas na Serra e na Campanha; casas e hotéis nem sempre têm calefação. Minuano é o vento frio do sul.
- **Chimarrão em roda:** não se mexe na bomba, não se diz "obrigado" se quiser mais (obrigado = chega), devolve-se a cuia a quem serve.
- **"Tu" com verbo de "você":** "tu vai?", "tu quer?". Não é erro de ninguém, é o jeito daqui.
- **Churrasco gaúcho:** espeto, sal grosso, costela fogo de chão; pedir "ao ponto" é comum, "bem passado" causa reação.
- **CTG e tradição:** bombacha e vestido de prenda são roupa de festa e de uso diário no interior; o 20 de Setembro (Revolução Farroupilha) é feriado estadual com desfiles e acampamentos.
- **Futebol:** Grêmio x Inter divide famílias. Melhor perguntar do que chutar.

## Por região

| Região | Foco do guia | Palavras e situações específicas | Lugares e comidas |
|---|---|---|---|
| 1. Metropolitana e Vales | Capital, ônibus e lotação, pôr do sol | lotação (micro-ônibus), Trensurb, "brique", Redenção (Parque Farroupilha), xis no trailer da madrugada | Orla do Guaíba, Mercado Público, Brique da Redenção, Usina do Gasômetro; Novo Hamburgo e o polo calçadista |
| 2. Serra Gaúcha | Colonização italiana e alemã, frio, vinho | expressões do talian (ostia!, porca miséria, "na nona"), "colono", fondue, café colonial; neve rara e geada | Gramado (Natal Luz), Canela (Catedral de Pedra, Caracol), Bento (Vale dos Vinhedos, Maria Fumaça), Caxias (Festa da Uva); galeto al primo canto, sopa de capeletti, cuca |
| 3. Campanha e Fronteira Oeste | Pampa, peão, fronteira seca | palavras do espanhol na fala (bolicho, guaipeca, china, "y bueno"), compras em free shop, campeiro, tropeiro | Santana do Livramento / Rivera (fronteira seca, praça internacional), Bagé, Alegrete, Uruguaiana; carreteiro, assado de chão |
| 4. Missões | Ruínas jesuítico-guaranis | redução, Sepé Tiaraju ("esta terra tem dono"), guarani nos nomes de lugar | São Miguel das Missões (Patrimônio da Humanidade, espetáculo de som e luz), Santo Ângelo, São Borja |
| 5. Planalto Médio e Norte | Agro, cooperativas, sotaque do norte | piá, "pinhão", erva-mate cancheada, cooperativa, Expodireto | Passo Fundo (capital nacional da literatura), Erechim, Cruz Alta; pinhão na chapa, churrasco de agro |
| 6. Região Central | Cidade universitária e militar | "ralar" da UFSM, quartel, Quarta Colônia (talian de novo) | Santa Maria (Quarta Colônia, sítios paleontológicos), Cachoeira do Sul |
| 7. Litoral Norte | Veraneio gaúcho | veranear, "a praia" (= o litoral inteiro), vento nordestão, água fria e escura do mar daqui, guarda-vidas | Torres (Guarita, rios), Capão da Canoa, Tramandaí (pesca com botos), Osório (parque eólico); pastel de praia, sorvete de máquina |
| 8. Litoral Sul e Zona Sul | Lagoas, porto, doces | "doceria", Laranjal (praia da lagoa), Cassino (praia mais longa do mundo, carro na areia) | Pelotas (doces portugueses, casarões), Rio Grande (porto, Cassino), São Lourenço do Sul; quindim, pastel de Santa Clara, ninho |

## Feito: `data/rs.js`

Escrito no schema atual, sem mudar o código, e validado (`python scripts/validar.py data/rs.js`: 0 erros). Testado com o seletor de país de `claude/abas-navegacao`: o RS aparece no seletor e as abas sem conteúdo somem.

| Seção | Conteúdo |
|---|---|
| `situacoes` | 6 situações e 33 frases: padaria, churrasco, chimarrão, frio, rua, CTG. `es` = como o gaúcho fala; `pt` = o que quer dizer |
| `girias` | 33, com `regioes` quando a palavra é de uma região só |
| `ditados` | 8 expressões |
| `falsosAmigos` | 13 palavras que mudam de sentido no RS (torrada, capaz, gringo, patente…) |
| `pronuncia` | 5 curiosidades do jeito de falar, não regras |
| `comidas` | 12 |
| `lugares` | As 8 regiões, com 26 pontos e uma frase útil em cada |
| `conversas`, `checklist`, `etiqueta`, `guia`, `historias`, `quiz` | Ficaram de fora de propósito |

Fatos que mudam com o tempo (horário do Som e Luz, da Maria Fumaça, do Mercado Público, cota do free shop) estão sem número e pedem para confirmar na hora.

## Falta (outras sessões)

1. **Frontend:** incluir `data/rs.js` em `index.html` e em `NUCLEO` do `sw.js`.
2. **Frontend:** na tela inicial do RS aparecem a bandeira do Uruguai e a faixa "Frases rápidas" vazia (os atalhos procuram "baño"). Os rótulos também estão em modo espanhol: "Pronúncia sem sufoco", "Ouvir" e "Mostrar".
3. **Frontend:** mostrar `regioes` nas gírias e, se fizer sentido, um filtro por região. Hoje o campo é ignorado (o validador avisa).
4. **Dados:** aceitar `regioes` e `artigo` no validador. Decidir se `pr` deve ser opcional em país de língua portuguesa e se o código `rs` serve, já que é o código ISO da Sérvia.
5. **Backend:** o GuIA Turístico aparece no RS, mas responde como "amigo uruguaio"; esconder ou adaptar.
6. **Conteúdo, depois:** quiz e história do RS (Farroupilha, Missões, imigração), e o guia "Perto de você" com coordenadas.
