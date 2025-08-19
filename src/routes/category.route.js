import categoryController from "../controllers/category.controller.js";
import {
  categorySchema,
  updateCategorySchema,
  idParamSchema,
  categoryQuerySchema,
} from "../schemas/category.schema.js";

/**
 * Registers HTTP routes for category management on the Fastify instance, including creation, retrieval, updating, and deletion of categories with request validation.
 */
export default async function categoryRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.post(
    "/category",
    {
      preHandler: v({ body: categorySchema }),
      schema: {
        tags: ['Categories'],
        summary: 'Criar nova categoria',
        description: 'Cria uma nova categoria de transação para o usuário autenticado',
        body: {
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
        response: {
          201: {
            description: 'Categoria criada com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
              color: { type: 'string' },
              icon: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    categoryController.createCategory
  );

  fastify.get(
    "/category",
    {
      preHandler: v({ query: categoryQuerySchema }),
      schema: {
        tags: ['Categories'],
        summary: 'Listar categorias',
        description: 'Lista todas as categorias do usuário com paginação e filtros',
        querystring: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['INCOME', 'EXPENSE'],
              description: 'Filtrar por tipo de categoria'
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
            description: 'Lista de categorias',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                userId: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                color: { type: 'string' },
                icon: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    },
    categoryController.listCategories
  );

  fastify.get(
    "/category/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Categories'],
        summary: 'Buscar categoria por ID',
        description: 'Retorna uma categoria específica pelo seu ID',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Categoria encontrada',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
              color: { type: 'string' },
              icon: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    categoryController.listCategoryById
  );

  fastify.delete(
    "/category/:id",
    {
      preHandler: v({ params: idParamSchema }),
      schema: {
        tags: ['Categories'],
        summary: 'Deletar categoria',
        description: 'Remove uma categoria (apenas se não houver transações associadas)',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria'
            }
          },
          required: ['id']
        },
        response: {
          200: {
            description: 'Categoria deletada com sucesso',
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    },
    categoryController.deleteCategory
  );

  fastify.patch(
    "/category/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateCategorySchema }),
      schema: {
        tags: ['Categories'],
        summary: 'Atualizar categoria',
        description: 'Atualiza os dados de uma categoria existente',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID da categoria'
            }
          },
          required: ['id']
        },
        body: {
          type: 'object',
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
        response: {
          200: {
            description: 'Categoria atualizada com sucesso',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
              color: { type: 'string' },
              icon: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    categoryController.updateCategory
  );
}