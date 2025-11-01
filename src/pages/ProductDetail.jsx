import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "@/schemas/reviewSchema";
import { useProductStore } from "@/store/product.store";
import { useReviewStore } from "@/store/review.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Star,
  Heart,
  Minus,
  Plus,
  MessageCircle,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { wishlist, toggleWishlist, fetchWishlist } = useWishlistStore();
  const { singleProduct, getProductBySlug, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const { reviews, fetchReviews, addReview, deleteReview, updateReview } =
    useReviewStore();

  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  // 🔹 Form setup (react-hook-form + zod)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { text: "", rating: 0 },
  });

  // 🔹 Fetch product & reviews
  useEffect(() => {
    getProductBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (singleProduct?._id) fetchReviews(singleProduct._id);
  }, [singleProduct]);

  // 🔹 Wishlist setup
  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    if (singleProduct && wishlist?.length >= 0) {
      const exists = wishlist.some((p) => p._id === singleProduct._id);
      setIsInWishlist(exists);
    }
  }, [wishlist, singleProduct]);

  if (loading || !singleProduct) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading Product details ...
      </div>
    );
  }

  const product = singleProduct;

  // 🔹 Wishlist toggle
  const handleAddToWishlist = async () => {
    try {
      setIsWishlistLoading(true);
      const updatedList = await toggleWishlist(product._id);
      if (!updatedList) return;

      const nowInWishlist = updatedList.some((p) => p._id === product._id);
      setIsInWishlist(nowInWishlist);
      toast[nowInWishlist ? "success" : "info"](
        `${product.title} ${
          nowInWishlist ? "added to wishlist ❤️" : "removed from wishlist ❌"
        }`
      );
    } catch {
      toast.error("Something went wrong while updating wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // 🔹 Review Submit Handler
  const onSubmitReview = async (data) => {
    if (!selectedRating) {
      toast.error("Please select a rating before submitting!");
      return;
    }

    const formData = new FormData();
    formData.append("text", data.text);
    formData.append("rating", selectedRating);
    if (data.images && data.images.length > 0) {
      for (const file of data.images) {
        formData.append("images", file);
      }
    }

    try {
      let result;

      // ✅ If editing → call update API
      if (isEditing && editReviewId) {
        result = await updateReview(product._id, editReviewId, formData);
      } else {
        // ✅ If adding new → call add API
        result = await addReview(product._id, formData);
      }

      // ✅ Success toast
      if (result) {
        toast.success(
          isEditing
            ? "Review updated successfully ✅"
            : "Review submitted successfully ✅"
        );

        reset();
        setSelectedRating(0);
        setIsEditing(false);
        setEditReviewId(null);
        await fetchReviews(product._id);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";

      toast.error(message);
    }
  };

  // 🔹 Edit Review
  const handleEditReview = (review) => {
    setValue("text", review.text);
    setSelectedRating(review.rating);
    setIsEditing(true);
    setEditReviewId(review._id);
    toast.info("You can now edit your review ✏️");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // 🔹 Cancel Edit
  const handleCancelEdit = () => {
    reset();
    setSelectedRating(0);
    setIsEditing(false);
    setEditReviewId(null);
    toast.info("Edit cancelled 🚫");
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(product._id, reviewId);
    toast.success("Review deleted successfully 🗑️");
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
    toast.success(`${product.title} added to your cart 🛒`);
  };

  const handleViewCart = () => navigate("/cart");
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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

          {/* Thumbnails */}
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
              disabled={isWishlistLoading}
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
              onClick={() =>
                window.open(
                  `https://wa.me/9310701078?text=${encodeURIComponent(
                    `Hi, I'm interested in ${product.title} (₹${product.price})`
                  )}`,
                  "_blank"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </Button>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <Button size="icon" variant="outline" onClick={decreaseQty}>
              <Minus size={18} />
            </Button>
            <span className="text-lg font-semibold">{quantity}</span>
            <Button size="icon" variant="outline" onClick={increaseQty}>
              <Plus size={18} />
            </Button>
          </div>

          {/* Add to Cart */}
          <div className="mt-6 flex items-center justify-center gap-4 ">
            <Button
              onClick={handleAddToCart}
              className="w-50 bg-blue-600 text-white"
            >
              Add to Cart
            </Button>
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

        {/* Review Form */}
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            console.log("🟢 Form manually submitted");
            handleSubmit(onSubmitReview)(e);
          }}
          className="mb-8 space-y-4"
        >
          {/* Rating Stars */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer ${
                  star <= selectedRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => {
                  setSelectedRating(star);
                  setValue("rating", star, { shouldValidate: true });
                }}
              />
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm">{errors.rating.message}</p>
          )}

          {/* Text Input */}
          <textarea
            {...register("text")}
            placeholder="Write your review..."
            className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-[#02066F]"
          />
          {errors.text && (
            <p className="text-red-500 text-sm">{errors.text.message}</p>
          )}

          {/* Image Upload */}
          <Input
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
            className="border border-gray-300 rounded-md p-2"
          />
          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-[#02066F] text-white hover:bg-[#01054f]"
            >
              {isEditing ? "Update Review" : "Submit Review"}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>

        {/* Review List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews?.length > 0 ? (
            reviews.map((rev) => (
              <Card
                key={rev._id}
                className={`shadow-sm relative transition-all duration-200 ${
                  editReviewId === rev._id
                    ? "border-2 border-blue-500 ring-2 ring-blue-300 bg-blue-50/50"
                    : "border border-gray-200"
                }`}
              >
                <CardContent className="p-4 text-gray-700">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {rev.user?.name || "Anonymous"}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReview(rev)}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(rev._id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-1 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < rev.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm mb-2">"{rev.text}"</p>

                  {rev.images?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {rev.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`review-img-${i}`}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
