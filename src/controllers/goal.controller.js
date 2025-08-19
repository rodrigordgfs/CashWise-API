import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import goalService from "../services/goal.service.js";

/**
 * Creates a new financial goal for the authenticated user
 * @param {import('fastify').FastifyRequest} req - The request object containing goal data
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves when goal is created
 */
const createGoal = async (req, reply) => {
  try {
    const goal = await goalService.createGoal(
      req.userId,
      req.body.categoryId,
      req.body.title,
      req.body.description,
      req.body.targetAmount,
      req.body.currentAmount,
      req.body.deadline
    );
    reply.code(StatusCodes.CREATED).send(goal);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Lists all financial goals for the authenticated user
 * @param {import('fastify').FastifyRequest} req - The request object
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with list of goals
 */
const listGoals = async (req, reply) => {
  try {
    const goals = await goalService.listGoals(req.userId);
    reply.code(StatusCodes.OK).send(goals);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Retrieves a specific goal by its ID
 * @param {import('fastify').FastifyRequest} req - The request object containing goal ID in params
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with goal data
 */
const listGoalById = async (req, reply) => {
  try {
    const goal = await goalService.listGoalById(req.params.id);
    if (!goal) {
      throw new AppError("Meta não encontrada", StatusCodes.NOT_FOUND);
    }
    reply.code(StatusCodes.OK).send(goal);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Deletes a goal by its ID
 * @param {import('fastify').FastifyRequest} req - The request object containing goal ID in params
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves when goal is deleted
 */
const deleteGoal = async (req, reply) => {
  try {
    const deleted = await goalService.deleteGoal(req.params.id);
    if (!deleted) {
      throw new AppError("Meta não encontrada", StatusCodes.NOT_FOUND);
    }
    reply.code(StatusCodes.OK).send({ message: "Meta deletada com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

/**
 * Updates an existing goal with new data
 * @param {import('fastify').FastifyRequest} req - The request object containing goal ID and update data
 * @param {import('fastify').FastifyReply} reply - The reply object to send response
 * @returns {Promise<void>} Promise that resolves with updated goal data
 */
const updateGoal = async (req, reply) => {
  try {
    const goal = await goalService.updateGoal(req.params.id, req.body);
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