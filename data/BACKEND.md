# Backend: quando vale a pena

**Recomendação: não ter backend agora.** O conteúdo muda pouco, é revisado à mão e cabe em arquivos estáticos. Isso mantém o site gratuito, rápido e funcionando offline, que é um dos princípios do projeto.

## O que dá para fazer sem servidor

| Necessidade | Solução sem backend |
|---|---|
| Sugestões de usuários | Link para um formulário externo (Google Forms, Tally). As sugestões entram no `data/<código>.js` depois de revisadas. |
| Áudios de nativos | Arquivos `.mp3` ou `.opus` no próprio site, com um campo novo na frase. Um servidor só ajudaria a receber as gravações, não a tocá-las. |
| Favoritos | Continuam no aparelho (`localStorage`). |
| Métricas de uso | Contador de visitas da hospedagem ou analytics sem cookies. |

## Quando reconsiderar

Vale a pena quando um destes sinais aparecer de verdade:

- **Sugestões:** o volume torna a revisão pelo formulário inviável, ou você quer mostrar o status de cada sugestão no próprio site.
- **Áudios:** nativos vão enviar gravações pelo site, sem passar por você.
- **Contas:** usuários pedem favoritos sincronizados entre aparelhos. Esse é o único caso que exige login.
- **Edição:** pessoas que não usam Git passam a editar o conteúdo com frequência.

## Opção barata, se chegar a hora

**Primeira escolha: Cloudflare (Workers + D1 + R2).** Combina com um site estático, o R2 não cobra pela saída de dados, o que ajuda com áudio, e dá para começar só com um endpoint de sugestões.

**Alternativa: Supabase.** É melhor se contas e login forem o motivo principal, porque já traz autenticação e Postgres. No plano gratuito, projetos inativos podem ser pausados.

Confirme os limites e preços atuais antes de decidir, porque eles mudam.

Em qualquer das opções, o site deve continuar lendo o conteúdo dos arquivos estáticos. O backend só recebe contribuições, e o que for aprovado vira conteúdo publicado. Assim, o guia continua funcionando offline e mesmo se o servidor cair.

## O que NÃO fazer agora

- Mover as frases para um banco de dados ou criar uma API de conteúdo: quebra o offline e não resolve nenhum problema atual.
- Criar login ou contas: exige proteger dados pessoais (LGPD) sem que ninguém tenha pedido a função.
- Publicar sugestões ou áudios sem revisão: uma frase errada ou ofensiva prejudica quem a usa na rua.
- Coletar gravações de voz sem consentimento por escrito: voz é dado pessoal e precisa de autorização de uso.
- Adotar build, framework ou painel administrativo por causa de um backend que ainda não existe.
