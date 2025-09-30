import React, { useState, useEffect } from "react";
import { useProductStore } from "../../store/product.store.js";
import { useCategoryStore } from "../../store/category.store.js";
import { useSubcategoryStore } from "../../store/subcategory.store.js";

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

const AddProductForm = ({ onSuccess }) => {
  const { addProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    previewUrls: [],
    category: "",
    subcategory: "",
  });
  useEffect(() => {
    fetchCategories();
    fetchSubcategories().then(() => {
      console.log("Subcategories from store:", subcategories);
    });
  }, [fetchCategories, fetchSubcategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: files,
      previewUrls: previews,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(formData);
    onSuccess?.();
  };

  // Filter subcategories by category
  const filteredSubcategories = formData.category
    ? subcategories.filter(
        (sc) => String(sc.category?._id) === String(formData.category)
      )
    : [];

  return (
    <Card className="mb-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Product Images
            </label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              required
            />
            <div className="mt-2 flex gap-2 flex-wrap">
              {formData.previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Preview"
                  className="h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value, subcategory: "" })
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

          {/* Subcategory Dropdown */}
          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Subcategory
            </label>
            <Select
              value={formData.subcategory}
              onValueChange={(value) =>
                setFormData({ ...formData, subcategory: value })
              }
              disabled={!formData.category}
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
          </div>

          <Button type="submit">Add Product</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
