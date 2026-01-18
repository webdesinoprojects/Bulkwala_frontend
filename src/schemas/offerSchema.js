import { z } from "zod";

export const offerSchema = z.object({
  discountPercent: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine(
      (val) => !isNaN(val) && val > 0 && val <= 100,
      "Discount must be between 1–100%"
    ),

  maxDiscountAmount: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine(
      (val) => !isNaN(val) && val >= 1 && val <= 100000,
      "Max discount must be between ₹1 and ₹100000"
    ),

  startDateTime: z.string().min(1, "Start date and time is required"),
  
  endDateTime: z.string().min(1, "End date and time is required"),
}).refine((data) => new Date(data.startDateTime) < new Date(data.endDateTime), {
  message: "End date/time must be after start date/time",
  path: ["endDateTime"],
});
