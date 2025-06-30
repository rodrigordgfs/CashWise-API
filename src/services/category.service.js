import categoryRepository from "../repositories/category.repository.js";
import AppError from "../utils/error.js";

/**
 * Creates a new category for a specific user
 * @param {string} userId - The ID of the user creating the category
 * @param {string} name - The name of the category
 * @param {string} type - The type of category (INCOME or EXPENSE)
 * @param {string} color - The color code for the category
 * @param {string} icon - The icon identifier for the category
 * @returns {Promise<Object>} Promise that resolves with the created category data
 * @throws {AppError} When category creation fails
 */
const createCategory = async (userId, name, type, color, icon) => {
  try {
    const category = await categoryRepository.createCategory(
      userId,
      name,
      type,
      color,
      icon
    );

    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Lists categories for a specific user with optional filtering and pagination
 * @param {string} userId - The ID of the user whose categories to retrieve
 * @param {string} [type] - Optional filter by category type (INCOME or EXPENSE)
 * @param {number} [page=1] - The page number for pagination
 * @param {number} [perPage=10] - The number of items per page
 * @returns {Promise<Object>} Promise that resolves with categories array and total count
 * @throws {AppError} When category retrieval fails
 */
const listCategories = async (userId, type, page = 1, perPage = 10) => {
  try {
    return await categoryRepository.listCategories(userId, type, page, perPage);
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Retrieves a specific category by its ID
 * @param {string} id - The ID of the category to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with category data or null if not found
 * @throws {AppError} When category retrieval fails
 */
const listCategoryById = async (id) => {
  try {
    const category = await categoryRepository.listCategoryById(id);
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Deletes a category by its ID (only if no transactions are associated)
 * @param {string} id - The ID of the category to delete
 * @returns {Promise<Object>} Promise that resolves with deleted category data
 * @throws {AppError} When category has associated transactions or deletion fails
 */
const deleteCategory = async (id) => {
  try {
    const existTransactionsInCategory =
      await categoryRepository.existTransactionsInCategory(id);

    if (existTransactionsInCategory) {
      throw new AppError(
        "Não é possível excluir uma categoria que possui transações associadas."
      );
    }

    const category = await categoryRepository.deleteCategory(id);
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Updates an existing category with new data
 * @param {string} id - The ID of the category to update
 * @param {Object} data - The data to update (name, type, color, icon)
 * @returns {Promise<Object>} Promise that resolves with updated category data
 * @throws {AppError} When category update fails
 */
const updateCategory = async (id, data) => {
  try {
    const category = await categoryRepository.updateCategory(id, data);
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  createCategory,
  listCategories,
  listCategoryById,
  deleteCategory,
  updateCategory,
};