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
  limit: z.coerce.number().int().min(1).optional(),
});