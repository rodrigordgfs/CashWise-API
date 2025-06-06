import goalRepository from "../repositories/goal.repository.js";
import AppError from "../utils/error.js";

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

    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listGoals = async (userId) => {
  try {
    const goals = await goalRepository.listGoals(userId);
    return goals;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listGoalById = async (id) => {
  try {
    const goal = await goalRepository.listGoalById(id);
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteGoal = async (id) => {
  try {
    const goal = await goalRepository.deleteGoal(id);
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const updateGoal = async (id, data) => {
  try {
    const goal = await goalRepository.updateGoal(id, data);
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
