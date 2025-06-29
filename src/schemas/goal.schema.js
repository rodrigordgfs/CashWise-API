import { z } from "zod";

export const createGoalSchema = z.object({
  categoryId: z
    .string({ required_error: "O ID da categoria é obrigatório" })
    .min(1, { message: "O ID da categoria é obrigatório" }),
  title: z.string({ required_error: "O título é obrigatório" }),
  description: z.string().min(1).optional(),
  targetAmount: z.number().min(0).optional(),
  currentAmount: z.number().min(0).optional(),
  deadline: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
    z.date().min(new Date(), { message: "A data deve ser futura" })
  ),
});

export const updateGoalSchema = createGoalSchema.partial();

export const idParamSchema = z.object({
  id: z.string({ required_error: "O ID da meta é obrigatório" }),
});
