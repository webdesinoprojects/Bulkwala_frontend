import React, { useState } from "react";
import { useProductStore } from "../../store/product.store.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AddProductForm = ({ onSuccess }) => {
  const { addProduct } = useProductStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    images: [""],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const images = [...formData.images];
    images[0] = e.target.value;
    setFormData({ ...formData, images });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(formData);
    onSuccess?.();
  };

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
          <Input
            type="text"
            name="images"
            placeholder="Image URL"
            value={formData.images[0]}
            onChange={handleImageChange}
            required
          />

          <Button type="submit">Add Product</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
