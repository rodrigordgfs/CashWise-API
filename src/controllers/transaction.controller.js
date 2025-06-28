import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import transactionService from "../services/transaction.service.js";
import AppError, { handleErrorResponse } from "../utils/error.js";
import { getUserIdFromRequest } from "../utils/getUserId.js";

const createTransaction = async (request, reply) => {
  const userId = await getUserIdFromRequest(request);

  const transactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    description: z.string().min(1),
    categoryId: z.string().min(1),
    date: z
      .string()
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime())),
    account: z.string().min(1),
    amount: z.number().min(0),
  });

  try {
    const validation = transactionSchema.safeParse(request.body);
    if (!validation.success) throw validation.error;

    const transaction = await transactionService.createTransaction(
      userId,
      ...Object.values(validation.data)
    );

    reply.code(StatusCodes.CREATED).send(transaction);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const createTransactionsFromOfx = async (request, reply) => {
  const userId = await getUserIdFromRequest(request);

  const transactionsOfxSchema = z.array(
    z.object({
      description: z.string().min(1),
      date: z
        .string()
        .transform((str) => new Date(str))
        .refine((date) => !isNaN(date.getTime())),
      amount: z
        .string()
        .transform((val) => parseFloat(val))
        .refine((num) => !isNaN(num) && num >= 0, {
          message: "Valor inválido",
        }),
      type: z.enum(["INCOME", "EXPENSE"]),
    })
  );
  try {
    const validation = transactionsOfxSchema.safeParse(request.body);
    if (!validation.success) throw validation.error;

    const transactions = await transactionService.createTransactionsFromOfx(
      userId,
      validation.data
    );

    reply.code(StatusCodes.CREATED).send(transactions);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listTransactions = async (request, reply) => {
  const userId = await getUserIdFromRequest(request);

  const querySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)))
      .optional(),
    date__gte: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)))
      .optional(),
    date__lte: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)))
      .optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z
      .string()
      .transform(Number)
      .refine((val) => val > 0, {
        message: "Page precisa ser maior que 0",
      })
      .optional(),

    perPage: z
      .string()
      .transform(Number)
      .refine((val) => val > 0, {
        message: "perPage precisa ser maior que 0",
      })
      .optional(),
  });

  try {
    const validation = querySchema.safeParse(request.query);
    if (!validation.success) throw validation.error;

    const {
      type,
      date,
      date__gte,
      date__lte,
      sort,
      search,
      page = 1,
      perPage = 10,
    } = validation.data;

    const { transactions, total } = await transactionService.listTransactions(
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

    const totalPages = Math.ceil(total / perPage);

    reply
      .header("x-total-count", total)
      .header("x-current-page", page)
      .header("x-per-page", perPage)
      .header("x-total-pages", totalPages)
      .code(StatusCodes.OK)
      .send(transactions);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listTransactionById = async (request, reply) => {
  const schema = z.object({ id: z.string() });

  try {
    const validation = schema.safeParse(request.params);
    if (!validation.success) throw validation.error;

    const { id } = validation.data;
    const transaction = await transactionService.listTransactionById(id);

    if (!transaction) throw new AppError("Transação não encontrada", 404);

    reply.code(StatusCodes.OK).send(transaction);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteTransaction = async (request, reply) => {
  const schema = z.object({ id: z.string() });

  try {
    const validation = schema.safeParse(request.params);
    if (!validation.success) throw validation.error;

    const { id } = validation.data;

    const transaction = await transactionService.deleteTransaction(id);
    if (!transaction) throw new AppError("Transação não encontrada", 404);

    reply
      .code(StatusCodes.OK)
      .send({ message: "Transação deletada com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const updateTransaction = async (request, reply) => {
  const paramsSchema = z.object({ id: z.string() });
  const bodySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    description: z.string().min(1).optional(),
    categoryId: z.string().min(1).optional(),
    date: z
      .string()
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime()))
      .optional(),
    account: z.string().min(1).optional(),
    amount: z.number().min(0).optional(),
  });

  try {
    const paramsValidation = paramsSchema.safeParse(request.params);
    const bodyValidation = bodySchema.safeParse(request.body);

    if (!paramsValidation.success || !bodyValidation.success) {
      throw new z.ZodError([
        ...paramsValidation.error.errors,
        ...bodyValidation.error.errors,
      ]);
    }

    const { id } = paramsValidation.data;
    const transaction = await transactionService.updateTransaction(
      id,
      bodyValidation.data
    );

    if (!transaction) throw new AppError("Transação não encontrada", 404);

    reply.code(StatusCodes.OK).send(transaction);
  } catch (error) {
    handleErrorResponse(error, reply);
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
