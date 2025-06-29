import budgetController from "../controllers/budget.controller.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
  idParamSchema,
} from "../schemas/budget.schema.js";

/**
 * Registers HTTP routes for budget management on the Fastify instance, including validation of request data.
 */
export default async function budgetRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.post(
    "/budget",
    {
      preHandler: v({ body: createBudgetSchema }),
      schema: {
        tags: ['Budgets'],
        summary: 'Criar novo orçamento',
        description: 'Cria um novo orçamento para uma categoria específica',
        body: {
          $ref: '#/components/schemas/CreateBudget'
        },
        response: {
          201: {
            description: 'Orçamento criado com sucesso',
            $ref: '#/components/schemas/Budget'
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
    budgetController.createBudget
  );

  fastify.get(
    "/budget",
    {
      schema: {
        tags: ['Budgets'],
        summary: 'Listar orçamentos',
        description: 'Lista todos os orçamentos do usuário com gastos calculados',
        response: {
          200: {
            description: 'Lista de orçamentos',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Budget'
            }
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    budgetController.listBudget
  );

  fastify.get(
    "/budget/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Budgets'],
        summary: 'Buscar orçamento por ID',
        description: 'Retorna um orçamento específico pelo seu ID',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do orçamento'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Orçamento encontrado',
            $ref: '#/components/schemas/Budget'
          },
          404: {
            description: 'Orçamento não encontrado',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    budgetController.listBudgetById
  );

  fastify.delete(
    "/budget/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Budgets'],
        summary: 'Deletar orçamento',
        description: 'Remove um orçamento específico',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do orçamento'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Orçamento deletado com sucesso',
            $ref: '#/components/schemas/SuccessMessage'
          },
          404: {
            description: 'Orçamento não encontrado',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    budgetController.deleteBudget
  );

  fastify.patch(
    "/budget/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateBudgetSchema }),
      schema: {
        tags: ['Budgets'],
        summary: 'Atualizar orçamento',
        description: 'Atualiza os dados de um orçamento existente',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do orçamento'
            }
          },
          required: ['id']
        },
        body: {
          type: 'object',
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
        response: {
          200: {
            description: 'Orçamento atualizado com sucesso',
            $ref: '#/components/schemas/Budget'
          },
          400: {
            description: 'Erro de validação',
            $ref: '#/components/schemas/Error'
          },
          404: {
            description: 'Orçamento não encontrado',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    budgetController.updateBudget
  );
}