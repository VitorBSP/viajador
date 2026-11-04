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

## Próximos passos

1. **Ideias:** confirmar o formato do verbete e quais abas existem no RS (sem Conversas e Preparar).
2. **Dados:** criar `data/rs.js` com campo `regioes` e um seletor de região, como o seletor de país.
3. **Conteúdo:** escrever primeiro a base comum e as regiões 1, 2 e 7 (mais visitadas), depois as outras.
4. **Validação:** conferir datas de festas, horários e nomes de lugar antes de publicar, como foi feito no Uruguai.
