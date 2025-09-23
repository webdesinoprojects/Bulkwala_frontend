import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="w-full border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-4">
        <div className="mb-2 md:mb-0 flex-shrink-0">
          <h1 className="font-bold text-xl tracking-wide">BULKWALA</h1>
        </div>

        <div className="flex items-center w-full md:w-[450px] bg-gray-100 rounded-md px-4 py-2 mb-2 md:mb-0">
          <ion-icon name="search-outline" class="text-xl text-gray-500 mr-2"></ion-icon>
          <input
            type="search"
            placeholder="Search Your Products Here"
            className="bg-transparent flex-1 outline-none text-sm md:text-base"
          />
          <ion-icon name="mic-outline" class="text-xl text-gray-500 ml-2"></ion-icon>
        </div>

        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-1">
            <ion-icon name="cart-outline" class="text-xl"></ion-icon>
            <span className="text-base font-medium">Cart</span>
          </div>
          <div className="flex items-center space-x-1">
            <ion-icon name="person-circle-outline" class="text-xl"></ion-icon>
            {user ? (
              <>
                <span className="ml-1 text-base font-medium">Hello, {user.name}</span>
                <button onClick={logout} className="ml-2 underline text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-base font-medium hover:underline">
                  Login
                </Link>
                <span>/</span>
                <Link to="/signup" className="text-base font-medium hover:underline">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
