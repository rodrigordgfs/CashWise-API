import categoryRepository from "../repositories/category.repository.js";
import AppError from "../utils/error.js";
import { invalidateTransactionCache } from "../utils/invalidateTransactionCache.js";
import { saveRedisCache } from "../utils/saveRedisCache.js";
import { getRedisCache } from "../utils/getRedisCache.js";
import { generateCacheKey } from "../utils/generateCacheKey.js";

const createCategory = async (userId, name, type, color, icon) => {
  try {
    const category = await categoryRepository.createCategory(
      userId,
      name,
      type,
      color,
      icon
    );

    await invalidateTransactionCache("categories");
    await invalidateTransactionCache("goals");

    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listCategories = async (userId, type) => {
  try {
    const cacheKey = generateCacheKey("categories", { userId, type });
    const cache = await getRedisCache(cacheKey);

    if (cache) {
      return cache;
    }

    const categories = await categoryRepository.listCategories(userId, type);
    await saveRedisCache(cacheKey, categories);
    return categories;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listCategoryById = async (id) => {
  try {
    const cacheKey = generateCacheKey("categories", { id });
    const cache = await getRedisCache(cacheKey);

    if (cache) {
      return cache;
    }

    const category = await categoryRepository.listCategoryById(id);
    await saveRedisCache(cacheKey, category);
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await categoryRepository.deleteCategory(id);
    await invalidateTransactionCache("categories");
    await invalidateTransactionCache("goals");
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const updateCategory = async (id, data) => {
  try {
    const category = await categoryRepository.updateCategory(id, data);
    await invalidateTransactionCache("categories");
    await invalidateTransactionCache("goals");
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
