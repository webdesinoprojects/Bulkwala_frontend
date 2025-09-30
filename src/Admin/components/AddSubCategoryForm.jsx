import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSubcategoryStore } from "../../store/subcategory.store.js";
import { useCategoryStore } from "../../store/category.store.js";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const AddSubCategoryForm = ({ onSuccess }) => {
  const { addSubcategory } = useSubcategoryStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: null,
    previewUrl: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    // Remove slug if empty
    if (!payload.slug || payload.slug.trim() === "") {
      delete payload.slug;
    }

    await addSubcategory(formData);
    onSuccess?.();
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Subcategory Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="slug"
            placeholder="Slug (auto-lowercased)"
            value={formData.slug}
            onChange={handleChange}
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Subcategory Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData({
                    ...formData,
                    image: file,
                    previewUrl: URL.createObjectURL(file),
                  });
                }
              }}
              required
            />
            {formData.previewUrl && (
              <img
                src={formData.previewUrl}
                alt="Preview"
                className="mt-2 h-20 object-cover rounded-md border"
              />
            )}
          </div>

          <Input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Parent Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
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
          </div>

          <Button type="submit">Add Subcategory</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSubCategoryForm;
