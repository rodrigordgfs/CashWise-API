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

const listCategories = async (userId, type) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        ...(userId && { userId }),
        ...(type && { type }),
      },
    });
    return categories;
  } catch (error) {
    logError(error);
  }
};

const listCategoriesWithTransactions = async (userId, limit, dateTransactionGte, dateTransactionLte) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        ...(userId && { userId }),
        Transaction: {
          some: {
            date: {
              ...(dateTransactionGte && { gte: new Date(dateTransactionGte) }),
              ...(dateTransactionLte && { lte: new Date(dateTransactionLte) }),
            }
          }
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

export default {
  createCategory,
  listCategories,
  listCategoryById,
  listCategoriesWithTransactions,
  deleteCategory,
  updateCategory,
};
