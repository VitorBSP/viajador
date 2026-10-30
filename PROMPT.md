# Viajador — prompt do projeto (versão melhorada)

## Visão
Um guia de bolso de espanhol **para brasileiros em viagem**, começando pelo **Uruguai** (Montevidéu e Punta del Este) e preparado para crescer para outros países (Argentina, Chile, etc.).
Não é um curso: é uma **consulta rápida** para usar *no momento* — na fila do restaurante, na rua, na praia — com uma mão só no celular.

## Público
- Brasileiro, fala português, espanhol básico ou nenhum.
- Objetivos: **turistar, comer, pedir informações, ir ao banheiro, pedir foto, comprar, se locomover, resolver emergências**.

## Princípios
1. **Achar em até 3 toques ou 1 busca.** Situação → frase → falar.
2. **Pronúncia escrita "do jeito brasileiro"**, com a sílaba tônica em MAIÚSCULA (ex.: *¿Dónde está el baño?* → `DON-de es-TÁ el BA-nho`).
3. **Espanhol rioplatense de verdade**: voseo (*vos tenés*), "ll/y" com som de "ch" (*calle* → `KA-she`), o famoso **"Ta"**.
4. **Ouvir a frase** (voz do navegador em espanhol) e **"Mostrar"** a frase em tela cheia, letras grandes, para a pessoa ler.
5. **Funciona offline** e salva **favoritos** no aparelho.
6. **Simples e bonito**: mobile-first, cores do Uruguai (sol dourado, celeste, branco), modo escuro.

## Conteúdo (por país)
- **Situações**: Básico, Comer & beber, Direções, Banheiro, Fotos, Compras & pagamento, Transporte, Hospedagem, Praia, Emergência, Números.
  Cada frase: espanhol · português · pronúncia · (opcional) dica cultural.
- **Gírias típicas** (ex.: *ta, bo, bárbaro, de más, salado, bondi, botija, pila*).
- **Ditados e expressões** com significado e quando usar.
- **Falsos amigos** que pegam brasileiro (*exquisito, embarazada, propina, oficina, coger, concha…*).
- **Guia de pronúncia**: as 6–8 regras que mais fazem diferença para quem fala português.
- **Lugares**: dicas e frases específicas para pontos de Montevidéu (Ciudad Vieja, Mercado del Puerto, Rambla, Teatro Solís, Feria de Tristán Narvaja, Estadio Centenario, Pocitos) e Punta del Este (La Mano/Playa Brava, Puerto, Casapueblo, Isla Gorriti, La Barra/José Ignacio, Playa Mansa).
- **Comidas típicas**: chivito, asado/parrillada, medio y medio, fainá, torta frita, chajá, alfajor, dulce de leche, mate.

## Arquitetura
- Site estático (HTML + CSS + JS puro), sem build, abre até direto do arquivo.
- Conteúdo separado por país em `data/<código>.js` (ex.: `data/uy.js`) registrando em `window.VIAJADOR.paises` — adicionar um país = adicionar um arquivo.
- Futuro: PWA (service worker) para offline total, deploy em hospedagem estática gratuita (GitHub Pages / Netlify / Vercel), e um backend opcional só se houver necessidade real (ex.: sugestões de usuários, áudios gravados por nativos).

## Frentes de trabalho (sessões)
- **Frontend**: UX, PWA/offline, acessibilidade, modo "mostrar", performance.
- **Backend/dados**: esquema de conteúdo, validação, estrutura multi-país, (opcional) API.
- **Storytelling**: tom de voz, microtextos, revisão do conteúdo e das dicas culturais.
- **Ideias**: roadmap de funcionalidades e próximos países.
- **Deploy**: hospedagem, domínio, PWA instalável, pipeline.
