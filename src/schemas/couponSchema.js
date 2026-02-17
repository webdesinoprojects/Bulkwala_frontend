import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(2, "Coupon code is required"),
  couponType: z.enum(["standard", "flashOffer"], {
    errorMap: () => ({
      message: "Coupon type must be either 'standard' or 'flashOffer'",
    }),
  }).default("standard"),
  discountType: z.enum(["percentage", "flat"], {
    errorMap: () => ({
      message: "Discount type must be either 'percentage' or 'flat'",
    }),
  }),
  discountValue: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Discount value must be greater than 0"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  flashOfferExpiryTime: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}:\d{2}$/.test(val),
      "Flash offer expiry time must be in HH:MM format"
    ),
  minOrderValue: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  usageLimit: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  maxDiscountAmount: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
});
