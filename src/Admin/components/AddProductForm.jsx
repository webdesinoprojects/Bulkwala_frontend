import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useProductStore } from "../../store/product.store.js";
import { useCategoryStore } from "../../store/category.store.js";
import { useSubcategoryStore } from "../../store/subcategory.store.js";
import { productSchema } from "../../schemas/productSchema.js";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AddProductForm = ({ onSuccess }) => {
  const { addProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  const [previewUrls, setPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: "",
      stock: "",
      images: [],
      category: "",
      subcategory: "",
      tags: [],
      isActive: true,
      isFeatured: false,
    },
  });

  const categoryValue = watch("category");

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [fetchCategories, fetchSubcategories]);

  // ✅ Only send raw data now, service will convert to FormData
  const onSubmit = async (data) => {
    try {
      await addProduct(data);
      toast.success("Product added successfully!");
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  // ✅ Filter subcategories by category
  const filteredSubcategories = categoryValue
    ? subcategories.filter(
        (sc) => String(sc.category?._id) === String(categoryValue)
      )
    : [];

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <Input
            type="text"
            placeholder="Product Title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          {/* Slug (optional) */}
          <Input
            type="text"
            placeholder="Slug (optional)"
            {...register("slug")}
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

          {/* Description */}
          <Input
            type="text"
            placeholder="Product Description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          {/* Price */}
          <Input type="number" placeholder="Price" {...register("price")} />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}

          {/* Stock */}
          <Input type="number" placeholder="Stock" {...register("stock")} />
          {errors.stock && (
            <p className="text-red-500">{errors.stock.message}</p>
          )}

          {/* Images with preview */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Product Images
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setValue("images", files); // RHF value
                setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
              }}
            />
            {errors.images && (
              <p className="text-red-500">{errors.images.message}</p>
            )}

            <div className="mt-2 flex gap-2 flex-wrap">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Preview"
                  className="h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <Input
            type="text"
            placeholder="Tags (comma separated)"
            onChange={(e) =>
              setValue(
                "tags",
                e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
              )
            }
          />
          {errors.tags && <p className="text-red-500">{errors.tags.message}</p>}

          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Category</label>
            <Select
              onValueChange={(value) => setValue("category", value)}
              value={categoryValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Subcategory Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Subcategory
            </label>
            <Select
              onValueChange={(value) => setValue("subcategory", value)}
              value={watch("subcategory")}
              disabled={!categoryValue}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subcategory && (
              <p className="text-red-500">{errors.subcategory.message}</p>
            )}
          </div>

          {/* Active / Featured checkboxes */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isActive")} defaultChecked />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isFeatured")} />
              Featured
            </label>
          </div>

          <Button type="submit" disabled={loading}>
            {" "}
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
