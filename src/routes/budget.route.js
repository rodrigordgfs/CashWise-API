import budgetController from "../controllers/budget.controller.js";
import {
  createBudgetSchema,
  updateBudgetSchema,
  idParamSchema,
} from "../schemas/budget.schema.js";

/**
 * Registers HTTP routes for budget management on the Fastify instance, including validation of request data.
 *
 * Defines endpoints for creating, listing, retrieving by ID, updating, and deleting budgets, with request validation using Zod schemas.
 */
export default async function budgetRoutes(fastify) {
  const v = fastify.zodValidate;

  fastify.post(
    "/budget",
    { preHandler: v({ body: createBudgetSchema }) },
    budgetController.createBudget
  );

  fastify.get("/budget", budgetController.listBudget);

  fastify.get(
    "/budget/:id",
    { preHandler: v({ params: idParamSchema }) },
    budgetController.listBudgetById
  );

  fastify.delete(
    "/budget/:id",
    { preHandler: v({ params: idParamSchema }) },
    budgetController.deleteBudget
  );

  fastify.patch(
    "/budget/:id",
    {
      preHandler: v({ params: idParamSchema, body: updateBudgetSchema }),
    },
    budgetController.updateBudget
  );
}
