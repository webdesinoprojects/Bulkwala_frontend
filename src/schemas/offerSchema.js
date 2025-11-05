import { z } from "zod";

export const offerSchema = z.object({
  discountPercent: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0 && val <= 100, "Discount must be between 1–100%"),
});
