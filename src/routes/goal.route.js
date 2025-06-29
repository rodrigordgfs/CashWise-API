import goalController from "../controllers/goal.controller.js";
import {
  createGoalSchema,
  updateGoalSchema,
  idParamSchema,
} from "../schemas/goal.schema.js";

/**
 * Registers HTTP routes for goal management on the Fastify instance, including creation, retrieval, updating, and deletion of goals with schema validation for request bodies and parameters.
 */
export default async function goalRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.post(
    "/goal",
    {
      preHandler: v({ body: createGoalSchema }),
      schema: {
        tags: ['Goals'],
        summary: 'Criar nova meta',
        description: 'Cria uma nova meta financeira para o usuário autenticado',
        body: {
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
        response: {
          201: {
            description: 'Meta criada com sucesso',
            $ref: '#/components/schemas/Goal'
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
    goalController.createGoal
  );

  fastify.get(
    "/goal",
    {
      schema: {
        tags: ['Goals'],
        summary: 'Listar metas',
        description: 'Lista todas as metas financeiras do usuário',
        response: {
          200: {
            description: 'Lista de metas',
            type: 'array',
            items: {
              $ref: '#/components/schemas/Goal'
            }
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    goalController.listGoals
  );

  fastify.get(
    "/goal/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Goals'],
        summary: 'Buscar meta por ID',
        description: 'Retorna uma meta específica pelo seu ID',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da meta'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Meta encontrada',
            $ref: '#/components/schemas/Goal'
          },
          404: {
            description: 'Meta não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    goalController.listGoalById
  );

  fastify.delete(
    "/goal/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Goals'],
        summary: 'Deletar meta',
        description: 'Remove uma meta específica',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da meta'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Meta deletada com sucesso',
            $ref: '#/components/schemas/SuccessMessage'
          },
          404: {
            description: 'Meta não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    goalController.deleteGoal
  );

  fastify.patch(
    "/goal/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateGoalSchema }),
      schema: {
        tags: ['Goals'],
        summary: 'Atualizar meta',
        description: 'Atualiza os dados de uma meta existente',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da meta'
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
        response: {
          200: {
            description: 'Meta atualizada com sucesso',
            $ref: '#/components/schemas/Goal'
          },
          400: {
            description: 'Erro de validação',
            $ref: '#/components/schemas/Error'
          },
          404: {
            description: 'Meta não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    goalController.updateGoal
  );
}