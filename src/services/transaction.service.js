import transactionRepository from "../repositories/transaction.repository.js";
import AppError from "../utils/error.js";
import { invalidateTransactionCache } from "../utils/invalidateTransactionCache.js";
import { saveRedisCache } from "../utils/saveRedisCache.js";
import { getRedisCache } from "../utils/getRedisCache.js";

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
    const transaction = await transactionRepository.createTransaction(
      userId,
      type,
      description,
      categoryId,
      date,
      account,
      amount
    );

    await invalidateTransactionCache("transactions");

    return transaction;
  } catch (error) {
    throw new AppError(error.message);
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
    const cache = getRedisCache("transactions", {
      userId,
      type,
      date,
      date__gte,
      sort,
      search,
      limit,
    });

    if (cache) {
      return cache;
    }

    const transactions = await transactionRepository.listTransactions(
      userId,
      type,
      date,
      date__gte,
      sort,
      search,
      limit
    );

    await saveRedisCache(cacheKey, transactions);

    return transactions;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listTransactionById = async (id) => {
  try {
    const cache = getRedisCache("transactions", { id });

    if (cache) {
      return cache;
    }

    const transaction = await transactionRepository.listTransactionById(id);
    await saveRedisCache(cacheKey, transaction);
    return transaction;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteTransaction = async (id) => {
  try {
    const transaction = await transactionRepository.deleteTransaction(id);
    await invalidateTransactionCache("transactions");
    return transaction;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const updateTransaction = async (id, data) => {
  try {
    const transaction = await transactionRepository.updateTransaction(id, data);
    await invalidateTransactionCache("transactions");
    return transaction;
  } catch (error) {
    throw new AppError(error.message);
  }
};

export default {
  createTransaction,
  listTransactions,
  listTransactionById,
  deleteTransaction,
  updateTransaction,
};
