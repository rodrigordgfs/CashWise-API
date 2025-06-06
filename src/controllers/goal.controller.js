import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import goalService from "../services/goal.service.js";
import AppError, { handleErrorResponse } from "../utils/error.js";

const createGoal = async (request, reply) => {
  const goalSchema = z.object({
    userId: z
      .string({ required_error: "O ID do usuário é obrigatório" })
      .min(1, { message: "O ID do usuário é obrigatório" }),
    categoryId: z
      .string({ required_error: "O ID da categoria é obrigatório" })
      .min(1, { message: "O ID da categoria é obrigatório" }),
    title: z.string({ required_error: "O título é obrigatório" }),
    description: z.string().min(1).optional(),
    targetAmount: z.number().min(0).optional(),
    currentAmount: z.number().min(0).optional(),
    deadline: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    }, z.date().min(new Date(), { message: "A data deve ser futura" })),
  });

  try {
    const validation = goalSchema.safeParse(request.body);

    if (!validation.success) {
      throw validation.error;
    }

    const {
      userId,
      categoryId,
      title,
      description,
      targetAmount,
      currentAmount,
      deadline,
    } = validation.data;

    const goal = await goalService.createGoal(
      userId,
      categoryId,
      title,
      description,
      targetAmount,
      currentAmount,
      deadline
    );

    reply.code(StatusCodes.CREATED).send(goal);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listGoals = async (request, reply) => {
  const querySchema = z.object({
    userId: z.string({ required_error: "O ID do usuário é obrigatório" }),
  });

  try {
    const validation = querySchema.safeParse(request.query);

    if (!validation.success) {
      throw validation.error;
    }

    const { userId } = validation.data;

    const goals = await goalService.listGoals(userId);

    reply.code(StatusCodes.OK).send(goals);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listGoalById = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da meta é obrigatório" }),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    const goal = await goalService.listGoalById(id);

    if (!goal) {
      throw new AppError("Meta não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(goal);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteGoal = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da meta é obrigatório" }),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    const goal = await goalService.deleteGoal(id);

    if (!goal) {
      throw new AppError("Meta não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send({ message: "Meta deletada com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const updateGoal = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da meta é obrigatório" }),
  });

  const bodySchema = z.object({
    title: z.string().optional(),
    description: z.string().min(1).optional(),
    targetAmount: z.number().min(0).optional(),
    currentAmount: z.number().min(0).optional(),
    deadline: z.preprocess((arg) => {
      if (typeof arg === "string" || arg instanceof Date) {
        return new Date(arg);
      }
      return arg;
    }, z.date().min(new Date(), { message: "A data deve ser futura" })),
  });

  try {
    const paramsValidation = paramsSchema.safeParse(request.params);
    const bodyValidation = bodySchema.safeParse(request.body);

    if (!paramsValidation.success || !bodyValidation.success) {
      throw new z.ZodError([
        ...paramsValidation.error.errors,
        ...bodyValidation.error.errors,
      ]);
    }

    const { id } = paramsValidation.data;
    const data = bodyValidation.data;

    const goal = await goalService.updateGoal(id, data);

    if (!goal) {
      throw new AppError("Meta não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(goal);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  createGoal,
  listGoals,
  listGoalById,
  deleteGoal,
  updateGoal,
};
