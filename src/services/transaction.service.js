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

const listTransactionById = async (id) => {
  try {
    return await transactionRepository.listTransactionById(id);
  } catch (error) {
    throw new AppError(error.message);
  }
};

const deleteTransaction = async (id) => {
  try {
    return await transactionRepository.deleteTransaction(id);
  } catch (error) {
    throw new AppError(error.message);
  }
};

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
