# Guia por localização: de 20 para 50 pontos

Hoje são 30 pontos: 21 em Montevidéu e 9 em Punta del Este e arredores. Todos usam um lugar que já existe em `lugares` em `data/uy.js`.

## O que precisa mudar antes de crescer

| Mudança | Por quê | Quando |
|---|---|---|
| Novas regiões em `cidades` e `lugares` (Maldonado, Piriápolis) | Hoje a tela só separa Montevidéu e Punta | Na onda 3 |
| Separar as histórias em `data/uy-guia.js` | `data/uy.js` já é o maior arquivo do app; 50 histórias pesam mais. Exige ajuste em `index.html`, `sw.js`, no validador e no formato | Na onda 2 |
| Busca nas histórias | Hoje a busca só encontra frases | Na onda 2 |
| Data de revisão em cada ponto | Horários, reformas e acesso mudam | Na onda 2 |

## Regras de conteúdo

- **Ler as fontes inteiras.** A revisão dos 20 primeiros pontos corrigiu 17 histórias que tinham sido escritas a partir de resumos de busca. Escreva só depois de ler.
- **Priorizar fontes primárias:** governo, museu e prefeitura. Wikipédia e blogs entram só como apoio.
- **Quando as fontes divergirem, dizer isso no texto**, em vez de escolher uma versão em silêncio.
- **Conferir cada coordenada no mapa.** O museu do Carnaval e o porto de Punta foram estimados manualmente, porque a busca no OpenStreetMap não os encontrou.
- **Cada novo ponto precisa de pelo menos uma frase específica do lugar** em `lugares`. Sem isso o validador recusa.
- **Nada de preço ou horário dentro da história.** Isso fica em `dica`, com "confirme antes".

## Candidatos (30)

Lista inicial, escrita de memória. Cada item ainda precisa de confirmação: existência atual, acesso ao público e fontes.

### Onda 1: Montevidéu (10), concluída

1. Plaza Matriz e Cabildo
2. Puerta de la Ciudadela (hoje está dentro de Ciudad Vieja; vale ponto próprio)
3. Museo Torres García
4. Museo de Arte Precolombino e Indígena (MAPI)
5. Café Brasilero
6. Palacio Legislativo
7. Monumento La Carreta (Parque Batlle)
8. Parque Rodó
9. Faro de Punta Brava (bairro de Punta Carretas)
10. Fortaleza General Artigas (Cerro de Montevideo)

### Onda 2: Punta del Este e arredores (10)

11. Faro de Punta del Este
12. Iglesia de la Candelaria
13. Isla de Lobos (vista de barco; desembarque restrito)
14. Museo Ralli
15. Mirador de Punta Ballena
16. Faro de José Ignacio
17. Puente de la Laguna Garzón
18. Fundación Atchugarry (MACA)
19. Museo del Mar (La Barra)
20. Laguna del Sauce

### Onda 3: regiões novas e Montevidéu menos óbvia (10)

21. Maldonado: Cuartel de Dragones
22. Maldonado: Catedral de San Fernando
23. Piriápolis: Castillo de Piria
24. Piriápolis: Rambla e Argentino Hotel
25. Piriápolis: Cerro Pan de Azúcar
26. Montevidéu: Barrio Sur e Palermo (candombe)
27. Montevidéu: Museo Nacional de Artes Visuales
28. Montevidéu: Museo Gurvich
29. Montevidéu: Hotel Carrasco (Sofitel)
30. Garzón: Bodega Garzón

## Ordem de trabalho

1. **Revisão dos 20 primeiros e Onda 1 (30 pontos), com filtro e "Ver todos":** concluídas. Falta o teste no celular real.
2. **Onda 2**, separando os dados (40 pontos).
3. **Onda 3**, com as novas regiões (50 pontos).

Critério de cada onda: validador limpo, nenhum fato sem fonte, teste em tela de celular e publicação.
