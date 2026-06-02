# Controle de Validade

Sistema PWA para controle de validade de produtos em supermercado, desenvolvido como projeto de uso real e estudo prático de desenvolvimento frontend com React.

## Visão geral

O **Controle de Validade** é uma aplicação web progressiva criada para auxiliar na conferência de produtos próximos do vencimento. A proposta surgiu a partir de uma necessidade real observada no ambiente de trabalho: a ausência de uma ferramenta simples para registrar produtos, acompanhar datas de validade e evitar perdas por vencimento.

O projeto foi pensado inicialmente para uso pessoal dentro de um supermercado, mas estruturado de forma profissional para ser apresentado como case de portfólio para oportunidades na área de desenvolvimento de software.

## Problema identificado

Em supermercados, produtos podem vencer sem que a equipe perceba a tempo, principalmente quando o controle é feito manualmente ou não existe uma rotina digital de acompanhamento.

Isso pode gerar:

- perda financeira para a loja;
- descarte de produtos;
- risco de exposição de produtos vencidos;
- falta de visibilidade sobre itens próximos do vencimento;
- dificuldade para priorizar conferências por setor.

## Solução proposta

A aplicação permite cadastrar produtos com código de barras, nome, setor, quantidade e data de validade. Com esses dados, o sistema calcula automaticamente o status de cada item e exibe alertas visuais para produtos vencidos ou próximos do vencimento.

A solução foi construída como **PWA**, permitindo uso direto pelo navegador do celular, com aparência de aplicativo e armazenamento local dos dados.

## Funcionalidades

- Cadastro de produtos por código de barras ou cadastro manual.
- Registro de nome, validade, setor, quantidade e descrição opcional.
- Dashboard com resumo dos produtos por status.
- Lista de produtos cadastrados.
- Busca por nome, código de barras ou setor.
- Ordenação visual por data de validade.
- Identificação automática de produtos:
  - vencidos;
  - vencendo hoje;
  - próximos do vencimento;
  - seguros.
- Bloqueio de cadastro duplicado para o mesmo código de barras e mesma validade.
- Armazenamento local usando IndexedDB.
- Interface mobile-first com design minimalista.
- Estrutura preparada para futura evolução com backend e aplicativo Android.

## Regra de duplicidade

O sistema não permite cadastrar o mesmo produto com a mesma data de validade mais de uma vez.

A validação considera:

```txt
código de barras + data de validade
```

Se já existir um produto com esses dados, o sistema exibe a mensagem:

```txt
Esse produto já foi cadastrado com essa data de validade.
```

Nesse caso, o produto não é salvo.

## Status dos produtos

A aplicação calcula os dias restantes até a validade e classifica cada produto da seguinte forma:

| Status | Regra |
|---|---|
| Vencido | Data de validade anterior ao dia atual |
| Vence hoje | Data de validade igual ao dia atual |
| Próximo do vencimento | Produto vence em até 7 dias |
| Seguro | Produto vence em mais de 7 dias |

## Fluxo de uso

```txt
Usuário abre o PWA
↓
Escaneia ou informa o código do produto
↓
Preenche nome, validade, setor e quantidade
↓
Sistema verifica se já existe produto com a mesma validade
↓
Se não existir, o produto é salvo
↓
Dashboard e lista são atualizados automaticamente
↓
Usuário acompanha vencidos e próximos do vencimento
```

## Tecnologias utilizadas

- **React** — construção da interface.
- **Vite** — ambiente de desenvolvimento e build.
- **JavaScript** — linguagem principal do projeto.
- **CSS modularizado** — organização visual por responsabilidade.
- **IndexedDB** — armazenamento local dos produtos.
- **idb** — biblioteca para simplificar o uso do IndexedDB.
- **html5-qrcode** — leitura de código de barras e QR Code pela câmera.
- **vite-plugin-pwa** — configuração de PWA.
- **GitHub Pages** — hospedagem da aplicação.
- **GitHub Actions** — deploy automático.

## Estrutura do projeto

```txt
validade-pwa/
├── public/
│   └── icons/
│       ├── icon-192.svg
│       └── icon-512.svg
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductList.jsx
│   │   └── Scanner.jsx
│   │
│   ├── service/
│   │   └── db.js
│   │
│   ├── styles/
│   │   ├── base.css
│   │   ├── buttons.css
│   │   ├── dashboard.css
│   │   ├── form.css
│   │   ├── layout.css
│   │   ├── product-list.css
│   │   └── scanner.css
│   │
│   ├── utils/
│   │   └── validade.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── vite.config.js
└── package.json
```

## Decisões técnicas

### PWA em vez de aplicativo nativo

A primeira versão foi construída como PWA para permitir desenvolvimento mais rápido, menor custo inicial e uso direto no navegador do celular. Isso facilita a validação da ideia antes de investir em um aplicativo Android nativo.

### IndexedDB para armazenamento local

Como a versão inicial não possui backend, os dados são salvos localmente no navegador. O IndexedDB foi escolhido por ser mais adequado que `localStorage` para armazenar listas de produtos e permitir evolução futura.

### Design minimalista

A interface foi desenhada para uso prático no ambiente de loja. Por isso, o visual evita excesso de cores e prioriza leitura rápida, cards simples e destaques apenas nos status de validade.

## Como executar localmente

Entre na pasta do projeto:

```bash
cd validade-pwa
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm run dev
```

Gere o build de produção:

```bash
npm run build
```

Visualize o build:

```bash
npm run preview
```

## Deploy

O projeto está configurado para deploy no GitHub Pages usando GitHub Actions.

URL esperada da aplicação:

```txt
https://wallace-d3v.github.io/Controle-de-validade/
```

## Melhorias futuras

- Login para funcionários e administradores.
- Sincronização em nuvem com backend Node.js.
- Banco de dados PostgreSQL ou MySQL.
- Relatórios por setor.
- Exportação em CSV ou PDF.
- Notificações de produtos próximos do vencimento.
- Histórico de baixas e remoções.
- Controle por múltiplos dispositivos.
- Versão Android nativa em Kotlin.
- Uso de Room Database no app Android.
- Leitura de código de barras com ML Kit no Android.

## Objetivo profissional

Este projeto demonstra capacidade de identificar um problema real, transformar essa necessidade em uma solução digital funcional e estruturar uma aplicação com tecnologias modernas.

Ele também mostra competências importantes para uma vaga de desenvolvimento, como:

- análise de problema real;
- modelagem de fluxo de uso;
- desenvolvimento frontend com React;
- uso de armazenamento local;
- organização de componentes;
- deploy com GitHub Pages;
- versionamento com GitHub;
- atenção à experiência do usuário;
- planejamento de evolução técnica.

## Autor

Desenvolvido por **Wallace** como projeto de portfólio e solução prática para controle de validade em supermercado.
