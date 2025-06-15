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
    return await prisma.transaction.create({
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
  } catch (error) {
    logError(error);
  }
};

const listTransactions = async (
  userId,
  type,
  date,
  date__gte,
  date__lte,
  sort,
  search,
  page = 1,
  perPage = 10
) => {
  try {
    const skip = Math.max(0, (page - 1) * perPage);

    const where = {
      ...(userId && { userId }),
      ...(type && { type }),
      ...(date && { date: new Date(date) }),
      ...(date__gte && { date: { gte: new Date(date__gte) } }),
      ...(date__lte && {
        date: {
          ...(date__gte ? { gte: new Date(date__gte) } : {}),
          lte: new Date(date__lte),
        },
      }),
      ...(search && {
        OR: [
          { description: { contains: search, mode: "insensitive" } },
          { account: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { date: sort === "desc" ? "desc" : "asc" },
        skip,
        take: perPage,
        select: {
          id: true,
          userId: true,
          type: true,
          description: true,
          date: true,
          account: true,
          amount: true,
          paid: true,
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
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total };
  } catch (error) {
    logError(error);
  }
};

const listTransactionById = async (id) => {
  try {
    return await prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch (error) {
    logError(error);
  }
};

const deleteTransaction = async (id) => {
  try {
    return await prisma.transaction.delete({ where: { id } });
  } catch (error) {
    logError(error);
  }
};

const updateTransaction = async (id, data) => {
  try {
    return await prisma.transaction.update({ where: { id }, data });
  } catch (error) {
    logError(error);
  }
};

export default {
  createTransaction,
  listTransactions,
  listTransactionById,
  deleteTransaction,
  updateTransaction,
};
