import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useCartStore from "@/store/cart.store";

const Cart = () => {
  const {
    cart,
    totalPrice,
    shippingPrice,
    taxPrice,
    itemsPrice,
    isLoading,
    isUpdating,
    couponError, // From store for error messages
    fetchCart,
    updateCart,
    removeCartItem,
    clearCart,
    applyCoupon, // From store to apply coupon
    removeCoupon, // From store to remove coupon
    discount, // From store for the discount value
    couponApplied, // From store to check if coupon is applied
    appliedCouponCode, // From store to show applied coupon code
  } = useCartStore();
  console.log("total price in cart page:", totalPrice);
  const navigate = useNavigate();
  const [isFetched, setIsFetched] = useState(false);
  const [couponCode, setCouponCode] = useState(""); // State to store coupon code

  // ✅ Fetch cart data on mount
  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setIsFetched(true);
    };
    loadCart();
  }, [fetchCart]);

  // ✅ Loading state
  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-base sm:text-lg">
        Loading cart...
      </div>
    );
  }

  // ✅ Empty cart
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-gray-600 text-base sm:text-lg">
        <p>Your cart is empty.</p>
        <Button onClick={() => navigate("/products")} className="bg-[#02066F]">
          Browse Products
        </Button>
      </div>
    );
  }

  // ✅ Handlers
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart(productId, quantity);
      await fetchCart();
      toast.success("Quantity updated");
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      if (couponApplied) {
        toast.error("Coupon has already been applied.");
        return;
      }

      const result = await applyCoupon(couponCode); // 👈 now returns success/message

      if (!result.success) {
        toast.error(result.message || "Invalid coupon code");
        return;
      }

      toast.success(result.message || "Coupon applied successfully!");
      setCouponCode("");
    } catch (error) {
      toast.error("Something went wrong while applying coupon");
    }
  };

  // Remove coupon
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      await fetchCart();
      toast.success("Coupon removed");
    } catch (error) {
      toast.error("Failed to remove coupon");
    }
  };

  // NOTE: totalPrice coming from store already contains discount (store/calculation),
  // so we should display totalPrice directly and avoid subtracting discount again here.
  const displayedTotal =
    totalPrice != null ? Number(totalPrice).toFixed(2) : "0.00";

  // ✅ Layout
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-6"></h1>
        Your Cart
        {/* Cart Items */}
        <div className="space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b py-4 gap-4 sm:gap-6"
            >
              {/* Left: Product Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
                <img
                  src={
                    item.product.images?.[0] ||
                    "https://ik.imagekit.io/bulkwala/demo/default-product.png"
                  }
                  alt={item.product.title}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-md mx-auto sm:mx-0"
                />
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-800">
                    {item.product.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {item.product.description}
                  </p>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg">
                    ₹{item.product.price}
                  </p>
                </div>
              </div>

              {/* Right: Quantity + Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(
                      item.product._id,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-16 text-center border border-gray-300 rounded-md shadow-sm text-sm"
                  disabled={isUpdating}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveItem(item.product._id)}
                  disabled={isUpdating}
                  className="text-sm sm:text-base px-3 sm:px-4"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Summary Section */}
        <div className="mt-8 border-t pt-6 space-y-3 text-sm sm:text-base md:text-lg">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Items Price</span>
            <span className="font-medium">₹{(itemsPrice || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Shipping</span>
            <span className="font-medium">
              ₹{(shippingPrice || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Tax</span>
            <span className="font-medium">₹{(taxPrice || 0).toFixed(2)}</span>
          </div>

          {/* Discount row (show only if discount > 0) */}
          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount</span>
              <span>-₹{Number(discount).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between border-t pt-4 text-base sm:text-lg md:text-xl font-semibold">
            <span>Total Price</span>
            <span>₹{displayedTotal}</span>
          </div>
        </div>
        {/* Coupon Input / Applied Coupon */}
        <div className="mt-8">
          {!couponApplied ? (
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8">
              <Input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full sm:w-auto text-sm sm:text-base"
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isUpdating || !couponCode}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
              >
                Apply Coupon
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
              <div>
                <p className="text-green-800 font-medium">
                  ✅ Coupon applied
                  {appliedCouponCode ? ` — ${appliedCouponCode}` : ""}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {discount > 0
                    ? `You saved ₹${Number(discount).toFixed(2)}`
                    : null}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRemoveCoupon}
                  disabled={isUpdating}
                  className="text-sm sm:text-base"
                >
                  Remove Coupon
                </Button>
              </div>
            </div>
          )}

          {couponError && (
            <p className="text-red-500 text-sm mt-2">{couponError}</p>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isUpdating}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Clear Cart
          </Button>
          <Button
            onClick={() => navigate("/payment")}
            disabled={isUpdating}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
