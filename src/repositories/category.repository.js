import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

/**
 * Logs database errors and throws AppError
 * @param {Error} error - The database error to log
 * @throws {AppError} Always throws an AppError with category creation message
 */
const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao criar categoria", error.message);
};

/**
 * Creates a new category in the database
 * @param {string} userId - The ID of the user creating the category
 * @param {string} name - The name of the category
 * @param {string} type - The type of category (INCOME or EXPENSE)
 * @param {string} color - The color code for the category
 * @param {string} icon - The icon identifier for the category
 * @returns {Promise<Object>} Promise that resolves with the created category data
 * @throws {AppError} When database operation fails
 */
const createCategory = async (userId, name, type, color, icon) => {
  try {
    const category = await prisma.category.create({
      data: {
        userId,
        color,
        icon,
        name,
        type,
      },
    });
    return category;
  } catch (error) {
    logError(error);
  }
};

/**
 * Lists categories with optional filtering and pagination
 * @param {string} [userId] - Optional user ID to filter categories
 * @param {string} [type] - Optional category type filter (INCOME or EXPENSE)
 * @param {number} [page=1] - The page number for pagination
 * @param {number} [perPage=10] - The number of items per page
 * @returns {Promise<Object>} Promise that resolves with categories array and total count
 * @throws {AppError} When database operation fails
 */
const listCategories = async (userId, type, page = 1, perPage = 10) => {
  try {
    const skip = perPage ? Math.max(0, (page - 1) * perPage) : undefined;

    const where = {
      ...(userId && { userId }),
      ...(type && { type }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: perPage || undefined,
      }),
      prisma.category.count({ where }),
    ]);

    return { categories, total };
  } catch (error) {
    logError(error);
  }
};

/**
 * Lists categories that have transactions within a specified date range
 * @param {string} [userId] - Optional user ID to filter categories
 * @param {number} [limit] - Optional limit for number of categories to return
 * @param {Date} [dateTransactionGte] - Optional start date filter for transactions
 * @param {Date} [dateTransactionLte] - Optional end date filter for transactions
 * @returns {Promise<Array>} Promise that resolves with array of categories including their transactions
 * @throws {AppError} When database operation fails
 */
const listCategoriesWithTransactions = async (
  userId,
  limit,
  dateTransactionGte,
  dateTransactionLte
) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        ...(userId && { userId }),
        Transaction: {
          some: {
            date: {
              ...(dateTransactionGte && { gte: new Date(dateTransactionGte) }),
              ...(dateTransactionLte && { lte: new Date(dateTransactionLte) }),
            },
          },
        },
      },
      take: limit || undefined,
      orderBy: {
        Transaction: {
          _count: "desc",
        },
      },
      include: {
        Transaction: true,
      },
    });
    return categories;
  } catch (error) {
    logError(error);
  }
};

/**
 * Retrieves a specific category by its ID
 * @param {string} id - The ID of the category to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with category data or null if not found
 * @throws {AppError} When database operation fails
 */
const listCategoryById = async (id) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    logError(error);
  }
};

/**
 * Deletes a category by its ID
 * @param {string} id - The ID of the category to delete
 * @returns {Promise<Object>} Promise that resolves with deleted category data
 * @throws {AppError} When database operation fails
 */
const deleteCategory = async (id) => {
  try {
    const category = await prisma.category.delete({
      where: { id },
    });
    return category;
  } catch (error) {
    logError(error);
  }
};

/**
 * Updates an existing category with new data
 * @param {string} id - The ID of the category to update
 * @param {Object} data - The data to update (name, type, color, icon)
 * @returns {Promise<Object>} Promise that resolves with updated category data
 * @throws {AppError} When database operation fails
 */
const updateCategory = async (id, data) => {
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return category;
  } catch (error) {
    logError(error);
  }
};

/**
 * Checks if a category has associated transactions
 * @param {string} id - The ID of the category to check
 * @returns {Promise<boolean>} Promise that resolves with true if transactions exist, false otherwise
 * @throws {AppError} When database operation fails
 */
const existTransactionsInCategory = async (id) => {
  try {
    const count = await prisma.transaction.count({
      where: { categoryId: id },
    });
    return count > 0;
  } catch (error) {
    logError(error);
  }
};

export default {
  createCategory,
  listCategories,
  listCategoryById,
  listCategoriesWithTransactions,
  deleteCategory,
  updateCategory,
  existTransactionsInCategory,
};