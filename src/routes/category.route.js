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
          $ref: '#/components/schemas/CreateCategory'
        },
        response: {
          201: {
            description: 'Categoria criada com sucesso',
            type: 'object',
            $ref: '#/components/schemas/Category'
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
              $ref: '#/components/schemas/Category'
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
            $ref: '#/components/schemas/Category'
          },
          404: {
            description: 'Categoria não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
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
            $ref: '#/components/schemas/SuccessMessage'
          },
          400: {
            description: 'Categoria possui transações associadas',
            $ref: '#/components/schemas/Error'
          },
          404: {
            description: 'Categoria não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
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
            $ref: '#/components/schemas/Category'
          },
          400: {
            description: 'Erro de validação',
            $ref: '#/components/schemas/Error'
          },
          404: {
            description: 'Categoria não encontrada',
            $ref: '#/components/schemas/Error'
          },
          401: {
            description: 'Não autorizado',
            $ref: '#/components/schemas/Error'
          }
        }
      }
    },
    categoryController.updateCategory
  );
}