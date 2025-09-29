import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(5, "Description is required"),
  images: z
    .array(z.string().url("Must be a valid URL"))
    .nonempty("At least one image required"),
  videos: z.array(z.string().url("Must be a valid URL")).optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  discountPrice: z.number().min(0).optional(),
  stock: z.number().min(0, "Stock must be >= 0"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});
