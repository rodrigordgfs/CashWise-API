import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import budgetService from "../services/budget.service.js";

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

const listBudget = async (req, reply) => {
  try {
    const budgets = await budgetService.listBudgets(req.userId);
    reply.code(StatusCodes.OK).send(budgets);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

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
