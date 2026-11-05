# Ranking online com Supabase (plano gratuito)

1. Em [supabase.com](https://supabase.com), crie uma conta e um projeto no plano **Free**, sem cadastrar cartão.
2. Abra **SQL Editor**, cole o conteúdo de `supabase/ranking.sql` e clique em **Run**.
3. Em **Project Settings > API Keys**, copie a **Project URL** e a chave **publishable**.
4. Preencha `window.VIAJADOR_SUPABASE` em `index.html` com esses dois valores e suba a versão em `sw.js`.

**Nunca use a chave secreta (secret ou service_role) no site.** Ela ignora as regras de segurança.

## Como fica o plano gratuito

- O projeto pausa depois de uma semana com pouca atividade. Os dados continuam lá, e dá para reativar no painel. Enquanto estiver pausado, o app mostra o ranking do aparelho.
- O limite do plano é de 500 MB por projeto, muito mais do que um ranking precisa.

## Moderação e limites

- Para apagar um nome ofensivo: **Table Editor > ranking**, selecione a linha e apague.
- O banco recusa rodadas com menos de 10 segundos, pontuação fora de 0 a 10 e nomes com mais de 20 letras.
- Isso não impede toda trapaça. Quem conhece a API ainda pode enviar um resultado falso.
