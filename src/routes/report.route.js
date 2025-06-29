import reportController from "../controllers/report.controller.js";
import {
  basePeriodSchema,
  reportWithLimitSchema,
} from "../schemas/report.schema.js";

/**
 * Registers report-related GET endpoints on the Fastify instance with schema-based query validation.
 */
export default async function reportRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.get(
    "/report/monthly",
    {
      preHandler: v({ query: basePeriodSchema }),
      schema: {
        tags: ['Reports'],
        summary: 'Relatório mensal',
        description: 'Retorna relatório de receitas e despesas agrupadas por mês',
        querystring: {
          type: 'object',
          properties: {
            period__gte: {
              type: 'string',
              format: 'date',
              description: 'Data inicial do período'
            },
            period__lte: {
              type: 'string',
              format: 'date',
              description: 'Data final do período'
            }
          },
          required: ['period__gte', 'period__lte']
        },
        response: {
          200: {
            description: 'Relatório mensal',
            type: 'array',
            items: {
              $ref: '#/components/schemas/MonthlyReport'
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
    reportController.listMonthlyReports
  );

  fastify.get(
    "/report/categories",
    {
      preHandler: v({ query: reportWithLimitSchema }),
      schema: {
        tags: ['Reports'],
        summary: 'Relatório por categorias',
        description: 'Retorna relatório de transações agrupadas por categoria',
        querystring: {
          type: 'object',
          properties: {
            period__gte: {
              type: 'string',
              format: 'date',
              description: 'Data inicial do período'
            },
            period__lte: {
              type: 'string',
              format: 'date',
              description: 'Data final do período'
            },
            limit: {
              type: 'integer',
              minimum: 1,
              description: 'Limite de categorias retornadas'
            }
          },
          required: ['period__gte', 'period__lte']
        },
        response: {
          200: {
            description: 'Relatório por categorias',
            type: 'array',
            items: {
              $ref: '#/components/schemas/CategoryReport'
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
    reportController.listCategoriesWithTransactions
  );

  fastify.get(
    "/report/balance",
    {
      preHandler: v({ query: basePeriodSchema }),
      schema: {
        tags: ['Reports'],
        summary: 'Relatório de saldo',
        description: 'Retorna relatório de saldo mensal (receitas - despesas)',
        querystring: {
          type: 'object',
          properties: {
            period__gte: {
              type: 'string',
              format: 'date',
              description: 'Data inicial do período'
            },
            period__lte: {
              type: 'string',
              format: 'date',
              description: 'Data final do período'
            }
          },
          required: ['period__gte', 'period__lte']
        },
        response: {
          200: {
            description: 'Relatório de saldo',
            type: 'array',
            items: {
              $ref: '#/components/schemas/BalanceReport'
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
    reportController.listBalanceReports
  );

  fastify.get(
    "/report/summary",
    {
      preHandler: v({ query: basePeriodSchema }),
      schema: {
        tags: ['Reports'],
        summary: 'Resumo financeiro',
        description: 'Retorna resumo consolidado de receitas, despesas e saldo do período',
        querystring: {
          type: 'object',
          properties: {
            period__gte: {
              type: 'string',
              format: 'date',
              description: 'Data inicial do período'
            },
            period__lte: {
              type: 'string',
              format: 'date',
              description: 'Data final do período'
            }
          },
          required: ['period__gte', 'period__lte']
        },
        response: {
          200: {
            description: 'Resumo financeiro',
            $ref: '#/components/schemas/SummaryReport'
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
    reportController.listSummaryReports
  );
}