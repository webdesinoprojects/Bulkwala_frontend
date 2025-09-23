import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#C9E0EF] shadow-sm">
      <div className="max-w-7xl mx-auto flex gap-10 px-12 py-5">
        <NavLink to="/" className="font-mono text-base text-black font-medium hover:underline">
          Home
        </NavLink>
        <NavLink to="/products" className="font-mono text-base text-black font-medium hover:underline">
          Products
        </NavLink>
        <NavLink to="/contact" className="font-mono text-base text-black font-medium hover:underline">
          Contact Us
        </NavLink>
        <NavLink to="/about" className="font-mono text-base text-black font-medium hover:underline">
          About Us
        </NavLink>
      </div>
    </nav>
  );
}
