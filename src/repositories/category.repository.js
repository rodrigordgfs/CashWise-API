import prisma from "../libs/prisma.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const createCategory = async ({ userId, name, type, color, icon }) => {
  try {
    const category = await prisma.categories.create({
      data: {
        userId,
        name,
        type,
        color,
        icon,
      },
    });
    return category;
  } catch (error) {
    logError(error);
  }
};

export default {
  createCategory
};