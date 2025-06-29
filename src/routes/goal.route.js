import goalController from "../controllers/goal.controller.js";
import {
  createGoalSchema,
  updateGoalSchema,
  idParamSchema,
} from "../schemas/goal.schema.js";

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
