import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useCartStore from "@/store/cart.store";

const Cart = () => {
  const {
    cart,
    isLoading,
    isUpdating,
    fetchCart,
    updateCart,
    removeCartItem,
    clearCart,
  } = useCartStore();
  const navigate = useNavigate();

  const [isFetched, setIsFetched] = useState(false);

  // Fetch cart data on mount
  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      setIsFetched(true);
    };
    loadCart();
  }, [fetchCart]);

  // Check if the cart data is null or loading
  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading cart...
      </div>
    );
  }

  // If cart is null or empty, show a friendly message
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        <p>Your cart is empty.</p>
        <Button onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

  // Calculate subtotal
  const getTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  };

  // Handle updating quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart(productId, quantity);
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">Your Cart</h1>
        <div className="space-y-6">
          {cart.items && cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col sm:flex-row items-center justify-between border-b py-4"
              >
                <div className="flex items-center space-x-4 w-full sm:w-3/4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-40 h-40 object-cover rounded-md"
                  />
                  <div className="flex flex-col gap-2 ml-10 w-full sm:w-3/4">
                    <h3 className="text-xl font-medium">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {item.product.description}
                    </p>
                    <p className="text-black-500 font-semibold text-lg">
                      {`₹${item.product.price}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-1/4 justify-end mt-4 sm:mt-0">
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(
                          item.product._id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 text-center border border-gray-300 rounded-md shadow px-2 py-1"
                      min={1}
                      disabled={isUpdating}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    color="red"
                    onClick={() => handleRemoveItem(item.product._id)}
                    disabled={isUpdating}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {/* Subtotal Section */}
        <div className="flex justify-between mt-6">
          <h2 className="text-2xl font-semibold">Subtotal</h2>
          <p className="text-xl font-medium">{`₹${getTotal().toFixed(2)}`}</p>
        </div>

        {/* Clear Cart and Checkout Buttons */}
        <div className="flex justify-between mt-6 gap-4 flex-wrap">
          <Button
            variant="outline"
            color="gray"
            onClick={handleClearCart}
            disabled={isUpdating}
            className="w-full sm:w-auto"
          >
            Clear Cart
          </Button>
          <Button
            className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-600 text-white"
            onClick={() => navigate("/checkout")}
            disabled={isUpdating}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
