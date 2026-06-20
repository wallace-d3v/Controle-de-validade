# Configuração do Supabase

Este projeto pode funcionar de duas formas:

1. Sem Supabase: usa IndexedDB local no navegador.
2. Com Supabase: usa PostgreSQL para produtos e Supabase Storage para fotos.

## 1. Criar projeto no Supabase

Crie um projeto novo no Supabase e copie:

- Project URL
- anon public key

Esses dados ficam em:

```txt
Project Settings > API
```

## 2. Criar tabela e bucket

Abra o SQL Editor do Supabase e execute o arquivo:

```txt
supabase/schema.sql
```

Esse script cria:

- tabela `produtos`
- índices
- regra de duplicidade por `codigo_barras + validade`
- bucket público `produtos`
- políticas de leitura e escrita para o MVP

## 3. Configurar variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `validade-pwa`:

```txt
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Use o arquivo `.env.example` como base.

## 4. Rodar o projeto

```bash
npm install
npm run dev
```

## Observação importante de segurança

As políticas do arquivo `schema.sql` liberam leitura e escrita para `anon`, porque o app ainda não tem login.

Isso serve para o MVP, mas não é o ideal para produção com vários funcionários.

Quando o projeto tiver autenticação, troque as políticas por regras baseadas no usuário logado.
