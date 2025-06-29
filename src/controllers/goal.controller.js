import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import goalService from "../services/goal.service.js";

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

const listGoals = async (req, reply) => {
  try {
    const goals = await goalService.listGoals(req.userId);
    reply.code(StatusCodes.OK).send(goals);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

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
