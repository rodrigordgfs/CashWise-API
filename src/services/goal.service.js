import goalRepository from "../repositories/goal.repository.js";
import AppError from "../utils/error.js";

/**
 * Creates a new financial goal for a specific user
 * @param {string} userId - The ID of the user creating the goal
 * @param {string} categoryId - The ID of the category associated with the goal
 * @param {string} title - The title of the goal
 * @param {string} description - The description of the goal
 * @param {number} targetAmount - The target amount to achieve
 * @param {number} currentAmount - The current amount saved towards the goal
 * @param {Date} deadline - The deadline date for achieving the goal
 * @returns {Promise<Object>} Promise that resolves with the created goal data
 * @throws {AppError} When goal creation fails
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

/**
 * Lists all financial goals for a specific user
 * @param {string} userId - The ID of the user whose goals to retrieve
 * @returns {Promise<Array>} Promise that resolves with array of goal objects
 * @throws {AppError} When goal retrieval fails
 */
const listGoals = async (userId) => {
  try {
    const goals = await goalRepository.listGoals(userId);
    return goals;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Retrieves a specific goal by its ID
 * @param {string} id - The ID of the goal to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with goal data or null if not found
 * @throws {AppError} When goal retrieval fails
 */
const listGoalById = async (id) => {
  try {
    const goal = await goalRepository.listGoalById(id);
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Deletes a goal by its ID
 * @param {string} id - The ID of the goal to delete
 * @returns {Promise<Object>} Promise that resolves with deleted goal data
 * @throws {AppError} When goal deletion fails
 */
const deleteGoal = async (id) => {
  try {
    const goal = await goalRepository.deleteGoal(id);
    return goal;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Updates an existing goal with new data
 * @param {string} id - The ID of the goal to update
 * @param {Object} data - The data to update (categoryId, title, description, targetAmount, currentAmount, deadline)
 * @returns {Promise<Object>} Promise that resolves with updated goal data
 * @throws {AppError} When goal update fails
 */
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