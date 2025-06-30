import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import budgetService from "../services/budget.service.js";

/**
 * Creates a new budget for a specific category
 * @param {import('fastify').FastifyRequest} req - The request object containing budget data
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves when budget is created
 */
const createBudget = async (req, reply) => {
  try {
    const { categoryId, limit, date } = req.body;
    const budget = await budgetService.createBudget(
      req.userId,
      categoryId,
      limit,
      new Date(date)
    );
    reply.code(StatusCodes.CREATED).send(budget);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Lists all budgets for the authenticated user
 * @param {import('fastify').FastifyRequest} req - The request object
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with list of budgets
 */
const listBudget = async (req, reply) => {
  try {
    const budgets = await budgetService.listBudgets(req.userId);
    reply.code(StatusCodes.OK).send(budgets);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Retrieves a specific budget by its ID
 * @param {import('fastify').FastifyRequest} req - The request object containing budget ID in params
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with budget data
 */
const listBudgetById = async (req, reply) => {
  try {
    const budget = await budgetService.listBudgetById(req.params.id);
    if (!budget) {
      throw new AppError("Orçamento não encontrado", StatusCodes.NOT_FOUND);
    }
    reply.code(StatusCodes.OK).send(budget);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Deletes a budget by its ID
 * @param {import('fastify').FastifyRequest} req - The request object containing budget ID in params
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves when budget is deleted
 */
const deleteBudget = async (req, reply) => {
  try {
    const deleted = await budgetService.deleteBudget(req.params.id);
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

/**
 * Updates an existing budget with new data
 * @param {import('fastify').FastifyRequest} req - The request object containing budget ID and update data
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with updated budget data
 */
const updateBudget = async (req, reply) => {
  try {
    const { categoryId, icon, color, limit, date } = req.body;
    const updated = await budgetService.updateBudget(
      req.params.id,
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