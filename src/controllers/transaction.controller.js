import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import transactionService from "../services/transaction.service.js";
import AppError, { handleErrorResponse } from "../utils/error.js";
import { getUserIdFromRequest } from "../utils/getUserId.js";

const createTransaction = async (request, reply) => {
  const userId = await getUserIdFromRequest(request);

  const transactionSchema = z.object({
    userId: z.string().min(1, { message: "O ID do usuário é obrigatório" }),
    type: z.enum(["INCOME", "EXPENSE"], {
      required_error: "O tipo de transação é obrigatório",
    }),
    description: z.string().min(1, "A descrição é obrigatória"),
    categoryId: z.string().min(1, "O ID da categoria é obrigatório"),
    date: z
      .string({ required_error: "A data é obrigatória" })
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Data inválida",
      })
      .refine((date) => date >= new Date(0), {
        message: "A data é obrigatória",
      }),
    account: z.string().min(1, "A conta é obrigatória"),
    amount: z.number().min(0, "O valor deve ser positivo"),
  });

  try {
    const validation = transactionSchema.safeParse(request.body);

    if (!validation.success) {
      throw validation.error;
    }

    const { type, description, categoryId, date, account, amount } =
      validation.data;

    const transaction = await transactionService.createTransaction(
      userId,
      type,
      description,
      categoryId,
      date,
      account,
      amount
    );

    reply.code(StatusCodes.CREATED).send(transaction);
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
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data inválida",
      })
      .optional(),
    date__gte: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data inválida",
      })
      .optional(),
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().min(1).optional(),
    limit: z
      .string()
      .transform(Number)
      .refine((val) => !isNaN(val), {
        message: "O limite deve ser um número válido",
      })
      .optional(),
  });

  try {
    const validation = querySchema.safeParse(request.query);

    if (!validation.success) {
      throw validation.error;
    }

    const { type, date, sort, search, limit, date__gte } = validation.data;

    const transactions = await transactionService.listTransactions(
      userId,
      type,
      date,
      date__gte,
      sort,
      search,
      limit
    );

    reply.code(StatusCodes.OK).send(transactions);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const listTransactionById = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da transação é obrigatório" }),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;
    const transaction = await transactionService.listTransactionById(id);
    if (!transaction) {
      throw new AppError("Transação não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(transaction);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const deleteTransaction = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da transação é obrigatório" }),
  });

  try {
    const validation = paramsSchema.safeParse(request.params);

    if (!validation.success) {
      throw validation.error;
    }

    const { id } = validation.data;

    const transaction = await transactionService.deleteTransaction(id);

    if (!transaction) {
      throw new AppError("Transação não encontrada", StatusCodes.NOT_FOUND);
    }

    reply
      .code(StatusCodes.OK)
      .send({ message: "Transação deletada com sucesso" });
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

const updateTransaction = async (request, reply) => {
  const paramsSchema = z.object({
    id: z.string({ required_error: "O ID da transação é obrigatório" }),
  });

  const bodySchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    description: z.string().min(1, "A descrição é obrigatória").optional(),
    categoryId: z.string().min(1, "O ID da categoria é obrigatório").optional(),
    date: z
      .string({ required_error: "A data é obrigatória" })
      .transform((str) => new Date(str))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Data inválida",
      })
      .refine((date) => date >= new Date(0), {
        message: "A data é obrigatória",
      })
      .optional(),
    account: z.string().min(1, "A conta é obrigatória").optional(),
    amount: z.number().min(0, "O valor deve ser positivo").optional(),
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
    const data = bodyValidation.data;

    const transaction = await transactionService.updateTransaction(id, data);

    if (!transaction) {
      throw new AppError("Transação não encontrada", StatusCodes.NOT_FOUND);
    }

    reply.code(StatusCodes.OK).send(transaction);
  } catch (error) {
    handleErrorResponse(error, reply);
  }
};

export default {
  createTransaction,
  listTransactions,
  listTransactionById,
  deleteTransaction,
  updateTransaction,
};
