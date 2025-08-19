# Cash Wise API

Esta é uma API RESTful para gerenciamento financeiro pessoal, incluindo funcionalidades para categorias, transações, orçamentos, metas e relatórios. Desenvolvida em Node.js com Prisma ORM e autenticação via Clerk.

## Sumário
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Endpoints](#endpoints)
- [Autenticação](#autenticação)
- [Migrations e Banco de Dados](#migrations-e-banco-de-dados)
- [Licença](#licença)

## Tecnologias Utilizadas
- Node.js
- Express
- Prisma ORM
- Clerk (autenticação)
- Docker (opcional)
- PostgreSQL

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd api-cash-wise-old
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com as variáveis de ambiente necessárias (exemplo abaixo).

## Configuração

Exemplo de `.env`:
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/cashwise
CLERK_SECRET_KEY=...
PORT=3000
```

## Execução

- Para rodar localmente:
  ```bash
  npm start
  ```
- Para rodar com Docker:
  ```bash
  docker-compose up
  ```

## Estrutura de Pastas
```
prisma/           # Schema e migrations do banco
src/
  config/         # Configurações de ambiente
  controllers/    # Lógica dos endpoints
  libs/           # Instância do Prisma
  middleware/     # Middlewares de autenticação
  repositories/   # Acesso ao banco de dados
  routes/         # Rotas da API
  services/       # Regras de negócio
  utils/          # Utilitários
```

## Endpoints

### Categorias
- `GET /categories` — Lista categorias
- `POST /categories` — Cria categoria
- `PUT /categories/:id` — Atualiza categoria
- `DELETE /categories/:id` — Remove categoria

### Transações
- `GET /transactions` — Lista transações
- `POST /transactions` — Cria transação
- `PUT /transactions/:id` — Atualiza transação
- `DELETE /transactions/:id` — Remove transação

### Orçamentos
- `GET /budgets` — Lista orçamentos
- `POST /budgets` — Cria orçamento
- `PUT /budgets/:id` — Atualiza orçamento
- `DELETE /budgets/:id` — Remove orçamento

### Metas
- `GET /goals` — Lista metas
- `POST /goals` — Cria meta
- `PUT /goals/:id` — Atualiza meta
- `DELETE /goals/:id` — Remove meta

### Relatórios
- `GET /reports` — Gera relatório financeiro

## Autenticação
A autenticação é feita via Clerk. Adicione o token JWT no header `Authorization`:
```
Authorization: Bearer <token>
```

## Migrations e Banco de Dados
- O schema do banco está em `prisma/schema.prisma`.
- Para rodar migrations:
  ```bash
  npx prisma migrate dev
  ```
- Para acessar o Prisma Studio:
  ```bash
  npx prisma studio
  ```

## Licença
MIT

---

> Para dúvidas ou sugestões, abra uma issue ou entre em contato com o mantenedor.
