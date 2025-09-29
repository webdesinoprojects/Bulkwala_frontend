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

  return (
    <>
      <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Close Form" : "Add New Product"}
      </Button>

      {showAddForm && (
        <AddProductForm onSuccess={() => setShowAddForm(false)} />
      )}

      <Card>
        <CardContent>
          <p className="text-gray-500">
            List of all products will appear here.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

// ------------------------- Category Sections -------------------------

const CategoriesContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Close Form" : "Add New Category"}
      </Button>

      {showAddForm && (
        <AddCategoryForm onSuccess={() => setShowAddForm(false)} />
      )}

      <Card>
        <CardContent>
          <p className="text-gray-500">
            List of all categories will appear here.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

// ------------------------- Sub-Category Sections -------------------------

const SubcategoriesContent = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <Button className="mb-4" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Close Form" : "Add New Subcategory"}
      </Button>

      {showAddForm && (
        <AddSubCategoryForm onSuccess={() => setShowAddForm(false)} />
      )}

      <Card>
        <CardContent>
          <p className="text-gray-500">
            List of all subcategories will appear here.
          </p>
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
