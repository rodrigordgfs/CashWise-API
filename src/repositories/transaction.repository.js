import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao acessar o banco de dados", error.message);
};

const createTransaction = async (
  userId,
  type,
  description,
  categoryId,
  date,
  account,
  amount
) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        description,
        categoryId,
        date,
        account,
        amount,
      },
    });
    return transaction;
  } catch (error) {
    logError(error);
  }
};

const listTransactions = async (
  userId,
  type,
  date,
  date__gte,
  sort,
  search,
  limit
) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        ...(userId && { userId }),
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(date__gte && { date: { gte: new Date(date__gte) } }),
        ...(search && {
          OR: [
            { description: { contains: search, mode: "insensitive" } },
            { account: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: {
        description: sort === "desc" ? "desc" : "asc",
      },
      ...(limit && { take: limit }),
      select: {
        id: true,
        userId: true,
        type: true,
        description: true,
        date: true,
        account: true,
        amount: true,
        category: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return transactions;
  } catch (error) {
    logError(error);
  }
};

const listTransactionById = async (id) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });
    return transaction;
  } catch (error) {
    logError(error);
  }
};

const listByCategory = async (categoryId) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { categoryId },
      orderBy: { date: "desc" },
    });
    return transactions;
  } catch (error) {
    logError(error);
  }
};

const deleteTransaction = async (id) => {
  try {
    const transaction = await prisma.transaction.delete({
      where: { id },
    });
    return transaction;
  } catch (error) {
    logError(error);
  }
};

const updateTransaction = async (id, data) => {
  try {
    const transaction = await prisma.transaction.update({
      where: { id },
      data,
    });
    return transaction;
  } catch (error) {
    logError(error);
  }
};

export default {
  createTransaction,
  listTransactions,
  listTransactionById,
  listByCategory,
  deleteTransaction,
  updateTransaction,
};
