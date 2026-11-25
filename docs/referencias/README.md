# Referências Visuais — Viajador v2.0

Esta pasta concentra as referências aprovadas para a evolução visual do **Viajador** (`docs/APP_SPEC.md`).
*(A pasta `docs/` não é copiada para `_site/` no deploy do GitHub Pages, então estas referências não aumentam o peso do PWA em produção.)*

## Arquivos

| Arquivo | O que é | O que aproveitar | O que NÃO copiar |
|---|---|---|---|
| `prototipo-v2.html` | Protótipo interativo v2.0 (abra em `http://localhost:5510/docs/referencias/prototipo-v2.html`) | Estrutura das 5 abas SVG com botão central GuIA elevado, 3 propostas de símbolo (A/B/C), timeline do Roteiro, bottom sheet sobre hero, mosaico do Álbum, paleta papel `#F7F5EF` + claro/escuro | Dados resumidos de demo (no app real usar sempre `data/uy.js` e `data/rs.js`) |
| `ui-kit-tour-travel.png` | Preview do kit *Tour & Travel App UI* | **Timeline vertical** no Roteiro (ponto colorido + miniatura + `km`), **sheet branco arredondado sobre foto hero** nos detalhes de lugar, busca em pílula e 3 cards quadrados com ícone SVG circular | Placeholders cinzas e textos de reserva ("Book Now") |
| `ui-kit-woosh-booking.png` | Preview do kit *Woosh Mobile Travel Booking* | **Bottom bar limpa de 5 ícones SVG** com ícone central em destaque, **cards fotográficos** com badge + botão de ação sobre a foto, **mosaico fotográfico** na abertura do Álbum | Rosa choque de app de booking e tela de login obrigatória |
| `ui-kit-gotravel.png` | Preview do kit *GoTravel Mobile App* | Ritmo arejado, listas limpas com seleção clara (ótimo para o modo *"Do meu jeito"* do Roteiro e filtros por região) | Fluxo de cadastro/OTP e verde genérico |

## Diretriz principal para o agente

**Melhore o acabamento sem copiar cores genéricas dos kits.**
O Viajador precisa parecer um **produto editorial sério e autoral** (estilo passaporte / guia de bolso curado), preservando:
- Tipografia `Fraunces` (títulos) + `Inter` (UI e `tabular-nums`);
- Paleta quente papel creme (`#F7F5EF`) + azul passaporte (`#0F356B`) + ouro (`#E59A00`) + dark mode (`#0E131E`), com acento sutil por território;
- Zero emoji na barra de navegação e botões estruturais (usar SVGs inline traço `1.75px`).
