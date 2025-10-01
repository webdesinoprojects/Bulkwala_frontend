import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Title is required"),

  slug: z.string().optional(),

  description: z.string().min(5, "Description is required"),

  images: z
    .any()
    .refine(
      (files) => files && files.length > 0,
      "At least one image is required"
    ),

  videos: z.array(z.string().url("Invalid video URL")).optional(),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Price must be greater than 0"),

  discountPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val)))
    .refine((val) => val === undefined || val >= 0, {
      message: "Discount price must be >= 0",
    }),

  stock: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 0, "Stock must be >= 0"),

  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),

  tags: z.array(z.string()).optional(),

  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});
