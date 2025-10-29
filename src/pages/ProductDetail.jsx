import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "@/store/product.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, Minus, Plus, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

const ProductDetail = () => {
  const { slug } = useParams();
  const { wishlist, toggleWishlist, fetchWishlist } = useWishlistStore();

  const { singleProduct, getProductBySlug, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false); // ✅ local reactive state

  const navigate = useNavigate();

  useEffect(() => {
    getProductBySlug(slug);
    fetchWishlist();
  }, [slug]);

  useEffect(() => {
    if (singleProduct && wishlist.length > 0) {
      const exists = wishlist.some((p) => p._id === singleProduct._id);
      setIsInWishlist(exists);
    }
  }, [wishlist, singleProduct]); // ✅ react to store updates

  if (loading || !singleProduct) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading Product details ...
      </div>
    );
  }

  const product = singleProduct;

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToWishlist = async () => {
    try {
      // ✅ Optimistically toggle local state
      setIsInWishlist((prev) => !prev);
      await toggleWishlist(product._id);

      if (isInWishlist) {
        toast.info(`${product.title} removed from wishlist ❌`);
      } else {
        toast.success(`${product.title} added to wishlist ❤️`);
      }
    } catch (error) {
      toast.error("Something went wrong while updating wishlist");
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hi, I'm interested in ${product.title} (₹${product.price})`;
    window.open(
      `https://wa.me/9310701078?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    console.log("Add to Cart clicked!");
    await addToCart(product._id, quantity);
    console.log(product);
    toast.success(`${product.title} added to your cart 🛒`);
  };

  const handleViewCart = () => {
    navigate("/cart"); // Navigate to the Cart page
  };
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        {/* ---------------- IMAGE SECTION ---------------- */}
        <div className="flex flex-col items-center">
          <div className="w-full h-[400px] flex justify-center items-center bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={product.images?.[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Small thumbnails */}
          <div className="flex gap-3 mt-4">
            {product.images?.slice(0, 3).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className="w-16 h-16 border rounded-md object-cover cursor-pointer hover:ring-2 hover:ring-[#02066F]"
              />
            ))}
          </div>
        </div>

        {/* ---------------- DETAILS SECTION ---------------- */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Price + Rating */}
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-[#02066F]">
              ₹{product.price}
            </p>
            <div className="flex items-center gap-1">
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
              <Star size={18} className="text-gray-300" />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Wishlist & WhatsApp */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddToWishlist}
              variant="outline"
              className={`flex items-center gap-2 transition-all ${
                isInWishlist
                  ? "border-red-500 text-red-600 bg-red-50 hover:bg-red-100"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "text-[#02066F]"
                }`}
              />
              {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
            </Button>
            <Button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </Button>
          </div>

          {/* Product Details */}
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Product Details
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Generic Name:</strong> {product.genericName || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Country of Origin:</strong>{" "}
              {product.countryOfOrigin || "India"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Manufacturer:</strong>{" "}
              {product.manufacturerName || "Awesome Accessories"}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={decreaseQty}
              className="text-xl font-bold"
            >
              <Minus size={18} />
            </Button>
            <span className="text-lg font-semibold">{quantity}</span>
            <Button
              size="icon"
              variant="outline"
              onClick={increaseQty}
              className="text-xl font-bold"
            >
              <Plus size={18} />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6 flex items-center justify-center gap-4 ">
            <Button
              onClick={handleAddToCart}
              className="w-50 bg-blue-600 text-white"
            >
              Add to Cart
            </Button>
            {/* View Cart Button */}
            <Button
              onClick={handleViewCart}
              className="w-50 bg-gray-500 text-white"
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------- REVIEWS SECTION ---------------- */}
      <div className="max-w-6xl mx-auto mt-16 px-6">
        <h2 className="text-2xl font-semibold text-[#02066F] mb-4">Reviews</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.reviews?.length > 0 ? (
            product.reviews.map((rev, i) => (
              <Card key={i} className="shadow-sm border-gray-200">
                <CardContent className="p-4 text-gray-700">
                  <p className="text-sm mb-2">"{rev.text}"</p>
                  <p className="text-xs text-gray-500">
                    — {rev.user?.name || "Anonymous"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* ---------------- TOP SUGGESTIONS ---------------- */}
      <div className="max-w-6xl mx-auto mt-20 px-6">
        <h2 className="text-2xl font-semibold text-[#02066F] mb-6">
          Top Suggestions
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-4">
          {[...(product.suggestions || Array(6).fill(product))].map(
            (suggest, i) => (
              <Card
                key={i}
                className="min-w-[150px] hover:shadow-md transition"
              >
                <CardContent className="p-3 text-center">
                  <img
                    src={suggest.images?.[0]}
                    alt={suggest.title}
                    className="w-full h-28 object-contain mb-2"
                  />
                  <p className="text-sm font-medium line-clamp-1">
                    {suggest.title}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
