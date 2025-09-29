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
    img_url: "",
    banner: [""],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBannerChange = (index, value) => {
    const updated = [...formData.banner];
    updated[index] = value;
    setFormData({ ...formData, banner: updated });
  };

  const addBannerField = () => {
    setFormData({ ...formData, banner: [...formData.banner, ""] });
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
            required
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
                  // You’ll integrate with your ImageKit upload API here
                  // for now we use fake local URL
                  setFormData({
                    ...formData,
                    img_url: URL.createObjectURL(file),
                  });
                }
              }}
              required
            />
            {formData.img_url && (
              <img
                src={formData.img_url}
                alt="Preview"
                className="mt-2 h-20 object-cover rounded-md border"
              />
            )}
          </div>

          {/* Banner Images */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Banner Images
            </label>
            {formData.banner.map((b, i) => (
              <Input
                key={i}
                type="text"
                placeholder={`Banner Image URL ${i + 1}`}
                value={b}
                onChange={(e) => handleBannerChange(i, e.target.value)}
                className="mb-2"
              />
            ))}
            <Button type="button" variant="outline" onClick={addBannerField}>
              + Add Another Banner
            </Button>
          </div>

          <Button type="submit">Add Category</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm;
