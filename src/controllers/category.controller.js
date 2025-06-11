import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import categoryService from "../services/category.service.js";
import AppError, { handleErrorResponse } from "../utils/error.js";
import { getUserIdFromRequest } from "../utils/getUserId.js";

const createCategory = async (request, reply) => {
  const userId = await getUserIdFromRequest(request);

  const categorySchema = z.object({
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

    const { name, type, color, icon } = validation.data;

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

const listCategories = async (request, reply) => {
  const userId = await getUserIdFromRequest(request);

  const querySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
  });

  try {
    const validation = querySchema.safeParse(request.query);

    if (!validation.success) {
      throw validation.error;
    }

    const { type } = validation.data;

    const categories = await categoryService.listCategories(userId, type);

    reply.code(StatusCodes.OK).send(categories);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listCategoryById = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da categoria é obrigatório" }),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    const category = await categoryService.listCategoryById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(category);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteCategory = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da categoria é obrigatório" }),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    const category = await categoryService.deleteCategory(id);

    if (!category) {
      throw new AppError("Categoria não encontrada", StatusCodes.NOT_FOUND);
    }

    reply
      .code(StatusCodes.OK)
      .send({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const updateCategory = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da categoria é obrigatório" }),
  });

  const bodySchema = z.object({
    name: z.string().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
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

    const category = await categoryService.updateCategory(id, data);

    if (!category) {
      throw new AppError("Categoria não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(category);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  createCategory,
  listCategories,
  listCategoryById,
  deleteCategory,
  updateCategory,
};
