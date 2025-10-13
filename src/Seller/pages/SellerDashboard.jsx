import React, { useState, useEffect } from "react";
import {
  FaBoxOpen,
  FaTags,
  FaTachometerAlt,
  FaCog,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AddProductForm from "../../Admin/components/AddProductForm.jsx";
import EditProductDialog from "../../Admin/components/EditProductDialog.jsx";
import { useProductStore } from "@/store/product.store.js";
import { useCategoryStore } from "@/store/category.store.js";
import useAuthStore from "@/store/auth.store.js";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

/* SELLER DASHBOARD MAIN COMPONENT*/
const SellerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("sellerActiveSection") || "Dashboard"
  );

  useEffect(() => {
    localStorage.setItem("sellerActiveSection", activeSection);
  }, [activeSection]);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", icon: <FaBoxOpen /> },
    { name: "Categories", icon: <FaTags /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`${
              sidebarOpen ? "block" : "hidden"
            } text-xl font-bold text-[#02066F]`}
          >
            Seller Panel
          </h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "←" : "→"}
          </Button>
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={activeSection === item.name ? "secondary" : "ghost"}
              className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setActiveSection(item.name)}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {activeSection}
          </h2>
          <Input type="text" placeholder="Search..." className="w-64" />
        </div>

        {/* Section Rendering */}
        {activeSection === "Dashboard" && <SellerDashboardContent />}
        {activeSection === "Products" && <SellerProductsContent />}
        {activeSection === "Categories" && <SellerCategoryView />}
        {activeSection === "Settings" && <SellerSettings />}
      </main>
    </div>
  );
};

/* DASHBOARD OVERVIEW SECTION */
const SellerDashboardContent = () => {
  const { products, fetchProducts, total } = useProductStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProducts({ sellerId: user._id, limit: 15 });
  }, []);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  const lowStock = productList.filter((p) => p.stock <= 5).length;

  const cardData = [
    {
      title: "My Products",
      value: total || 0,
      icon: <FaBoxOpen className="text-blue-500 w-6 h-6" />,
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: <FaExclamationTriangle className="text-red-500 w-6 h-6" />,
      bg: "bg-red-50",
      text: "text-red-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cardData.map((card) => (
        <Card key={card.title} className={`${card.bg} shadow-sm rounded-xl`}>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className={`text-2xl font-bold ${card.text}`}>
                {card.value}
              </CardTitle>
            </div>
            {card.icon}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

/* PRODUCT MANAGEMENT SECTION (Paginated */
const SellerProductsContent = () => {
  const { fetchProducts, products, deleteProduct, total } = useProductStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuthStore();

  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    fetchProducts({ sellerId: user._id, page, limit });
  }, [page]);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  const totalPages = Math.ceil((total || 0) / limit);

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
              toast.success("Product deleted successfully!");
              fetchProducts({ sellerId: user._id, page, limit });
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
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add Product"}
        </Button>
      </div>

      {showAddForm && (
        <AddProductForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts({ sellerId: user._id, page, limit });
          }}
        />
      )}

      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm mt-4">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.length > 0 ? (
                productList.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="w-14 h-14 rounded-md object-cover border"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 line-clamp-1 max-w-[200px]">
                      {p.title}
                    </td>
                    <td className="p-3 text-center font-semibold">
                      ₹{p.price}
                    </td>
                    <td className="p-3 text-center">
                      {p.stock > 0 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Out
                        </span>
                      )}
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
                    colSpan="5"
                    className="text-center py-6 text-gray-500 text-sm"
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <EditProductDialog
        open={dialogOpen}
        slug={editSlug}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => fetchProducts({ sellerId: user._id, page, limit })}
      />
    </>
  );
};

/*  CATEGORY READ-ONLY VIEW */
const SellerCategoryView = () => {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Card className="bg-white shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle>Available Categories</CardTitle>
        <CardDescription>You can choose from these categories.</CardDescription>
      </CardHeader>
      <CardContent>
        {categories?.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 border rounded-lg hover:shadow-sm bg-gray-50 flex flex-col items-center"
              >
                <img
                  src={cat.img_url}
                  alt={cat.name}
                  className="w-20 h-20 object-cover rounded-md mb-2"
                />
                <p className="font-medium text-gray-800">{cat.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No categories available.</p>
        )}
      </CardContent>
    </Card>
  );
};

/*  SETTINGS SECTION*/
const SellerSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Settings</CardTitle>
      <CardDescription>Manage your seller account preferences.</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-500 text-sm">Coming soon...</p>
    </CardContent>
  </Card>
);

export default SellerDashboard;
