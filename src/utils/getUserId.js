import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { getAuth } = require("@clerk/fastify");

/**
 * Extracts and validates user ID from Fastify request using Clerk authentication
 * @param {import('fastify').FastifyRequest} request - The Fastify request object
 * @returns {Promise<string>} Promise that resolves with the authenticated user ID
 * @throws {Error} When user is not authenticated or authentication fails
 */
export const getUserIdFromRequest = async (request) => {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    return userId;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    throw new Error("Falha na autenticação");
  }
};