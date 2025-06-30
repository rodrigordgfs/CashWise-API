import budgetRepository from "../repositories/budget.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";
import categoryRepository from "../repositories/category.repository.js";
import AppError from "../utils/error.js";

/**
 * Creates a new budget for a specific category and calculates spent amount
 * @param {string} userId - The ID of the user creating the budget
 * @param {string} categoryId - The ID of the category for the budget
 * @param {number} limit - The budget limit amount
 * @param {Date} date - The date for the budget period
 * @returns {Promise<Object>} Promise that resolves with the created budget data including spent amount
 * @throws {AppError} When budget creation fails
 */
const createBudget = async (userId, categoryId, limit, date) => {
  try {
    await budgetRepository.createBudget(userId, categoryId, limit, date);

    const category = await categoryRepository.listCategoryById(categoryId);
    const transactions = await transactionRepository.listByCategory(categoryId);
    const spent = Number(
      transactions.reduce((sum, tx) => sum + tx.amount, 0)
    ).toFixed(2);

    return {
      userId,
      category,
      limit,
      spent,
      date,
    };
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Lists all budgets for a specific user with calculated spent amounts
 * @param {string} userId - The ID of the user whose budgets to retrieve
 * @returns {Promise<Array>} Promise that resolves with array of budget objects including spent calculations
 * @throws {AppError} When budget retrieval fails
 */
const listBudgets = async (userId) => {
  try {
    const budgets = await budgetRepository.listBudgetsByUser(userId);

    const result = await Promise.all(
      budgets.map(async (budget) => {
        const category = await categoryRepository.listCategoryById(
          budget.categoryId
        );
        const transactions = await transactionRepository.listByCategory(
          budget.categoryId
        );
        const spent = Number(
          transactions.reduce((sum, tx) => sum + tx.amount, 0)
        ).toFixed(2);

        const data = {
          id: budget.id,
          userId: budget.userId,
          category,
          icon: budget.icon,
          color: budget.color,
          limit: budget.limit,
          spent,
          date: budget.date,
        };

        return data;
      })
    );

    return result;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Retrieves a specific budget by ID with calculated spent amount
 * @param {string} id - The ID of the budget to retrieve
 * @returns {Promise<Object>} Promise that resolves with budget data including spent calculation
 * @throws {AppError} When budget retrieval fails
 */
const listBudgetById = async (id) => {
  try {
    const budget = await budgetRepository.listBudgetById(id);

    const category = await categoryRepository.listCategoryById(
      budget.categoryId
    );
    const transactions = await transactionRepository.listByCategory(
      budget.categoryId
    );
    const spent = Number(
      transactions.reduce((sum, tx) => sum + tx.amount, 0)
    ).toFixed(2);

    const data = {
      id: budget.id,
      userId: budget.userId,
      category,
      icon: budget.icon,
      color: budget.color,
      limit: budget.limit,
      spent,
      date: budget.date,
    };

    return data;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Deletes a budget by its ID
 * @param {string} id - The ID of the budget to delete
 * @returns {Promise<Object>} Promise that resolves with deletion confirmation
 * @throws {AppError} When budget deletion fails
 */
const deleteBudget = async (id) => {
  try {
    const deleted = await budgetRepository.deleteBudget(id);
    return { id: deleted.id, deleted: true };
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Updates an existing budget with new data and recalculates spent amount
 * @param {string} id - The ID of the budget to update
 * @param {string} categoryId - The new category ID (optional)
 * @param {string} icon - The new icon (optional)
 * @param {string} color - The new color (optional)
 * @param {number} limit - The new limit amount (optional)
 * @param {Date} date - The new date (optional)
 * @returns {Promise<Object>} Promise that resolves with updated budget data including spent calculation
 * @throws {AppError} When budget update fails
 */
const updateBudget = async (id, categoryId, icon, color, limit, date) => {
  try {
    const budget = await budgetRepository.updateBudget(id, {
      categoryId,
      icon,
      color,
      limit,
      date,
    });

    const category = await categoryRepository.listCategoryById(categoryId);
    const transactions = await transactionRepository.listByCategory(categoryId);
    const spent = Number(
      transactions.reduce((sum, tx) => sum + tx.amount, 0)
    ).toFixed(2);

    return {
      id: budget.id,
      userId: budget.userId,
      category,
      icon,
      color,
      limit,
      spent,
      date,
    };
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  createBudget,
  listBudgets,
  listBudgetById,
  deleteBudget,
  updateBudget,
};