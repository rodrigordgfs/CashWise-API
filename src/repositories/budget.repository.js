import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

/**
 * Logs database errors and throws AppError
 * @param {Error} error - The database error to log
 * @throws {AppError} Always throws an AppError with database access message
 */
const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao acessar banco de dados", error.message);
};

/**
 * Creates a new budget in the database
 * @param {string} userId - The ID of the user creating the budget
 * @param {string} categoryId - The ID of the category for the budget
 * @param {number} limit - The budget limit amount
 * @param {Date} date - The date for the budget period
 * @returns {Promise<Object>} Promise that resolves with the created budget including category data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Lists budgets with optional user filtering
 * @param {string} [userId] - Optional user ID to filter budgets
 * @returns {Promise<Array>} Promise that resolves with array of budget objects including category data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Retrieves a specific budget by its ID
 * @param {string} id - The ID of the budget to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with budget data including category or null if not found
 * @throws {AppError} When database operation fails
 */
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

/**
 * Deletes a budget by its ID
 * @param {string} id - The ID of the budget to delete
 * @returns {Promise<Object>} Promise that resolves with deleted budget data
 * @throws {AppError} When database operation fails
 */
const deleteBudget = async (id) => {
  try {
    return await prisma.budget.delete({
      where: { id },
    });
  } catch (error) {
    logError(error);
  }
};

/**
 * Updates an existing budget with new data
 * @param {string} id - The ID of the budget to update
 * @param {Object} data - The data to update
 * @param {string} [data.categoryId] - The new category ID
 * @param {string} [data.icon] - The new icon
 * @param {string} [data.color] - The new color
 * @param {number} [data.limit] - The new limit amount
 * @param {Date} [data.date] - The new date
 * @returns {Promise<Object>} Promise that resolves with updated budget data
 * @throws {AppError} When database operation fails
 */
const updateBudget = async (id, { categoryId, icon, color, limit, date }) => {
  try {
    return await prisma.budget.update({
      where: { id },
      data: {
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

/**
 * Lists all budgets for a specific user
 * @param {string} userId - The ID of the user whose budgets to retrieve
 * @returns {Promise<Array>} Promise that resolves with array of budget objects including category data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Lists all budgets for a specific category
 * @param {string} categoryId - The ID of the category whose budgets to retrieve
 * @returns {Promise<Array>} Promise that resolves with array of budget objects
 * @throws {AppError} When database operation fails
 */
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