import clerkAuth from "../middleware/clerkAuth.js";
import categoryRoute from "./category.route.js";
import enviroment from "../config/envs.js";

const routes = async (fastify) => {
  if (enviroment.env !== "development") {
    fastify.addHook("preHandler", clerkAuth);
  }
  fastify.register(categoryRoute);
};

export default routes;
