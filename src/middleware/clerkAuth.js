import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { getAuth } = require('@clerk/fastify');

/**
 * Middleware function for Clerk authentication validation
 * Verifies that the request contains a valid authenticated user
 * @param {import('fastify').FastifyRequest} request - The Fastify request object
 * @param {import('fastify').FastifyReply} reply - The Fastify reply object
 * @returns {Promise<void>} Promise that resolves if authentication is successful
 */
const clerkAuth = async (request, reply) => {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return reply.status(401).send({ error: "Usuário não autenticado" });
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return reply.status(401).send({ error: "Falha na autenticação" });
  }
};

export default clerkAuth;