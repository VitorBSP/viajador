-- Ranking do Viajador. Rode uma vez no SQL Editor do Supabase.
-- A chave publicável fica no site: quem protege os dados são as regras abaixo.

create table if not exists public.ranking (
  id bigint generated always as identity primary key,
  nivel text not null check (nivel in ('turista', 'viajante', 'uruguaio', 'espanhol', 'lugares', 'futebol', 'extreme')),
  nome text not null check (char_length(btrim(nome)) between 1 and 20),
  pontos smallint not null check (pontos between 0 and 10),
  -- Menos de 10 segundos para 10 perguntas não é uma rodada de verdade.
  segundos integer not null check (segundos between 10 and 7200),
  criado timestamptz not null default now()
);

create index if not exists ranking_nivel_idx on public.ranking (nivel, pontos desc, segundos asc);

alter table public.ranking enable row level security;

-- Qualquer pessoa pode ler o ranking e enviar um resultado. Ninguém edita nem apaga pelo site.
drop policy if exists "ler ranking" on public.ranking;
create policy "ler ranking" on public.ranking for select to anon using (true);

drop policy if exists "enviar resultado" on public.ranking;
create policy "enviar resultado" on public.ranking for insert to anon with check (true);

grant select, insert on public.ranking to anon;
