import React, { useEffect } from "react";
import { useProductStore } from "../store/product.store.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Products = () => {
  const { products, fetchProducts, loading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        All Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-100 lg:grid-cols-4 gap-8 p-10">
        {productList.map((product) => (
          <Card  key={product._id}>
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-40 w-full object-cover rounded"
              />
              <p className="mt-2 text-gray-600">{product.description}</p>
              <p className="font-bold mt-1">₹{product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;
