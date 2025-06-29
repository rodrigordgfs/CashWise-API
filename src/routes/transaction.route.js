import transactionController from "../controllers/transaction.controller.js";
import {
  createTransactionSchema,
  createTransactionsFromOfxSchema,
  idParamSchema,
  querySchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema.js";

/**
 * Registers transaction-related HTTP routes on the Fastify instance with schema validation and controller handlers.
 */
export default async function transactionRoute(fastify) {
  const v = fastify.zodValidate;

  fastify.post(
    "/transaction",
    {
      preHandler: v({ body: createTransactionSchema }),
      schema: {
        tags: ['Transactions'],
        summary: 'Criar nova transação',
        description: 'Cria uma nova transação financeira para o usuário autenticado',
        body: {
          $ref: '#/components/schemas/CreateTransaction'
        },
        response: {
          201: {
            description: 'Transação criada com sucesso',
            $ref: '#/components/schemas/Transaction'
          },
          400: {
            description: 'Erro de validação',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    transactionController.createTransaction,
  );

  fastify.post(
    "/transaction/import-ofx",
    {
      preHandler: v({ body: createTransactionsFromOfxSchema }),
      schema: {
        tags: ['Transactions'],
        summary: 'Importar transações OFX',
        description: 'Importa múltiplas transações em lote a partir de dados OFX',
        body: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
                description: 'Descrição da transação'
              },
              date: {
                type: 'string',
                format: 'date-time',
                description: 'Data da transação'
              },
              amount: {
                type: 'string',
                description: 'Valor da transação como string'
              },
              type: {
                type: 'string',
                enum: ['INCOME', 'EXPENSE'],
                description: 'Tipo da transação'
              }
            },
            required: ['description', 'date', 'amount', 'type']
          }
        },
        response: {
          201: {
            description: 'Transações importadas com sucesso',
            type: 'object',
            properties: {
              count: {
                type: 'integer',
                description: 'Número de transações importadas'
              }
            }
          },
          400: {
            description: 'Erro de validação',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    transactionController.createTransactionsFromOfx,
  );

  fastify.get(
    "/transaction",
    {
      preHandler: v({ query: querySchema }),
      schema: {
        tags: ['Transactions'],
        summary: 'Listar transações',
        description: 'Lista todas as transações do usuário com filtros avançados e paginação',
        querystring: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Filtrar por tipo de transação'
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Filtrar por data específica'
            },
            date__gte: {
              type: 'string',
              format: 'date',
              description: 'Data maior ou igual'
            },
            date__lte: {
              type: 'string',
              format: 'date',
              description: 'Data menor ou igual'
            },
            sort: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'desc',
              description: 'Ordenação por data'
            },
            search: {
              type: 'string',
              description: 'Busca por descrição ou conta'
            },
            page: {
              type: 'integer',
              minimum: 1,
              default: 1,
              description: 'Número da página'
            },
            perPage: {
              type: 'integer',
              minimum: 1,
              default: 10,
              description: 'Itens por página'
            }
          }
        },
        response: {
          200: {
            description: 'Lista de transações',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Transaction'
            },
            headers: {
              'x-total-count': {
                type: 'integer',
                description: 'Total de registros'
              },
              'x-current-page': {
                type: 'integer',
                description: 'Página atual'
              },
              'x-per-page': {
                type: 'integer',
                description: 'Registros por página'
              },
              'x-total-pages': {
                type: 'integer',
                description: 'Total de páginas'
              }
            }
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    transactionController.listTransactions,
  );

  fastify.get(
    "/transaction/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Transactions'],
        summary: 'Buscar transação por ID',
        description: 'Retorna uma transação específica pelo seu ID',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da transação'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Transação encontrada',
            $ref: '#/components/schemas/Transaction'
          },
          404: {
            description: 'Transação não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    transactionController.listTransactionById,
  );

  fastify.delete(
    "/transaction/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Transactions'],
        summary: 'Deletar transação',
        description: 'Remove uma transação específica',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da transação'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Transação deletada com sucesso',
            $ref: '#/components/schemas/SuccessMessage'
          },
          404: {
            description: 'Transação não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    transactionController.deleteTransaction,
  );

  fastify.patch(
    "/transaction/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateTransactionSchema }),
      schema: {
        tags: ['Transactions'],
        summary: 'Atualizar transação',
        description: 'Atualiza os dados de uma transação existente',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da transação'
            }
          },
          required: ['id']
        },
        body: {
          type: 'object',
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
        response: {
          200: {
            description: 'Transação atualizada com sucesso',
            $ref: '#/components/schemas/Transaction'
          },
          400: {
            description: 'Erro de validação',
            $ref: '#/components/schemas/Error'
          },
          404: {
            description: 'Transação não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    transactionController.updateTransaction,
  );
}