-- Execute este arquivo no SQL Editor do Supabase.
-- Ele cria a tabela de produtos, índices, atualização automática de atualizado_em e bucket de imagens.

create extension if not exists pgcrypto;

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  codigo_barras text not null,
  nome text not null,
  validade date not null,
  setor text,
  quantidade integer not null default 1 check (quantidade > 0),
  descricao text,
  foto_url text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz
);

create unique index if not exists produtos_codigo_validade_unique
on public.produtos (codigo_barras, validade);

create index if not exists produtos_validade_index
on public.produtos (validade);

create index if not exists produtos_nome_index
on public.produtos (nome);

create or replace function public.atualizar_data_atualizacao()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists produtos_atualizado_em_trigger on public.produtos;

create trigger produtos_atualizado_em_trigger
before update on public.produtos
for each row
execute function public.atualizar_data_atualizacao();

alter table public.produtos enable row level security;

-- MVP sem login: libera leitura e escrita usando a chave pública anon.
-- Para uso real com vários funcionários, troque essas políticas por autenticação.
drop policy if exists "Permitir leitura publica de produtos" on public.produtos;
drop policy if exists "Permitir cadastro publico de produtos" on public.produtos;
drop policy if exists "Permitir edicao publica de produtos" on public.produtos;
drop policy if exists "Permitir exclusao publica de produtos" on public.produtos;

create policy "Permitir leitura publica de produtos"
on public.produtos for select
to anon
using (true);

create policy "Permitir cadastro publico de produtos"
on public.produtos for insert
to anon
with check (true);

create policy "Permitir edicao publica de produtos"
on public.produtos for update
to anon
using (true)
with check (true);

create policy "Permitir exclusao publica de produtos"
on public.produtos for delete
to anon
using (true);

insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do update set public = excluded.public;

-- Políticas do Storage para o bucket de fotos dos produtos.
drop policy if exists "Permitir leitura publica de fotos" on storage.objects;
drop policy if exists "Permitir upload publico de fotos" on storage.objects;
drop policy if exists "Permitir edicao publica de fotos" on storage.objects;
drop policy if exists "Permitir exclusao publica de fotos" on storage.objects;

create policy "Permitir leitura publica de fotos"
on storage.objects for select
to anon
using (bucket_id = 'produtos');

create policy "Permitir upload publico de fotos"
on storage.objects for insert
to anon
with check (bucket_id = 'produtos');

create policy "Permitir edicao publica de fotos"
on storage.objects for update
to anon
using (bucket_id = 'produtos')
with check (bucket_id = 'produtos');

create policy "Permitir exclusao publica de fotos"
on storage.objects for delete
to anon
using (bucket_id = 'produtos');
