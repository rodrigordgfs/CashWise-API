import transactionRepository from "../repositories/transaction.repository.js";
import AppError from "../utils/error.js";

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
    const transactions = await transactionRepository.listTransactions(
      userId,
      type,
      date,
      date__gte,
      sort,
      search,
      limit
    );

    return transactions;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const listTransactionById = async (id) => {
  try {
    const transaction = await transactionRepository.listTransactionById(id);
    return transaction;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteTransaction = async (id) => {
  try {
    const transaction = await transactionRepository.deleteTransaction(id);
    return transaction;
  } catch (error) {
    throw new AppError(error.message);
  }
};

const updateTransaction = async (id, data) => {
  try {
    const transaction = await transactionRepository.updateTransaction(id, data);
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
