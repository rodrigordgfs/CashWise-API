import categoryRepository from "../repositories/category.repository.js";
import AppError from "../utils/error.js";

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

const listCategories = async (userId, type) => {
  try {
    const categories = await categoryRepository.listCategories(userId, type);
    return categories;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listCategoryById = async (id) => {
  try {
    const category = await categoryRepository.listCategoryById(id);
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteCategory = async (id) => {
  try {
    const existTransactionsInCategory = await categoryRepository.existTransactionsInCategory(id);

    if (existTransactionsInCategory) {
      throw new AppError("Não é possível excluir uma categoria que possui transações associadas.");
    }

    const category = await categoryRepository.deleteCategory(id);
    return category;
  } catch (error) {
    throw new AppError(error.message);
  }
};

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
