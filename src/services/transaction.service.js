import transactionRepository from "../repositories/transaction.repository.js";
import AppError from "../utils/error.js";

/**
 * Creates a new financial transaction for a specific user
 * @param {string} userId - The ID of the user creating the transaction
 * @param {string} type - The type of transaction (INCOME or EXPENSE)
 * @param {string} description - The description of the transaction
 * @param {string} categoryId - The ID of the category associated with the transaction
 * @param {Date} date - The date of the transaction
 * @param {string} account - The account used for the transaction
 * @param {number} amount - The amount of the transaction
 * @returns {Promise<Object>} Promise that resolves with the created transaction data
 * @throws {AppError} When transaction creation fails
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
    return await transactionRepository.createTransaction(
      userId,
      type,
      description,
      categoryId,
      date,
      account,
      amount
    );
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Creates multiple transactions from OFX data import
 * @param {string} userId - The ID of the user importing transactions
 * @param {Array} transactions - Array of transaction objects from OFX data
 * @returns {Promise<Object>} Promise that resolves with import result data
 * @throws {AppError} When transaction import fails
 */
const createTransactionsFromOfx = async (userId, transactions) => {
  try {
    return await transactionRepository.createTransactionsFromOfx(
      userId,
      transactions
    );
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Lists transactions for a specific user with advanced filtering and pagination
 * @param {string} userId - The ID of the user whose transactions to retrieve
 * @param {string} [type] - Optional filter by transaction type (INCOME or EXPENSE)
 * @param {Date} [date] - Optional filter by specific date
 * @param {Date} [date__gte] - Optional filter for dates greater than or equal to
 * @param {Date} [date__lte] - Optional filter for dates less than or equal to
 * @param {string} [sort] - Optional sort order (asc or desc)
 * @param {string} [search] - Optional search term for description or account
 * @param {number} [page=1] - The page number for pagination
 * @param {number} [perPage=10] - The number of items per page
 * @returns {Promise<Object>} Promise that resolves with transactions array and total count
 * @throws {AppError} When transaction retrieval fails
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
  perPage = 10
) => {
  return await transactionRepository.listTransactions(
    userId,
    type,
    date,
    date__gte,
    date__lte,
    sort,
    search,
    page,
    perPage
  );
};

/**
 * Retrieves a specific transaction by its ID
 * @param {string} id - The ID of the transaction to retrieve
 * @returns {Promise<Object|null>} Promise that resolves with transaction data or null if not found
 * @throws {AppError} When transaction retrieval fails
 */
const listTransactionById = async (id) => {
  try {
    return await transactionRepository.listTransactionById(id);
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Deletes a transaction by its ID
 * @param {string} id - The ID of the transaction to delete
 * @returns {Promise<Object>} Promise that resolves with deleted transaction data
 * @throws {AppError} When transaction deletion fails
 */
const deleteTransaction = async (id) => {
  try {
    return await transactionRepository.deleteTransaction(id);
  } catch (error) {
    throw new AppError(error.message);
  }
};

/**
 * Updates an existing transaction with new data
 * @param {string} id - The ID of the transaction to update
 * @param {Object} data - The data to update (type, description, categoryId, date, account, amount)
 * @returns {Promise<Object>} Promise that resolves with updated transaction data
 * @throws {AppError} When transaction update fails
 */
const updateTransaction = async (id, data) => {
  try {
    return await transactionRepository.updateTransaction(id, data);
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  createTransaction,
  createTransactionsFromOfx,
  listTransactions,
  listTransactionById,
  deleteTransaction,
  updateTransaction,
};