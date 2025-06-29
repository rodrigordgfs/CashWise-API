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
│   │   └── envs.js         # Configurações de ambiente
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

## 🔗 Endpoints da API

### 🏷️ Categorias

#### `POST /category`
Cria uma nova categoria.
```json
{
  "name": "Alimentação",
  "type": "EXPENSE",
  "color": "#FF6B6B",
  "icon": "🍔"
}
```

#### `GET /category`
Lista categorias com paginação e filtros.
- **Query params**: `type`, `page`, `perPage`
- **Headers de resposta**: `x-total-count`, `x-current-page`, `x-per-page`, `x-total-pages`

#### `GET /category/:id`
Busca categoria por ID.

#### `PATCH /category/:id`
Atualiza categoria existente.

#### `DELETE /category/:id`
Remove categoria (apenas se não houver transações associadas).

### 💰 Transações

#### `POST /transaction`
Cria uma nova transação.
```json
{
  "type": "EXPENSE",
  "description": "Almoço no restaurante",
  "categoryId": "uuid-da-categoria",
  "date": "2024-01-15T12:00:00Z",
  "account": "Cartão de Crédito",
  "amount": 45.50
}
```

#### `POST /transaction/import-ofx`
Importa transações em lote a partir de dados OFX.
```json
[
  {
    "description": "Pagamento PIX",
    "date": "2024-01-15T10:30:00Z",
    "amount": "150.00",
    "type": "EXPENSE"
  }
]
```

#### `GET /transaction`
Lista transações com filtros avançados.
- **Query params**: 
  - `type`: Tipo da transação (INCOME/EXPENSE)
  - `date`: Data específica
  - `date__gte`: Data maior ou igual
  - `date__lte`: Data menor ou igual
  - `sort`: Ordenação (asc/desc)
  - `search`: Busca por descrição ou conta
  - `page`: Página atual
  - `perPage`: Itens por página

#### `GET /transaction/:id`
Busca transação por ID.

#### `PATCH /transaction/:id`
Atualiza transação existente.

#### `DELETE /transaction/:id`
Remove transação.

### 💼 Orçamentos

#### `POST /budget`
Cria um novo orçamento.
```json
{
  "categoryId": "uuid-da-categoria",
  "limit": 500.00,
  "date": "2024-01-01T00:00:00Z"
}
```

#### `GET /budget`
Lista todos os orçamentos do usuário com gastos calculados.

#### `GET /budget/:id`
Busca orçamento por ID.

#### `PATCH /budget/:id`
Atualiza orçamento existente.

#### `DELETE /budget/:id`
Remove orçamento.

### 🎯 Metas

#### `POST /goal`
Cria uma nova meta financeira.
```json
{
  "categoryId": "uuid-da-categoria",
  "title": "Viagem para Europa",
  "description": "Economizar para viagem de férias",
  "targetAmount": 10000.00,
  "currentAmount": 2500.00,
  "deadline": "2024-12-31T23:59:59Z"
}
```

#### `GET /goal`
Lista todas as metas do usuário.

#### `GET /goal/:id`
Busca meta por ID.

#### `PATCH /goal/:id`
Atualiza meta existente.

#### `DELETE /goal/:id`
Remove meta.

### 📊 Relatórios

#### `GET /report/monthly`
Relatório mensal de receitas e despesas.
- **Query params**: `period__gte`, `period__lte`
```json
[
  {
    "name": "Jan/2024",
    "income": 5000.00,
    "expense": 3500.00
  }
]
```

#### `GET /report/categories`
Relatório por categorias com limite opcional.
- **Query params**: `period__gte`, `period__lte`, `limit`
```json
[
  {
    "name": "Alimentação",
    "value": -1200.00,
    "fill": "#FF6B6B"
  }
]
```

#### `GET /report/balance`
Relatório de saldo mensal.
- **Query params**: `period__gte`, `period__lte`
```json
[
  {
    "name": "Jan",
    "balance": 1500.00
  }
]
```

#### `GET /report/summary`
Resumo financeiro do período.
- **Query params**: `period__gte`, `period__lte`
```json
{
  "income": 5000.00,
  "expense": 3500.00,
  "balance": 1500.00
}
```

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

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido com ❤️ para facilitar o controle financeiro pessoal**