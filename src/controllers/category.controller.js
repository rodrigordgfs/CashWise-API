import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import categoryService from "../services/category.service.js";
import AppError from "../utils/error.js";

const handleErrorResponse = (error, reply) => {
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

const createCategory = async (request, reply) => {
  const categorySchema = z.object({
    userId: z
      .string({ required_error: "O ID do usuário é obrigatório" })
      .min(1, { message: "O ID do usuário é obrigatório" }),
    name: z.string({ required_error: "O nome da categoria é obrigatório" }),
    type: z.enum(["INCOME", "EXPENSE"], {
      required_error: "O tipo de categoria é obrigatório",
    }),
    color: z
      .string({ required_error: "A cor é obrigatória" })
      .min(1, "A cor não pode estar vazia"),
    icon: z
      .string({ required_error: "O ícone é obrigatório" })
      .min(1, "O ícone não pode estar vazio"),
  });

  try {
    const validation = categorySchema.safeParse(request.body);

    if (!validation.success) {
      throw validation.error;
    }

    const { userId, name, type, color, icon } = validation.data;

    const category = await categoryService.createCategory(
      userId,
      name,
      type,
      color,
      icon
    );

    reply.code(StatusCodes.CREATED).send(category);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  createCategory,
};
