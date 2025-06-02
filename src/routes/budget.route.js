import budgetController from "../controllers/budget.controller.js";

const budgetRoute = (fastify) => {
  fastify.post("/budget", budgetController.createBudget);
  fastify.get("/budget", budgetController.listBudget);
  fastify.get("/budget/:id", budgetController.listBudgetById);
  fastify.delete("/budget/:id", budgetController.deleteBudget);
  fastify.patch("/budget/:id", budgetController.updateBudget);
};

export default budgetRoute;
