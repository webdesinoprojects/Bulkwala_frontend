import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, XCircle } from "lucide-react";

export default function Wishlist() {
  const {
    wishlist,
    fetchWishlist,
    isLoading,
    clearWishlist,
    removeWishlistItem,
  } = useWishlistStore();
  const navigate = useNavigate();

  // Load wishlist once
  useEffect(() => {
    fetchWishlist();
  }, []);

  // Loader
  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-600">Loading wishlist...</p>
    );

  // Empty state
  if (wishlist.length === 0)
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Your wishlist is empty ❤️</p>
        <Button
          onClick={() => navigate("/products")}
          className="bg-[#02066F] text-white hover:bg-[#04127A] transition-all px-6 py-2 font-semibold mt-4"
        >
          Browse Products
        </Button>
      </div>
    );

  // ✅ Clear all handler
  const handleClearAll = async () => {
    await clearWishlist();
    toast.info("All items removed from wishlist ❌");
  };

  // ✅ Remove individual item
  const handleRemoveItem = async (e, id) => {
    e.stopPropagation(); // prevent product click navigation
    await removeWishlistItem(id);
    toast.info("Item removed from wishlist ❌");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Wishlist</h2>
        <Button
          variant="outline"
          onClick={handleClearAll}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-400 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product.slug}`)}
            className="relative border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer bg-white group"
          >
            <button
              onClick={(e) => handleRemoveItem(e, product._id)}
              className="absolute top-2 right-2 bg-white/90 hover:bg-red-100 text-red-600 rounded-full p-1 shadow-sm transition z-10 opacity-0 group-hover:opacity-100"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* Product Image */}
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-48 object-contain bg-gray-50"
            />

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-[#02066F] truncate">
                {product.title}
              </h3>
              <p className="text-gray-700 font-medium mt-1">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
