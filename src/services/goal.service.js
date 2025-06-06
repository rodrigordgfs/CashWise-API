import goalRepository from "../repositories/goal.repository.js";
import AppError from "../utils/error.js";
import { invalidateTransactionCache } from "../utils/invalidateTransactionCache.js";
import { saveRedisCache } from "../utils/saveRedisCache.js";
import { getRedisCache } from "../utils/getRedisCache.js";

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
    const goal = await goalRepository.createGoal(
      userId,
      categoryId,
      title,
      description,
      targetAmount,
      currentAmount,
      deadline
    );

    await invalidateTransactionCache("goals");

    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listGoals = async (userId) => {
  try {
    const cache = getRedisCache("goals", { userId });

    if (cache) {
      return cache;
    }

    const goals = await goalRepository.listGoals(userId);
    await saveRedisCache(cacheKey, goals);
    return goals;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listGoalById = async (id) => {
  try {
    const cache = getRedisCache("goals", { id });

    if (cache) {
      return cache;
    }

    const goal = await goalRepository.listGoalById(id);
    await saveRedisCache(cacheKey, goal);
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteGoal = async (id) => {
  try {
    const goal = await goalRepository.deleteGoal(id);
    await invalidateTransactionCache("goals");
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const updateGoal = async (id, data) => {
  try {
    const goal = await goalRepository.updateGoal(id, data);
    await invalidateTransactionCache("goals");
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  createGoal,
  listGoals,
  listGoalById,
  deleteGoal,
  updateGoal,
};
