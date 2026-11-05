-- Limite de uso do Guia IA. Rode uma vez no SQL Editor do Supabase.
-- Cada aparelho pode fazer até 30 perguntas por dia, e o app inteiro até 500,
-- para ninguém esgotar a cota gratuita do Gemini.

create table if not exists public.guia_uso (
  aparelho text not null,
  dia date not null default current_date,
  perguntas integer not null default 0,
  primary key (aparelho, dia)
);

-- Sem políticas: ninguém lê ou altera a tabela pelo site, só pela função abaixo.
alter table public.guia_uso enable row level security;

create or replace function public.guia_consumir(p_aparelho text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
  usado integer;
begin
  if p_aparelho is null or char_length(p_aparelho) not between 8 and 64 then
    return false;
  end if;
  select coalesce(sum(perguntas), 0) into total from guia_uso where dia = current_date;
  if total >= 500 then
    return false;
  end if;
  insert into guia_uso (aparelho, dia, perguntas) values (p_aparelho, current_date, 1)
  on conflict (aparelho, dia) do update set perguntas = guia_uso.perguntas + 1
  returning perguntas into usado;
  return usado <= 30;
end;
$$;

revoke all on function public.guia_consumir(text) from public;
grant execute on function public.guia_consumir(text) to anon;
