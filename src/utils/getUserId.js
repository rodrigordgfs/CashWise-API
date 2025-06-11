import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { getAuth } = require("@clerk/fastify");

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
