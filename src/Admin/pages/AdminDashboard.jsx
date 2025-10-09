import React, { useState, useEffect } from "react";
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
import { useCategoryStore } from "../../store/category.store.js";
import { useSubcategoryStore } from "../../store/subcategory.store.js";
import { useProductStore } from "@/store/product.store.js";
import EditProductDialog from "../components/EditProductDialog.jsx";
import EditCategoryDialog from "../components/EditCategoryDialog.jsx";
import EditSubcategoryDialog from "../components/EditSubcategoryDialog.jsx";

import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// ------------------------- Dashboard Cards -------------------------
const DashboardContent = () => (
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
        <h2 className="text-xl font-semibold">Products</h2>
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

      <EditProductDialog
        open={dialogOpen}
        slug={editSlug}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchProducts}
      />
    </>
  );
};

// ------------------------- Categories Section -------------------------

const CategoriesContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { fetchCategories, categories, removeCategory, editCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (slug) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this category?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              await removeCategory(slug);
              toast.dismiss(t);
              toast.success("Category deleted successfully!");
              fetchCategories();
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

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleSave = async (updatedData) => {
    await editCategory(selectedCategory.slug, updatedData);
    setEditDialogOpen(false);
    toast.success("Category updated successfully!");
    fetchCategories();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Category"}
        </Button>
      </div>

      {showAddForm && (
        <AddCategoryForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchCategories();
          }}
        />
      )}

      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left font-semibold">Image</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Slug</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category._id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={category.img_url}
                        alt={category.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {category.slug}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(category.slug)}
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
                    colSpan="4"
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 🆕 Edit Dialog */}
      {selectedCategory && (
        <EditCategoryDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          category={selectedCategory}
          onSave={handleSave}
        />
      )}
    </>
  );
};

// ------------------------- Subcategories Section -------------------------

const SubcategoriesContent = () => {
  const [showAddForm, setShowAddForm] = useState(false); // ✅ add toggle state
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    fetchSubcategories,
    subcategories,
    removeSubcategory,
    editSubcategory,
  } = useSubcategoryStore();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleEdit = (sub) => {
    setSelectedSubcategory(sub);
    setDialogOpen(true);
  };

  const handleDelete = (slug) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this subcategory?</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              await removeSubcategory(slug);
              toast.dismiss(t);
              toast.success("Subcategory deleted successfully!");
              fetchSubcategories();
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
        <h2 className="text-xl font-semibold">Subcategories</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Close Form" : "Add New Subcategory"}
        </Button>
      </div>

      {showAddForm && (
        <AddSubCategoryForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchSubcategories();
          }}
        />
      )}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 text-left font-semibold">Image</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Slug</th>
                <th className="p-3 text-left font-semibold">Category</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories?.length > 0 ? (
                subcategories.map((sub, index) => (
                  <tr
                    key={sub._id || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={sub.img_url}
                        alt={sub.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900">
                      {sub.name}
                    </td>
                    <td className="p-3 text-sm text-gray-700">{sub.slug}</td>
                    <td className="p-3 text-sm text-gray-700">
                      {sub.category?.name || "-"}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleEdit(sub)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(sub.slug)}
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
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No subcategories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ✅ Edit Dialog */}
      <EditSubcategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subcategory={selectedSubcategory}
        onSave={async (slug, data) => {
          await editSubcategory(slug, data);
          toast.success("Subcategory updated successfully!");
          fetchSubcategories();
        }}
      />
    </>
  );
};

// ------------------------- Users & Settings -------------------------
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

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
