import { z } from "zod";
import { StatusCodes } from "http-status-codes";
export default class AppError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = "AppError";
    this.details = details;
  }
}

export const handleErrorResponse = (error, reply) => {
  if (error instanceof z.ZodError) {
    return reply.code(StatusCodes.BAD_REQUEST).send({
      message: "Erro de validação",
      errors: error.errors.map((err) => ({
        field: err.path.length > 0 ? err.path.join(".") : "body",
        message: err.message,
      })),
    });
  }

  const statusCode =
    error instanceof AppError
      ? StatusCodes.BAD_REQUEST
      : StatusCodes.INTERNAL_SERVER_ERROR;

  return reply.code(statusCode).send({
    message: error.message || "Ocorreu um erro interno",
    ...(error.details && { details: error.details }),
  });
};
