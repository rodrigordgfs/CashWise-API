import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import categoryService from "../services/category.service.js";

const createCategory = async (req, reply) => {
  try {
    const { name, type, color, icon } = req.body;
    const category = await categoryService.createCategory(
      req.userId,
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

const listCategories = async (req, reply) => {
  try {
    const { type, page = 1, perPage = 10 } = req.query;
    const { categories, total } = await categoryService.listCategories(
      req.userId,
      type,
      page,
      perPage
    );

    const totalPages = Math.ceil(total / perPage);

    reply
      .header("x-total-count", total)
      .header("x-current-page", page)
      .header("x-per-page", perPage)
      .header("x-total-pages", totalPages)
      .code(StatusCodes.OK)
      .send(categories);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listCategoryById = async (req, reply) => {
  try {
    const category = await categoryService.listCategoryById(req.params.id);

    if (!category) {
      throw new AppError("Categoria não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(category);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteCategory = async (req, reply) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);

    if (!deleted) {
      throw new AppError("Categoria não encontrada", StatusCodes.NOT_FOUND);
    }

    reply
      .code(StatusCodes.OK)
      .send({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const updateCategory = async (req, reply) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

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
