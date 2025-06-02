import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import budgetService from "../services/budget.service.js";
import AppError, { handleErrorResponse } from "../utils/error.js";

const createBudget = async (request, reply) => {
  const budgetSchema = z.object({
    userId: z.string().min(1, "O ID do usuário é obrigatório"),
    categoryId: z.string().min(1, "O ID da categoria é obrigatório"),
    limit: z.number(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
  });

  try {
    const validation = budgetSchema.safeParse(request.body);
    if (!validation.success) throw validation.error;

    const { userId, categoryId, limit, date } = validation.data;

    const budget = await budgetService.createBudget(
      userId,
      categoryId,
      limit,
      new Date(date)
    );

    reply.code(StatusCodes.CREATED).send(budget);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listBudget = async (request, reply) => {
  const querySchema = z.object({
    userId: z.string().min(1, "O ID do usuário é obrigatório"),
  });

  try {
    const validation = querySchema.safeParse(request.query);
    if (!validation.success) throw validation.error;

    const { userId } = validation.data;
    const budgets = await budgetService.listBudgets(userId);
    reply.code(StatusCodes.OK).send(budgets);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listBudgetById = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string().min(1, "O ID do orçamento é obrigatório"),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);
    if (!validation.success) throw validation.error;

    const { id } = validation.data;
    const budget = await budgetService.listBudgetById(id);

    if (!budget) {
      throw new AppError("Orçamento não encontrado", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(budget);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteBudget = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string().min(1, "O ID do orçamento é obrigatório"),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);
    if (!validation.success) throw validation.error;

    const { id } = validation.data;
    const deleted = await budgetService.deleteBudget(id);

    if (!deleted) {
      throw new AppError("Orçamento não encontrado", StatusCodes.NOT_FOUND);
    }

    reply
      .code(StatusCodes.OK)
      .send({ message: "Orçamento deletado com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const updateBudget = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string().min(1, "O ID do orçamento é obrigatório"),
  });

  const bodySchema = z.object({
    userId: z.string().optional(),
    categoryId: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    limit: z.number().optional(),
    date: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Data inválida",
      }),
  });

  try {
    // Validação dos parâmetros
    const paramsValidation = paramsSchema.safeParse(request.params);
    if (!paramsValidation.success) {
      throw paramsValidation.error;
    }

    // Validação do corpo da requisição
    const bodyValidation = bodySchema.safeParse(request.body);
    if (!bodyValidation.success) {
      throw bodyValidation.error;
    }

    const { id } = paramsValidation.data;
    const { userId, categoryId, icon, color, limit, date } =
      bodyValidation.data;

    const updated = await budgetService.updateBudget(
      id,
      userId,
      categoryId,
      icon,
      color,
      limit,
      date ? new Date(date) : undefined
    );

    if (!updated) {
      throw new AppError("Orçamento não encontrado", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(updated);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  createBudget,
  listBudget,
  listBudgetById,
  deleteBudget,
  updateBudget,
};
