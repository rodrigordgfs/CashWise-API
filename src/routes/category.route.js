import categoryController from "../controllers/category.controller.js";
import {
  categorySchema,
  updateCategorySchema,
  idParamSchema,
  categoryQuerySchema,
} from "../schemas/category.schema.js";

export default async function categoryRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.post(
    "/category",
    { preHandler: v({ body: categorySchema }) },
    categoryController.createCategory
  );

  fastify.get(
    "/category",
    { preHandler: v({ query: categoryQuerySchema }) },
    categoryController.listCategories
  );

  fastify.get(
    "/category/:id",
    { preHandler: v({ params: idParamSchema }) },
    categoryController.listCategoryById
  );

  fastify.delete(
    "/category/:id",
    { preHandler: v({ params: idParamSchema }) },
    categoryController.deleteCategory
  );

  fastify.patch(
    "/category/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateCategorySchema }),
    },
    categoryController.updateCategory
  );
}
