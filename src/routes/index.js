import clerkAuth from "../middleware/clerkAuth.js";
import categoryRoute from "./category.route.js";
import transactionRoute from "./transaction.route.js";
import budgetRoute from "./budget.route.js";
import reportRoute from "./report.route.js";
import goalRoute from "./goal.route.js";
import enviroment from "../config/envs.js";

const routes = async (fastify) => {
  if (enviroment.env !== "development") {
    fastify.addHook("preHandler", clerkAuth);
  }
  fastify.register(goalRoute);
  fastify.register(categoryRoute);
  await fastify.register(transactionRoute);
  await fastify.register(budgetRoute);
  fastify.register(reportRoute);
};

export default routes;
