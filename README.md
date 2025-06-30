# CashWise API

Uma API REST robusta para gerenciamento financeiro pessoal, construída com Node.js, Fastify e PostgreSQL. A API oferece funcionalidades completas para controle de transações, categorias, orçamentos, metas financeiras e relatórios detalhados.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** (>=20) - Runtime JavaScript
- **Fastify** - Framework web de alta performance
- **Prisma** - ORM moderno para TypeScript e Node.js
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de esquemas TypeScript-first

### Autenticação e Segurança
- **Clerk** - Plataforma de autenticação completa
- **CORS** - Controle de acesso entre origens

### Utilitários
- **date-fns** - Biblioteca moderna para manipulação de datas
- **uuid** - Geração de identificadores únicos
- **http-status-codes** - Códigos de status HTTP padronizados
- **dotenv** - Gerenciamento de variáveis de ambiente

### Desenvolvimento
- **Nodemon** - Reinicialização automática do servidor
- **ESLint** - Linting de código JavaScript
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
api-cash-wise/
├── prisma/
│   ├── migrations/          # Migrações do banco de dados
│   └── schema.prisma        # Schema do Prisma
├── src/
│   ├── config/
│   │   ├── envs.js         # Configurações de ambiente
│   │   └── swagger.js      # Configuração do Swagger
│   ├── controllers/        # Controladores das rotas
│   │   ├── budget.controller.js
│   │   ├── category.controller.js
│   │   ├── goal.controller.js
│   │   ├── report.controller.js
│   │   └── transaction.controller.js
│   ├── libs/
│   │   └── prisma.js       # Cliente Prisma
│   ├── middleware/
│   │   └── clerkAuth.js    # Middleware de autenticação
│   ├── plugins/
│   │   ├── userId.js       # Plugin para extrair userId
│   │   └── zodValidate.js  # Plugin de validação Zod
│   ├── repositories/       # Camada de acesso aos dados
│   │   ├── budget.repository.js
│   │   ├── category.repository.js
│   │   ├── goal.repository.js
│   │   └── transaction.repository.js
│   ├── routes/            # Definição das rotas
│   │   ├── budget.route.js
│   │   ├── category.route.js
│   │   ├── goal.route.js
│   │   ├── report.route.js
│   │   ├── transaction.route.js
│   │   └── index.js
│   ├── schemas/           # Esquemas de validação Zod
│   │   ├── budget.schema.js
│   │   ├── category.schema.js
│   │   ├── goal.schema.js
│   │   ├── report.schema.js
│   │   └── transaction.schema.js
│   ├── services/          # Lógica de negócio
│   │   ├── budget.service.js
│   │   ├── category.service.js
│   │   ├── goal.service.js
│   │   ├── report.service.js
│   │   └── transaction.service.js
│   └── utils/             # Utilitários
│       ├── error.js
│       ├── getUserId.js
│       └── zodValidate.js
├── docker-compose.yml     # Configuração Docker
├── server.js             # Ponto de entrada da aplicação
└── package.json
```

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js >= 20
- Docker e Docker Compose
- Conta no Clerk para autenticação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd api-cash-wise
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
# Database
DATABASE_URL="postgresql://shinodalabs:shinodalabs@localhost:5432/cashwise"

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Server
PORT=8080
NODE_ENV=development
```

### 4. Inicie o banco de dados
```bash
npm run docker-up
```

### 5. Execute as migrações
```bash
npm run prisma:migrate
```

### 6. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📊 Modelos de Dados

### Category (Categoria)
```typescript
{
  id: string
  userId: string
  name: string
  type: "INCOME" | "EXPENSE"
  color: string
  icon: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Transaction (Transação)
```typescript
{
  id: string
  userId: string
  type: "INCOME" | "EXPENSE"
  description: string
  categoryId?: string
  date: DateTime
  account?: string
  amount: number
  paid: boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Budget (Orçamento)
```typescript
{
  id: string
  userId: string
  categoryId: string
  limit: number
  date: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Goal (Meta)
```typescript
{
  id: string
  userId: string
  categoryId: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: DateTime
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI:

- **Desenvolvimento**: `http://localhost:8080/docs`
- **Produção**: `https://cashwiseapi-hav8m.kinsta.app/docs`

A documentação inclui:
- Todos os endpoints disponíveis
- Esquemas de request e response
- Exemplos de uso
- Códigos de status HTTP
- Autenticação necessária

### Principais Recursos da API

#### 🏷️ Categorias
- Criação, listagem, atualização e exclusão de categorias
- Filtros por tipo (INCOME/EXPENSE)
- Paginação e validação de dados

#### 💰 Transações
- Gerenciamento completo de transações financeiras
- Importação em lote via dados OFX
- Filtros avançados por data, tipo, categoria
- Busca por descrição e conta
- Paginação com headers informativos

#### 💼 Orçamentos
- Criação e controle de orçamentos por categoria
- Cálculo automático de gastos
- Comparação com limites estabelecidos

#### 🎯 Metas
- Definição de metas financeiras
- Acompanhamento de progresso
- Prazos e valores alvo

#### 📊 Relatórios
- Relatórios mensais de receitas e despesas
- Análise por categorias
- Relatórios de saldo e resumos financeiros
- Filtros por período

## 🔐 Autenticação

A API utiliza o Clerk para autenticação. Todas as rotas (exceto em desenvolvimento) requerem um token JWT válido no header `Authorization`:

```
Authorization: Bearer <jwt-token>
```

## 🚦 Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno do servidor

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com nodemon
npm run docker-up        # Sobe containers Docker
npm run docker-down      # Para containers Docker

# Banco de dados
npm run prisma:migrate   # Executa migrações
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:studio    # Interface visual do banco
npm run seed             # Popula banco com dados iniciais

# Produção
npm start               # Inicia servidor em produção

# Qualidade de código
npm run lint            # Executa ESLint
```

## 🌐 CORS

A API está configurada para aceitar requisições das seguintes origens:
- `https://appcashwise.com.br`
- `https://www.appcashwise.com.br`
- `https://cashwiseapi-hav8m.kinsta.app`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

## 📝 Validação de Dados

Todos os endpoints utilizam validação rigorosa com Zod, garantindo:
- Tipos de dados corretos
- Campos obrigatórios
- Formatos válidos (datas, emails, etc.)
- Valores dentro de limites aceitáveis

## 🔄 Paginação

Endpoints que retornam listas incluem headers de paginação:
- `x-total-count`: Total de registros
- `x-current-page`: Página atual
- `x-per-page`: Registros por página
- `x-total-pages`: Total de páginas

## 🐳 Docker

O projeto inclui configuração Docker Compose para PostgreSQL:
```bash
# Iniciar banco de dados
docker-compose up -d

# Parar e remover volumes
docker-compose down -v
```

## 🏗️ Arquitetura

A API segue uma arquitetura em camadas bem definida:

- **Controllers**: Gerenciam requisições HTTP e respostas
- **Services**: Contêm a lógica de negócio
- **Repositories**: Camada de acesso aos dados
- **Schemas**: Validação de entrada com Zod
- **Middleware**: Autenticação e validações
- **Plugins**: Funcionalidades reutilizáveis do Fastify

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ para facilitar o controle financeiro pessoal**