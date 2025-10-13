import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/product.store.js";
import { useCategoryStore } from "../store/category.store.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const Products = () => {
  const { products, fetchProducts, loading, error, total, limit } =
    useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    minPrice: 0,
    maxPrice: 10000,
    page: 1,
    limit: 20,
  });

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(filters);
    }, 300); // wait 300ms after typing stops

    return () => clearTimeout(delay);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/5 bg-white border-r p-6 space-y-6 shadow-sm overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700">Filters</h2>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className={cn(
                    "cursor-pointer text-sm p-2 rounded-md hover:bg-gray-100",
                    filters.category === cat._id && "bg-gray-200 font-medium"
                  )}
                  onClick={() =>
                    handleFilterChange(
                      "category",
                      filters.category === cat._id ? "" : cat._id
                    )
                  }
                >
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>
              Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
            </Label>
            <Slider
              min={0}
              max={10000}
              step={200}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: val[0],
                  maxPrice: val[1],
                  page: 1,
                }))
              }
            />
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() =>
              setFilters({
                category: "",
                search: "",
                minPrice: 0,
                maxPrice: 10000,
                page: 1,
                limit: 20,
              })
            }
          >
            Clear Filters
          </Button>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Products
          </h2>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : productList.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productList.map((product) => (
                <Card
                  key={product._id}
                  className="hover:shadow-lg border rounded-xl transition bg-white"
                >
                  <CardHeader>
                    <CardTitle className="truncate">{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-48 flex items-center justify-center bg-white rounded-md overflow-hidden">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <p className="mt-2 text-gray-600 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                    <p className="font-bold mt-2 text-lg text-gray-900">
                      ₹{product.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Prev
              </Button>
              <span>
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page === totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
