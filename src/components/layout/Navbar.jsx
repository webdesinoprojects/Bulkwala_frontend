import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth.store";
import { toast } from "sonner";

export default function Navbar() {
  const { user, logout, checkauthstatus } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optional: refresh user on mount
  useEffect(() => {
    checkauthstatus();
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      toast.success("Logged out successfully!");
      navigate("/login");
    } else {
      toast.error(result.error || "Logout failed.");
    }
    setDropdownOpen(false);
  };

  return (
    <header className="w-full border-b border-gray-300 bg-white">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4">
        {/* Logo */}
        <div className="mb-2 md:mb-0 flex-shrink-0">
          <h1 className="font-bold text-xl tracking-wide">BULKWALA</h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-[450px] bg-gray-100 rounded-md px-4 py-2 mb-2 md:mb-0">
          <ion-icon
            name="search-outline"
            class="text-xl text-gray-500 mr-2"
          ></ion-icon>
          <input
            type="search"
            placeholder="Search Your Products Here"
            className="bg-transparent flex-1 outline-none text-sm md:text-base"
          />
          <ion-icon
            name="mic-outline"
            class="text-xl text-gray-500 ml-2"
          ></ion-icon>
        </div>

        {/* Whislist  */}
        <div className="flex items-center space-x-8 relative">
          <div className="flex items-center space-x-1">
            <Link to="/wishlist">
              <div className="flex items-center space-x-1 cursor-pointer">
                <ion-icon name="heart-outline" className="text-xl"></ion-icon>
                <span className="text-base font-medium">Wishlist</span>
              </div>
            </Link>
          </div>

          {/* User & Cart */}
          <div className="flex items-center space-x-8 relative">
            <Link to="/cart">
              <div className="flex items-center space-x-1 cursor-pointer">
                <ion-icon name="cart-outline" className="text-xl"></ion-icon>
                <span className="text-base font-medium">Cart</span>
              </div>
            </Link>
          </div>

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                <ion-icon
                  name="person-circle-outline"
                  class="text-xl"
                ></ion-icon>
                <span className="text-base font-medium">{user.name}</span>

                {/* Role Badge */}
                {user.role === "admin" && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                    Admin
                  </span>
                )}
                {user.role === "seller" && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    Seller
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
                  {/* ✅ Show correct dashboard based on role */}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Manage Dashboard
                    </Link>
                  )}

                  {user.role === "seller" && (
                    <Link
                      to="/seller"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Manage Dashboard
                    </Link>
                  )}

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Link
                to="/login"
                className="text-base font-medium hover:underline"
              >
                Login
              </Link>
              <span>/</span>
              <Link
                to="/signup"
                className="text-base font-medium hover:underline"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="w-full bg-[#C9E0EF] shadow-sm">
        <div className="max-w-7xl mx-auto flex gap-10 px-12 py-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-mono text-base font-medium ${
                isActive ? "underline" : "text-black hover:underline"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `font-mono text-base font-medium ${
                isActive ? "underline" : "text-black hover:underline"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `font-mono text-base font-medium ${
                isActive ? "underline" : "text-black hover:underline"
              }`
            }
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `font-mono text-base font-medium ${
                isActive ? "underline" : "text-black hover:underline"
              }`
            }
          >
            About Us
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
