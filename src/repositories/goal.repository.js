import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

/**
 * Logs database errors and throws AppError
 * @param {Error} error - The database error to log
 * @throws {AppError} Always throws an AppError with goal creation message
 */
const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao criar a meta", error.message);
};

/**
 * Creates a new financial goal in the database
 * @param {string} userId - The ID of the user creating the goal
 * @param {string} categoryId - The ID of the category associated with the goal
 * @param {string} title - The title of the goal
 * @param {string} description - The description of the goal
 * @param {number} targetAmount - The target amount to achieve
 * @param {number} currentAmount - The current amount saved towards the goal
 * @param {Date} deadline - The deadline date for achieving the goal
 * @returns {Promise<Object>} Promise that resolves with the created goal including category data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Lists goals with optional user filtering
 * @param {string} [userId] - Optional user ID to filter goals
 * @returns {Promise<Array>} Promise that resolves with array of goal objects including category data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Retrieves a specific goal by its ID
 * @param {string} id - The ID of the goal to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with goal data including category or null if not found
 * @throws {AppError} When database operation fails
 */
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

/**
 * Deletes a goal by its ID
 * @param {string} id - The ID of the goal to delete
 * @returns {Promise<Object>} Promise that resolves with deleted goal data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Updates an existing goal with new data
 * @param {string} id - The ID of the goal to update
 * @param {Object} data - The data to update (categoryId, title, description, targetAmount, currentAmount, deadline)
 * @returns {Promise<Object>} Promise that resolves with updated goal data including category
 * @throws {AppError} When database operation fails
 */
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