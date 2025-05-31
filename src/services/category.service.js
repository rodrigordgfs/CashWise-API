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

export default {
  createCategory,
};
