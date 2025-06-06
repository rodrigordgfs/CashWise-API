import goalController from "../controllers/goal.controller.js";

const goalRoute = (fastify) => {
  fastify.post("/goal", goalController.createGoal);
  fastify.get("/goal", goalController.listGoals);
  fastify.get("/goal/:id", goalController.listGoalById);
  fastify.delete("/goal/:id", goalController.deleteGoal);
  fastify.patch("/goal/:id", goalController.updateGoal);
};

export default goalRoute;
