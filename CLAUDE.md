# CLAUDE.md — Guia de Engenharia do Viajador

Você está trabalhando no **Viajador** (`https://vitorbsp.github.io/viajador/`), um PWA offline-first de bolso para brasileiros em viagem, parte do ecossistema **Duck AI Labs**.

## Regras inegociáveis

1. **Zero build e zero framework:** HTML + CSS + JS puro (`index.html`, `app.js`, `styles.css`, `sw.js`). Não adicione Vite, Webpack, React, Tailwind CDN em produção nem etapas de build.
2. **Offline-first real:** tudo do núcleo (frases, lugares, fotos, GPS, roteiro, álbum, conversor de moeda) precisa funcionar em modo avião.
3. **Nunca quebre dados nem estado salvo do usuário:**
   - Não altere o schema de `data/uy.js` e `data/rs.js` sem atualizar `scripts/validar.py` e manter retrocompatibilidade.
   - Preserve todas as chaves existentes de `localStorage` (`viajador:pais`, `viajador:favoritos:*`, `viajador:checklist:*`, `viajador:quiz:*`, `viajador:roteiro:*`, `viajador:quero:*`, `viajador:fui:*`, `viajador:moeda:*`, `viajador:aparelho`, `viajador:nome`).
   - O campo `es` das frases é a chave de favoritos — não altere textos de `es` sem motivo.
4. **Versão sincronizada sempre:** toda mudança publicável em `app.js`, `styles.css`, `index.html`, `sw.js`, `data/` ou `icons/` deve subir o número de versão **nos dois arquivos iguais** (ver `docs/VERSOES.md`):
   - `app.js`: `const VERSAO_APP = "1.XX";` (ou `"2.XX"` no marco v2)
   - `sw.js`: `const VERSAO = "viajador-1.XX";`
5. **Cache offline completo:** qualquer novo arquivo em `img/arte/`, `img/guia/`, `img/pessoas/` ou `icons/` deve entrar em `NUCLEO` ou `FOTOS` no `sw.js`.
6. **Tom de voz e multi-território:** leia `docs/TOM-DE-VOZ.md`. No RS (`semTraducao === true`), nunca mostre textos de espanhol, botão "Ouvir"/"Mostrar" de tradução ou "sílaba em MAIÚSCULA".
7. **Segurança:** nunca exponha chaves secretas (`service_role`, `GEMINI_API_KEY`) no frontend. A chave `VIAJADOR_SUPABASE` em `index.html` é estritamente a `publishable`.

## Documentos-chave para o redesign v2.0

- `docs/APP_SPEC.md` — especificação oficial de marca, paleta, tipografia, 5 pilares, componentes e camada futura `Duck AI PRO`.
- `docs/TOM-DE-VOZ.md` — regras de escrita, microtextos e destinos em português.
- `docs/VERSOES.md` — regra de versionamento `território.número`.
- `docs/referencias/README.md` — mapa dos 3 UI kits de referência e do `docs/referencias/prototipo-v2.html`.
- `docs/PROMPT-CLAUDE-V2.md` — roteiro de execução em ondas para o redesign v2.0.

## Comandos obrigatórios antes de concluir qualquer entrega

```bash
python3 scripts/validar.py
node --check app.js
node --check sw.js
```

O deploy no GitHub Pages (`.github/workflows/pages.yml`) roda `python3 scripts/validar.py` como gate e **rejeita** o deploy se houver qualquer erro de schema, versão dessincronizada ou imagem fora do `sw.js`.

Para pré-visualizar localmente (conforme `.claude/launch.json`):

```bash
python3 -m http.server 5510
```
