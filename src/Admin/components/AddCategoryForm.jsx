import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCategoryStore } from "../../store/category.store.js";

const AddCategoryForm = ({ onSuccess }) => {
  const { addCategory } = useCategoryStore();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: null,
    previewUrl: "",
    banner: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCategory(formData);
    onSuccess?.();
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Category Name"
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

          {/* Image Upload (for img_url) */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Category Image
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

          <Button type="submit">Add Category</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm;
