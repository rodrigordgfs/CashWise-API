import { StatusCodes } from "http-status-codes";
import AppError, { handleErrorResponse } from "../utils/error.js";
import transactionService from "../services/transaction.service.js";

const createTransaction = async (req, reply) => {
  try {
    const transaction = await transactionService.createTransaction(
      req.userId,
      ...Object.values(req.body)
    );
    reply.code(StatusCodes.CREATED).send(transaction);
  } catch (err) {
    handleErrorResponse(err, reply);
  }
};

const createTransactionsFromOfx = async (req, reply) => {
  try {
    const transactions = await transactionService.createTransactionsFromOfx(
      req.userId,
      req.body
    );
    reply.code(StatusCodes.CREATED).send(transactions);
  } catch (err) {
    handleErrorResponse(err, reply);
  }
};

const listTransactions = async (req, reply) => {
  try {
    const {
      type,
      date,
      date__gte,
      date__lte,
      sort,
      search,
      page = 1,
      perPage = 10,
    } = req.query;

    const { transactions, total } = await transactionService.listTransactions(
      req.userId,
      type,
      date,
      date__gte,
      date__lte,
      sort,
      search,
      page,
      perPage
    );

    const totalPages = Math.ceil(total / perPage);

    reply
      .header("x-total-count", total)
      .header("x-current-page", page)
      .header("x-per-page", perPage)
      .header("x-total-pages", totalPages)
      .code(StatusCodes.OK)
      .send(transactions);
  } catch (err) {
    handleErrorResponse(err, reply);
  }
};

const listTransactionById = async (req, reply) => {
  try {
    const transaction = await transactionService.listTransactionById(req.params.id);
    if (!transaction) throw new AppError("Transação não encontrada", 404);
    reply.code(StatusCodes.OK).send(transaction);
  } catch (err) {
    handleErrorResponse(err, reply);
  }
};

const deleteTransaction = async (req, reply) => {
  try {
    const deleted = await transactionService.deleteTransaction(req.params.id);
    if (!deleted) throw new AppError("Transação não encontrada", 404);
    reply.code(StatusCodes.OK).send({ message: "Transação deletada com sucesso" });
  } catch (err) {
    handleErrorResponse(err, reply);
  }
};

const updateTransaction = async (req, reply) => {
  try {
    const updated = await transactionService.updateTransaction(req.params.id, req.body);
    if (!updated) throw new AppError("Transação não encontrada", 404);
    reply.code(StatusCodes.OK).send(updated);
  } catch (err) {
    handleErrorResponse(err, reply);
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
