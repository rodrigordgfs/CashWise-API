import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao criar categoria", error.message);
};

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

export default {
  createCategory,
};
