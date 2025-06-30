export const swaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'CashWise API',
      description: 'API REST robusta para gerenciamento financeiro pessoal, construída com Node.js, Fastify e PostgreSQL. A API oferece funcionalidades completas para controle de transações, categorias, orçamentos, metas financeiras e relatórios detalhados.',
      version: '1.0.0',
      contact: {
        name: 'CashWise Team',
        email: 'support@cashwise.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://cashwiseapi-hav8m.kinsta.app',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT fornecido pelo Clerk'
        }
      },
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da categoria'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário'
            },
            name: {
              type: 'string',
              description: 'Nome da categoria'
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Tipo da categoria'
            },
            color: {
              type: 'string',
              description: 'Cor da categoria em hexadecimal'
            },
            icon: {
              type: 'string',
              description: 'Ícone da categoria'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        CreateCategory: {
          type: 'object',
          required: ['name', 'type', 'color', 'icon'],
          properties: {
            name: {
              type: 'string',
              description: 'Nome da categoria'
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Tipo da categoria'
            },
            color: {
              type: 'string',
              description: 'Cor da categoria em hexadecimal'
            },
            icon: {
              type: 'string',
              description: 'Ícone da categoria'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da transação'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário'
            },
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Tipo da transação'
            },
            description: {
              type: 'string',
              description: 'Descrição da transação'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria associada'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data da transação'
            },
            account: {
              type: 'string',
              description: 'Conta utilizada na transação'
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Valor da transação'
            },
            paid: {
              type: 'boolean',
              description: 'Status de pagamento'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        CreateTransaction: {
          type: 'object',
          required: ['type', 'description', 'categoryId', 'date', 'account', 'amount'],
          properties: {
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Tipo da transação'
            },
            description: {
              type: 'string',
              description: 'Descrição da transação'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria associada'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data da transação'
            },
            account: {
              type: 'string',
              description: 'Conta utilizada na transação'
            },
            amount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor da transação'
            }
          }
        },
        Budget: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do orçamento'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria associada'
            },
            limit: {
              type: 'number',
              format: 'float',
              description: 'Limite do orçamento'
            },
            spent: {
              type: 'string',
              description: 'Valor gasto no orçamento'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data do orçamento'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        CreateBudget: {
          type: 'object',
          required: ['categoryId', 'limit', 'date'],
          properties: {
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria associada'
            },
            limit: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Limite do orçamento'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data do orçamento'
            }
          }
        },
        Goal: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único da meta'
            },
            userId: {
              type: 'string',
              description: 'ID do usuário proprietário'
            },
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria associada'
            },
            title: {
              type: 'string',
              description: 'Título da meta'
            },
            description: {
              type: 'string',
              description: 'Descrição da meta'
            },
            targetAmount: {
              type: 'number',
              format: 'float',
              description: 'Valor alvo da meta'
            },
            currentAmount: {
              type: 'number',
              format: 'float',
              description: 'Valor atual da meta'
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: 'Prazo da meta'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        CreateGoal: {
          type: 'object',
          required: ['categoryId', 'title', 'targetAmount', 'deadline'],
          properties: {
            categoryId: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria associada'
            },
            title: {
              type: 'string',
              description: 'Título da meta'
            },
            description: {
              type: 'string',
              description: 'Descrição da meta'
            },
            targetAmount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor alvo da meta'
            },
            currentAmount: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Valor atual da meta'
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: 'Prazo da meta'
            }
          }
        },
        MonthlyReport: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome do mês/ano'
            },
            income: {
              type: 'number',
              format: 'float',
              description: 'Total de receitas'
            },
            expense: {
              type: 'number',
              format: 'float',
              description: 'Total de despesas'
            }
          }
        },
        CategoryReport: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome da categoria'
            },
            value: {
              type: 'number',
              format: 'float',
              description: 'Valor total da categoria'
            },
            fill: {
              type: 'string',
              description: 'Cor da categoria'
            }
          }
        },
        BalanceReport: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nome do mês'
            },
            balance: {
              type: 'number',
              format: 'float',
              description: 'Saldo do mês'
            }
          }
        },
        SummaryReport: {
          type: 'object',
          properties: {
            income: {
              type: 'number',
              format: 'float',
              description: 'Total de receitas'
            },
            expense: {
              type: 'number',
              format: 'float',
              description: 'Total de despesas'
            },
            balance: {
              type: 'number',
              format: 'float',
              description: 'Saldo total'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Campo com erro'
                  },
                  message: {
                    type: 'string',
                    description: 'Mensagem do erro'
                  }
                }
              }
            }
          }
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de sucesso'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Categories',
        description: 'Operações relacionadas às categorias de transações'
      },
      {
        name: 'Transactions',
        description: 'Operações relacionadas às transações financeiras'
      },
      {
        name: 'Budgets',
        description: 'Operações relacionadas aos orçamentos'
      },
      {
        name: 'Goals',
        description: 'Operações relacionadas às metas financeiras'
      },
      {
        name: 'Reports',
        description: 'Relatórios e análises financeiras'
      }
    ]
  }
};

export const swaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject;
  },
  transformSpecificationClone: true
};