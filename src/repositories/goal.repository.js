import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao criar a meta", error.message);
};

const createGoal = async (
  userId,
  categoryId,
  title,
  description,
  targetAmount,
  currentAmount,
  deadline
) => {
  try {
    const goal = await prisma.goal.create({
      data: {
        userId,
        categoryId,
        title,
        description,
        targetAmount,
        currentAmount,
        deadline,
      },
      include: {
        category: true,
      },
    });
    return goal;
  } catch (error) {
    logError(error);
  }
};

const listGoals = async (userId) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        ...(userId && { userId }),
      },
      include: {
        category: true,
      },
    });
    return goals;
  } catch (error) {
    logError(error);
  }
};

const listGoalById = async (id) => {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return goal;
  } catch (error) {
    logError(error);
  }
};

const deleteGoal = async (id) => {
  try {
    const goal = await prisma.goal.delete({
      where: { id },
    });
    return goal;
  } catch (error) {
    logError(error);
  }
};

const updateGoal = async (id, data) => {
  try {
    const goal = await prisma.goal.update({
      where: { id },
      include: {
        category: true,
      },
      data,
    });
    return goal;
  } catch (error) {
    logError(error);
  }
};

export default {
  createGoal,
  listGoals,
  listGoalById,
  deleteGoal,
  updateGoal,
};
