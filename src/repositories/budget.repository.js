import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao acessar banco de dados", error.message);
};

const createBudget = async (userId, categoryId, limit, date) => {
  try {
    return await prisma.budget.create({
      data: {
        userId,
        categoryId,
        limit,
        date,
      },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logError(error);
  }
};

const listBudgets = async (userId) => {
  try {
    return await prisma.budget.findMany({
      where: {
        ...(userId && { userId }),
      },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logError(error);
  }
};

const listBudgetById = async (id) => {
  try {
    return await prisma.budget.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logError(error);
  }
};

const deleteBudget = async (id) => {
  try {
    return await prisma.budget.delete({
      where: { id },
    });
  } catch (error) {
    logError(error);
  }
};

const updateBudget = async (
  id,
  { userId, categoryId, icon, color, limit, date }
) => {
  try {
    return await prisma.budget.update({
      where: { id },
      data: {
        userId,
        categoryId,
        icon,
        color,
        limit,
        date,
      },
    });
  } catch (error) {
    logError(error);
  }
};

const listBudgetsByUser = async (userId) => {
  try {
    return await prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });
  } catch (error) {
    logError(error);
  }
};

const listBudgetsByCategory = async (categoryId) => {
  try {
    return await prisma.budget.findMany({
      where: { categoryId },
    });
  } catch (error) {
    logError(error);
  }
};

export default {
  createBudget,
  listBudgets,
  listBudgetById,
  deleteBudget,
  updateBudget,
  listBudgetsByUser,
  listBudgetsByCategory,
};
