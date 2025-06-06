import budgetRepository from "../repositories/budget.repository.js";
import transactionRepository from "../repositories/transaction.repository.js";
import categoryRepository from "../repositories/category.repository.js";
import AppError from "../utils/error.js";
import { invalidateTransactionCache } from "../utils/invalidateTransactionCache.js";
import { saveRedisCache } from "../utils/saveRedisCache.js";
import { getRedisCache } from "../utils/getRedisCache.js"

const createBudget = async (userId, categoryId, limit, date) => {
  try {
    await budgetRepository.createBudget(userId, categoryId, limit, date);

    const category = await categoryRepository.listCategoryById(categoryId);
    const transactions = await transactionRepository.listByCategory(categoryId);
    const spent = Number(
      transactions.reduce((sum, tx) => sum + tx.amount, 0)
    ).toFixed(2);

    await invalidateTransactionCache("budgets");

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

const listBudgets = async (userId) => {
  try {
    const cache = getRedisCache("budgets", { userId });

    if (cache) {
      return cache;
    }

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

        await saveRedisCache(cacheKey, data);

        return data;
      })
    );

    return result;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listBudgetById = async (id) => {
  try {
    const cache = getRedisCache("budgets", { id });

    if (cache) {
      return cache;
    }

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

    await saveRedisCache(cacheKey, data);

    return;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteBudget = async (id) => {
  try {
    const deleted = await budgetRepository.deleteBudget(id);
    await invalidateTransactionCache("budgets");
    return { id: deleted.id, deleted: true };
  } catch (error) {
    throw new AppError(error.message);
  }
};

const updateBudget = async (
  id,
  userId,
  categoryId,
  icon,
  color,
  limit,
  date
) => {
  try {
    const budget = await budgetRepository.updateBudget(id, {
      userId,
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

    await invalidateTransactionCache("budgets");

    return {
      id: budget.id,
      userId,
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
