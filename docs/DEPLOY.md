# Publicar o Viajador

Site estático (sem build). Recomendação: **GitHub Pages**.

## Comparativo

| | GitHub Pages | Netlify | Vercel | Cloudflare Pages |
|---|---|---|---|---|
| Grátis | sim (repo público) | sim | sim (uso pessoal) | sim, sem limite de banda |
| HTTPS | sim | sim | sim | sim |
| PWA / service worker | sim | sim | sim | sim |
| Domínio próprio | sim, grátis | sim | sim | sim |
| Cabeçalhos de cache | **não** (fixo, ~10 min) | sim (`_headers`) | sim (`vercel.json`) | sim (`_headers`) |
| Esforço | menor: só GitHub | conta extra | conta extra | conta extra |

**Por que GitHub Pages:** o código já vai para o GitHub, não exige outra conta, e o deploy é um workflow pronto. A limitação (sem cabeçalhos) não atrapalha: navegadores não usam o cache HTTP para o próprio `sw.js` (revalidam sempre), e o cache offline dos assets fica por conta do service worker. Se um dia precisar de controle de cabeçalhos, o arquivo `_headers` já está pronto para Cloudflare Pages/Netlify.

## Passo a passo (GitHub Pages)

1. **Crie o repositório** em github.com → *New repository* (ex.: `viajador`, público, sem README/.gitignore).
2. **Conecte e envie** (na pasta do projeto):
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/viajador.git
   git push -u origin main
   ```
   O workflow `.github/workflows/pages.yml` precisa estar em `main`; faça merge do branch de deploy antes.
3. **Ative o Pages:** repositório → *Settings* → *Pages* → *Build and deployment* → *Source*: **GitHub Actions**.
4. O workflow roda a cada push em `main` (ou manualmente em *Actions* → *Run workflow*). Ao terminar, o site fica em `https://SEU_USUARIO.github.io/viajador/`.
5. **Teste no celular:** abra a URL, confira o HTTPS, use "Instalar app"/"Adicionar à tela inicial" e teste o modo avião.

> O site funciona em subpasta (`/viajador/`) porque usa só caminhos relativos. Mantenha assim: `sw.js` e `manifest` devem usar `./` e escopo relativo, nunca `/`.

## Cache e atualizações

- O workflow publica apenas arquivos do site (`index.html`, `app.js`, `styles.css`, `sw.js`, manifest, `data/`, ícones). Se criar outros arquivos/pastas, adicione-os na etapa *Prepare site* do workflow.
- Ao mudar `app.js`, `styles.css` ou `data/`, **incremente a versão do cache em `sw.js`** (ex.: `viajador-v2`), senão usuários podem continuar vendo a versão antiga offline.
- Em Cloudflare/Netlify, `_headers` define `sw.js`, manifest e HTML como `no-cache` e `data/` com revalidação.

## Domínio próprio (opcional)

1. Registre o domínio (Registro.br, Namecheap, etc.).
2. No repositório: *Settings* → *Pages* → *Custom domain* → digite o domínio → *Save* (cria o arquivo `CNAME`; o workflow já o inclui se estiver na raiz).
3. No DNS:
   - domínio raiz (`exemplo.com`): registros **A** para `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   - subdomínio (`www`): registro **CNAME** para `SEU_USUARIO.github.io`.
   (Confira os IPs na documentação do GitHub Pages antes de configurar.)
4. Aguarde a propagação e marque **Enforce HTTPS**.
5. Com domínio na raiz, o site passa a viver em `/`; os caminhos relativos continuam válidos.

## Alternativa: Cloudflare Pages

*Workers & Pages* → *Create* → *Pages* → conectar o repositório → *Build command*: vazio, *Output directory*: `/` (raiz). O `_headers` é aplicado automaticamente (neste caso o workflow do GitHub não é necessário).
