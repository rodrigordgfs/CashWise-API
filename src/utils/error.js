import { z } from "zod";
import { StatusCodes } from "http-status-codes";

/**
 * Custom application error class for handling business logic errors
 * @class AppError
 * @extends Error
 */
export default class AppError extends Error {
  /**
   * Creates an instance of AppError
   * @param {string} message - The error message
   * @param {*} [details=null] - Additional error details
   */
  constructor(message, details = null) {
    super(message);
    this.name = "AppError";
    this.details = details;
  }
}

/**
 * Handles error responses for Fastify routes, including Zod validation errors
 * @param {Error} error - The error object to handle
 * @param {import('fastify').FastifyReply} reply - The Fastify reply object
 * @returns {import('fastify').FastifyReply} The reply object with appropriate error response
 */
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