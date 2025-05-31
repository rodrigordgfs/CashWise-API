import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import categoryService from "../services/category.service.js";

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

  const errorMessages = {
    "Treino não encontrado": StatusCodes.NOT_FOUND,
  };

  const statusCode =
    errorMessages[error.message] || StatusCodes.INTERNAL_SERVER_ERROR;
  reply.code(statusCode).send({
    error: error.message || "Ocorreu um erro interno",
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

    const category = await categoryService.createCategory({
      userId,
      name,
      type,
      color,
      icon,
    });

    reply.code(StatusCodes.CREATED).send({
      message: "Categoria criada com sucesso",
      category,
    });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  createCategory,
};
