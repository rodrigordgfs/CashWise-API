import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import categoryService from "../services/category.service.js";

/**
 * Creates a new category for the authenticated user
 * @param {import('fastify').FastifyRequest} req - The request object containing category data
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves when category is created
 */
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

/**
 * Lists categories for the authenticated user with optional filtering and pagination
 * @param {import('fastify').FastifyRequest} req - The request object containing query parameters
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with paginated list of categories
 */
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

/**
 * Retrieves a specific category by its ID
 * @param {import('fastify').FastifyRequest} req - The request object containing category ID in params
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with category data
 */
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

/**
 * Deletes a category by its ID (only if no transactions are associated)
 * @param {import('fastify').FastifyRequest} req - The request object containing category ID in params
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves when category is deleted
 */
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

/**
 * Updates an existing category with new data
 * @param {import('fastify').FastifyRequest} req - The request object containing category ID and update data
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with updated category data
 */
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