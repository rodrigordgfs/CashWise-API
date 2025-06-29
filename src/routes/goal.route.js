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
    { preHandler: v({ body: createGoalSchema }) },
    goalController.createGoal
  );

  fastify.get("/goal", goalController.listGoals);

  fastify.get(
    "/goal/:id",
    { preHandler: v({ params: idParamSchema }) },
    goalController.listGoalById
  );

  fastify.delete(
    "/goal/:id",
    { preHandler: v({ params: idParamSchema }) },
    goalController.deleteGoal
  );

  fastify.patch(
    "/goal/:id",
    { preHandler: v({ params: idParamSchema, body: updateGoalSchema }) },
    goalController.updateGoal
  );
}
