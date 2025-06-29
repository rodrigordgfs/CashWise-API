import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { getAuth } = require('@clerk/fastify');

const clerkAuth = async (request, reply) => {
  try {
    if (request.url.startsWith('/docs')) {
      return;
    }

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
