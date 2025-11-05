import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(2, "Coupon code is required"),
  discountType: z.enum(["percentage", "flat"], {
    errorMap: () => ({ message: "Select valid discount type" }),
  }),
  discountValue: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Discount value must be greater than 0"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  minOrderValue: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  usageLimit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
});
