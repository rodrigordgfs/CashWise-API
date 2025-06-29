import fp from "fastify-plugin";
import { getUserIdFromRequest } from "../utils/getUserId.js";

export default fp(async (fastify) => {
  fastify.decorateRequest("userId", null);

  fastify.addHook("preHandler", async (request) => {
    request.userId = await getUserIdFromRequest(request);
  });
});
