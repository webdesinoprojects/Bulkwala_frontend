import React, { useEffect, useState } from "react";
import useOrderStore from "@/store/order.store";
import useCartStore from "@/store/cart.store";
import { toast } from "sonner";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import useAuthStore from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const {
    paymentMode,
    setPaymentMode,
    handlePayment,
    isLoading,
    paymentStatus,
  } = useOrderStore();
  const {
    cart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    totalItems,
    fetchCart,
    clearCart,
    isLoading: cartLoading,
  } = useCartStore();
  const { user, updateAddress } = useAuthStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(
    user?.address[0] || null
  );

  useEffect(() => {
    fetchCart();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Listen for Razorpay success event
  useEffect(() => {
    const handleRazorpaySuccess = async (e) => {
      const verifiedOrder = e.detail.order;
      console.log("✅ Received Razorpay success:", verifiedOrder);
      if (verifiedOrder) {
        toast.success("Payment Successful!");
        await clearCart();
        navigate("/order-success", {
          state: { orderData: verifiedOrder, paymentType: "Online Payment" },
        });
      } else {
        toast.error("No order data received after payment!");
      }
    };

    window.addEventListener("razorpay-success", handleRazorpaySuccess);
    return () => {
      window.removeEventListener("razorpay-success", handleRazorpaySuccess);
    };
  }, [navigate]);

  console.log("Cart items:", cart?.items);

  const handleAddressSubmit = (address) => {
    console.log("Submitted address:", address);
    setShippingAddress(address);
    updateAddress(address);
  };

  const proceedToPay = async () => {
    if (!paymentMode) {
      toast.error("Please select a payment method");
      return;
    }

    if (!shippingAddress) {
      toast.error("Please fill in your shipping address");
      return;
    }

    if (!user) {
      toast.error("User is not authenticated");
      return;
    }

    const result = await handlePayment(cart, shippingAddress);
    if (result?.type === "COD") {
      toast.success("COD Order Placed Successfully ");
      await clearCart();
      navigate("/order-success", {
        state: { orderData: result.order, paymentType: "Cash on Delivery" },
      });
    }
  };

  // Function to handle address selection
  const handleSelectAddress = (address) => {
    setShippingAddress(address);
  };

  if (cartLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading cart details...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black mx-auto mb-3"></div>
          <p className="text-gray-700 font-medium">Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 flex">
        {/* Left Section - Shipping Address */}
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Shipping Address
          </h2>
          <ShippingAddressForm
            onSubmit={handleAddressSubmit}
            address={shippingAddress}
          />

          {/* Display Saved Addresses */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Saved Addresses</h3>
          <div className="space-y-4">
            {user?.address?.map((address, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectAddress(address)}
              >
                <p>{address.name}</p>
                <p>
                  {address.street}, {address.city}, {address.state}
                </p>
                <p>
                  {address.postalCode}, {address.country}
                </p>
                <p>{address.phone}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Order Summary and Payment Methods */}
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Order Summary
          </h2>

          {/* 🧾 Order Summary */}
          <div className="border rounded-lg mb-6 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr className="text-gray-600 text-sm uppercase">
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {cart?.items?.map((item) => (
                  <tr
                    key={item.product._id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-800">{item.product.title}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🧾 Deductions Section */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg">Items Price</h3>
              <p className="font-medium text-gray-600">
                ₹{itemsPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg">Shipping</h3>
              <p className="font-medium text-gray-600">
                ₹{shippingPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-lg">Tax</h3>
              <p className="font-medium text-gray-600">
                ₹{taxPrice.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Total Price</h3>
              <p className="font-medium text-gray-800 text-xl">
                ₹{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* 💳 Payment Methods */}
          <h3 className="text-xl font-semibold text-center mb-4">
            Select Payment Method
          </h3>
          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-3 border p-3 rounded-xl hover:border-black transition cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMode === "card"}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>💳 Pay Online (Card)</span>
            </label>

            <label className="flex items-center space-x-3 border p-3 rounded-xl hover:border-black transition cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMode === "upi"}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>💳 Pay Online (UPI)</span>
            </label>

            <label className="flex items-center space-x-3 border p-3 rounded-xl hover:border-black transition cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="netbanking"
                checked={paymentMode === "netbanking"}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>🏦 Net Banking</span>
            </label>

            <label className="flex items-center space-x-3 border p-3 rounded-xl hover:border-black transition cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMode === "cod"}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>💵 Cash on Delivery (COD)</span>
            </label>
          </div>

          <div className="border-t pt-6 text-center">
            <p className="text-gray-600 text-sm mb-1">{totalItems} item(s)</p>
            <h3 className="text-3xl font-bold mb-6">₹{totalPrice}</h3>

            <button
              disabled={!paymentMode || isLoading || totalPrice <= 0}
              onClick={proceedToPay}
              className="w-full bg-black text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {paymentStatus === "cancelled"
                ? "Payment Cancelled"
                : paymentMode === "cod"
                ? "Place Order (COD)"
                : isLoading
                ? "Processing..."
                : `Proceed to Pay ₹${totalPrice || 0}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
