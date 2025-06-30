import fp from "fastify-plugin";
import { getUserIdFromRequest } from "../utils/getUserId.js";

/**
 * Fastify plugin that decorates requests with userId from authentication
 * Automatically extracts and attaches the authenticated user ID to each request
 * @param {import('fastify').FastifyInstance} fastify - The Fastify instance
 * @returns {Promise<void>} Promise that resolves when plugin is registered
 */
export default fp(async (fastify) => {
  fastify.decorateRequest("userId", null);

  fastify.addHook("preHandler", async (request) => {
    request.userId = await getUserIdFromRequest(request);
  });
});