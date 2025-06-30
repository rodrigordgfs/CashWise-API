import prisma from "../libs/prisma.js";
import AppError from "../utils/error.js";

/**
 * Logs database errors and throws AppError
 * @param {Error} error - The database error to log
 * @throws {AppError} Always throws an AppError with database access message
 */
const logError = (error) => {
  console.error("Database Error:", error);
  throw new AppError("Erro ao acessar o banco de dados", error.message);
};

/**
 * Creates a new transaction in the database
 * @param {string} userId - The ID of the user creating the transaction
 * @param {string} type - The type of transaction (INCOME or EXPENSE)
 * @param {string} description - The description of the transaction
 * @param {string} categoryId - The ID of the category associated with the transaction
 * @param {Date} date - The date of the transaction
 * @param {string} account - The account used for the transaction
 * @param {number} amount - The amount of the transaction
 * @returns {Promise<Object>} Promise that resolves with the created transaction data
 * @throws {AppError} When database operation fails
 */
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

/**
 * Creates multiple transactions from OFX data import
 * @param {string} userId - The ID of the user importing transactions
 * @param {Array} transactions - Array of transaction objects from OFX data
 * @returns {Promise<Object>} Promise that resolves with batch creation result
 * @throws {AppError} When database operation fails
 */
const createTransactionsFromOfx = async (userId, transactions) => {
  try {
    const formattedTransactions = transactions.map((transaction) => ({
      userId,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date,
      amount: transaction.amount,
    }));

    return await prisma.transaction.createMany({
      data: formattedTransactions,
    });
  } catch (error) {
    logError(error);
  }
}

/**
 * Lists transactions with advanced filtering, sorting, and pagination
 * @param {string} [userId] - Optional user ID to filter transactions
 * @param {string} [type] - Optional transaction type filter (INCOME or EXPENSE)
 * @param {Date} [date] - Optional specific date filter
 * @param {Date} [date__gte] - Optional start date filter (greater than or equal)
 * @param {Date} [date__lte] - Optional end date filter (less than or equal)
 * @param {string} [sort] - Optional sort order (asc or desc)
 * @param {string} [search] - Optional search term for description or account
 * @param {number} [page=1] - The page number for pagination
 * @param {number} [perPage] - The number of items per page
 * @returns {Promise<Object>} Promise that resolves with transactions array and total count
 * @throws {AppError} When database operation fails
 */
const listTransactions = async (
  userId,
  type,
  date,
  date__gte,
  date__lte,
  sort,
  search,
  page = 1,
  perPage
) => {
  try {
    const skip = perPage ? Math.max(0, (page - 1) * perPage) : undefined;

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
        take: perPage || undefined,
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

/**
 * Lists all transactions for a specific category
 * @param {string} categoryId - The ID of the category whose transactions to retrieve
 * @returns {Promise<Array>} Promise that resolves with array of transaction objects including category data
 * @throws {AppError} When database operation fails
 */
const listByCategory = async (categoryId) => {
  try {
    return await prisma.transaction.findMany({
      where: { categoryId },
      orderBy: { date: "desc" },
      include: { category: true },
    });
  } catch (error) {
    logError(error);
  }
};

/**
 * Retrieves a specific transaction by its ID
 * @param {string} id - The ID of the transaction to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with transaction data including category or null if not found
 * @throws {AppError} When database operation fails
 */
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

/**
 * Deletes a transaction by its ID
 * @param {string} id - The ID of the transaction to delete
 * @returns {Promise<Object>} Promise that resolves with deleted transaction data
 * @throws {AppError} When database operation fails
 */
const deleteTransaction = async (id) => {
  try {
    return await prisma.transaction.delete({ where: { id } });
  } catch (error) {
    logError(error);
  }
};

/**
 * Updates an existing transaction with new data
 * @param {string} id - The ID of the transaction to update
 * @param {Object} data - The data to update (type, description, categoryId, date, account, amount)
 * @returns {Promise<Object>} Promise that resolves with updated transaction data
 * @throws {AppError} When database operation fails
 */
const updateTransaction = async (id, data) => {
  try {
    return await prisma.transaction.update({ where: { id }, data });
  } catch (error) {
    logError(error);
  }
};

export default {
  createTransaction,
  createTransactionsFromOfx,
  listTransactions,
  listTransactionById,
  deleteTransaction,
  updateTransaction,
  listByCategory
};