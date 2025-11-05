import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import AddProductForm from "./AddProductForm";
import EditProductDialog from "./EditProductDialog";
import { useProductStore } from "@/store/product.store";

export default function ProductsContent() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { fetchProducts, products, deleteProduct, total } = useProductStore();
  const [filters, setFilters] = useState({ page: 1, limit: 15 });

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];
  const totalPages = Math.ceil(total / filters.limit) || 1;

  const handleEdit = (slug) => {
    setEditSlug(slug);
    setDialogOpen(true);
  };

  const handleDelete = (slug) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this product?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              await deleteProduct(slug);
              toast.dismiss(t);
              toast.success("Product deleted!");
              fetchProducts();
            }}
          >
            Yes, Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
            Cancel
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#02066F]">
          Manage Products
        </h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Product"}
        </Button>
      </div>

      {showAddForm && (
        <AddProductForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts();
          }}
        />
      )}

      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Subcategory</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.length > 0 ? (
                productList.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 line-clamp-2 max-w-[250px]">
                      {p.title}
                    </td>
                    <td className="p-3 text-sm">{p.category?.name || "-"}</td>
                    <td className="p-3 text-sm">
                      {p.subcategory?.name || "-"}
                    </td>
                    <td className="p-3 text-center font-semibold">
                      ₹{p.price}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(p.slug)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(p.slug)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > filters.limit && (
        <div className="flex justify-center items-center gap-4 mt-6">
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

      <EditProductDialog
        open={dialogOpen}
        slug={editSlug}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchProducts}
      />
    </>
  );
}
