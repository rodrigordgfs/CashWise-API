import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().min(1, "O ID da categoria é obrigatório"),
  limit: z.number(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
});

export const updateBudgetSchema = z.object({
  categoryId: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  limit: z.number().optional(),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Data inválida",
    }),
});

export const idParamSchema = z.object({
  id: z.string().min(1, "O ID do orçamento é obrigatório"),
});
