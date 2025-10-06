import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaList,
  FaUsers,
  FaCog,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AddProductForm from "../components/AddProductForm.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";
import AddSubCategoryForm from "../components/AddSubCategoryForm.jsx";
import { useEffect } from "react";
import { useCategoryStore } from "../../store/category.store.js";
import { useSubcategoryStore } from "@/store/subcategory.store.js";
import { useProductStore } from "@/store/product.store.js";
import EditProductDialog from "../components/EditProductDialog.jsx";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// ------------------------- Dashboard Cards -------------------------
const DashboardContent = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle>120</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Categories</CardDescription>
          <CardTitle>12</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Subcategories</CardDescription>
          <CardTitle>30</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Low Stock Products</CardDescription>
          <CardTitle className="text-red-500">5</CardTitle>
        </CardHeader>
      </Card>
    </div>
  </>
);

// ------------------------- Products Section -------------------------

const ProductsContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { fetchProducts, products, deleteProduct } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  // Handle Edit Click
  const handleEdit = (slug) => {
    setEditSlug(slug);
    setDialogOpen(true);
  };

  // Handle Delete Click (Sonner confirm toast)
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
      {/* ✅ Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Product"}
        </Button>
      </div>

      {/* ✅ Add Product Form */}
      {showAddForm && (
        <AddProductForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchProducts();
          }}
        />
      )}

      {/* ✅ Product Table */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left font-semibold">Image</th>
                <th className="p-3 text-left font-semibold">Title</th>
                <th className="p-3 text-left font-semibold">Category</th>
                <th className="p-3 text-left font-semibold">Subcategory</th>
                <th className="p-3 text-center font-semibold">Price</th>
                <th className="p-3 text-center font-semibold">Stock</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {productList.length > 0 ? (
                productList.map((product, index) => (
                  <tr
                    key={product._id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      {product.images?.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-md" />
                      )}
                    </td>

                    <td className="p-3 text-sm font-medium text-gray-900">
                      {product.title}
                    </td>

                    <td className="p-3 text-sm text-gray-700">
                      {product.category?.name || "-"}
                    </td>

                    <td className="p-3 text-sm text-gray-700">
                      {product.subcategory?.name || "-"}
                    </td>

                    <td className="p-3 text-center text-gray-800 font-semibold">
                      ₹{product.price}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(product.slug)}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(product.slug)}
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

      {/* ✅ Edit Product Dialog */}
      <EditProductDialog
        open={dialogOpen}
        slug={editSlug}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchProducts}
      />
    </>
  );
};

// ------------------------- Category Sections -------------------------

const CategoriesContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { fetchCategories, categories } = useCategoryStore();
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Close Form" : "Add New Category"}
      </Button>

      {showAddForm && (
        <AddCategoryForm onSuccess={() => setShowAddForm(false)} />
      )}

      <Card className="bg-gray-200">
        <CardContent className="flex gap-4">
          {categories.map((category) => (
            <Card className="w-1/4">
              <CardContent className="p-2">
                <p className="font-semibold">{category.name}</p>
                <img src={category.img_url} alt={category.name} />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

// ------------------------- Sub-Category Sections -------------------------

const SubcategoriesContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { fetchSubcategories, subcategories } = useSubcategoryStore();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <>
      <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Close Form" : "Add New Subcategory"}
      </Button>

      {showAddForm && (
        <AddSubCategoryForm onSuccess={() => setShowAddForm(false)} />
      )}
      <Card className="bg-gray-200">
        <CardContent className="flex gap-4">
          {subcategories.map((subcategory) => (
            <Card className="w-1/4">
              <CardContent className="p-2">
                <p className="font-semibold">{subcategory.name}</p>
                <img src={subcategory.img_url} alt={subcategory.name} />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

const UsersContent = () => (
  <Card>
    <CardContent>Manage Users here.</CardContent>
  </Card>
);
const SettingsContent = () => (
  <Card>
    <CardContent>Settings panel goes here.</CardContent>
  </Card>
);

// ------------------------- Main Dashboard -------------------------
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", icon: <FaBoxOpen /> },
    { name: "Categories", icon: <FaTags /> },
    { name: "Subcategories", icon: <FaList /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardContent />;
      case "Products":
        return <ProductsContent />;
      case "Categories":
        return <CategoriesContent />;
      case "Subcategories":
        return <SubcategoriesContent />;
      case "Users":
        return <UsersContent />;
      case "Settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`${sidebarOpen ? "block" : "hidden"} text-xl font-bold`}
          >
            Admin Panel
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
          <div className="flex items-center space-x-4">
            <Input type="text" placeholder="Search..." className="w-64" />
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
