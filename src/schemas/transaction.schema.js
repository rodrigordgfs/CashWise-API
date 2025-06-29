import { z } from "zod";

const baseTransactionSchema = z.object({
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

export const createTransactionSchema = baseTransactionSchema;

export const updateTransactionSchema = baseTransactionSchema.partial();

export const createTransactionsFromOfxSchema = z.array(
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

export const querySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
  date__gte: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
  date__lte: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).optional(),
});

export const idParamSchema = z.object({ id: z.string() });