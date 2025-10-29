import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { wishlist, fetchWishlist, isLoading, clearWishlist } =
    useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-600">Loading wishlist...</p>
    );

  if (wishlist.length === 0)
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Your wishlist is empty ❤️</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Wishlist</h2>
        <Button variant="outline" onClick={clearWishlist}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product.slug}`)}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-48 object-contain bg-white"
            />
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
