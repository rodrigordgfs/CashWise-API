import { z } from "zod";

export const basePeriodSchema = z.object({
  period__gte: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
  period__lte: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data inválida",
  }),
});

export const reportWithLimitSchema = basePeriodSchema.extend({
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: "O limite deve ser um número positivo",
    }),
});
