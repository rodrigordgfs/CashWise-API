import { z } from "zod";

export const categorySchema = z.object({
  name: z.string({ required_error: "O nome da categoria é obrigatório" }),
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "O tipo de categoria é obrigatório",
  }),
  color: z
    .string({ required_error: "A cor é obrigatória" })
    .min(1, "A cor não pode estar vazia"),
  icon: z
    .string({ required_error: "O ícone é obrigatório" })
    .min(1, "O ícone não pode estar vazio"),
});

export const updateCategorySchema = categorySchema.partial();

export const idParamSchema = z.object({
  id: z.string({ required_error: "O ID da categoria é obrigatório" }),
});

export const categoryQuerySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).optional(),
});