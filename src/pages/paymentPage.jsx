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
    user?.address?.[0] || null
  );

  useEffect(() => {
    fetchCart();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Razorpay success listener
  useEffect(() => {
    const handleRazorpaySuccess = async (e) => {
      const verifiedOrder = e.detail.order;
      if (verifiedOrder) {
        if (verifiedOrder.shipmentStatus?.startsWith("Error")) {
          toast.warning(
            "Payment successful! We're processing your order. Tracking details will be shared shortly."
          );
        } else {
          toast.success("Payment Successful!");
        }
        await clearCart();
        navigate("/order-success", {
          state: { orderData: verifiedOrder, paymentType: "Online Payment" },
        });
      } else {
        toast.error("No order data received after payment!");
      }
    };

    window.addEventListener("razorpay-success", handleRazorpaySuccess);
    return () =>
      window.removeEventListener("razorpay-success", handleRazorpaySuccess);
  }, [navigate]);

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    updateAddress(address);
  };

  const handleSelectAddress = (address) => setShippingAddress(address);

  const proceedToPay = async () => {
    if (!paymentMode) return toast.error("Please select a payment method");
    if (!shippingAddress) return toast.error("Please fill in your address");
    if (!user) return toast.error("User not authenticated");

    const result = await handlePayment(cart, shippingAddress);
    if (result?.type === "COD") {
      toast.success("COD Order Placed Successfully");
      await clearCart();
      navigate("/order-success", {
        state: { orderData: result.order, paymentType: "Cash on Delivery" },
      });
    }
  };

  if (cartLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading cart details...
      </div>
    );

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black mx-auto mb-3"></div>
          <p className="text-gray-700 font-medium">Processing payment...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* 🏠 Shipping Address Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center lg:text-left">
            Shipping Address
          </h2>
          <ShippingAddressForm
            onSubmit={handleAddressSubmit}
            address={shippingAddress}
          />

          {/* Saved Addresses */}
          <h3 className="text-lg sm:text-xl font-semibold mt-8 mb-4">
            Saved Addresses
          </h3>
          <div className="space-y-3">
            {user?.address?.length > 0 ? (
              user.address.map((address, index) => (
                <div
                  key={index}
                  className={`border p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    shippingAddress === address ? "border-black" : ""
                  }`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <p className="text-gray-800 font-medium">{address.name}</p>
                  <p className="text-gray-600 text-sm">
                    {address.street}, {address.city}, {address.state}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {address.postalCode}, {address.country}
                  </p>
                  <p className="text-gray-700 text-sm">{address.phone}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No saved addresses found.</p>
            )}
          </div>
        </div>

        {/* 💳 Order Summary + Payment */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center lg:text-left">
            Order Summary
          </h2>

          {/* Order Table */}
          <div className="border rounded-lg mb-6 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[450px]">
              <thead className="bg-gray-100">
                <tr className="text-gray-600 text-xs sm:text-sm uppercase">
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {cart?.items?.map((item) => (
                  <tr
                    key={item.product._id}
                    className="border-b last:border-none hover:bg-gray-50 text-sm sm:text-base"
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

          {/* Totals */}
          <div className="space-y-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Items Price</span>
              <span>₹{itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold text-base sm:text-lg">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Options */}
          <h3 className="text-lg sm:text-xl font-semibold text-center lg:text-left mt-8 mb-3">
            Select Payment Method
          </h3>
          <div className="space-y-3 mb-6">
            {[
              { label: "💳 Pay Online (Card)", value: "card" },
              { label: "💳 Pay Online (UPI)", value: "upi" },
              { label: "🏦 Net Banking", value: "netbanking" },
              { label: "💵 Cash on Delivery (COD)", value: "cod" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 border p-3 sm:p-4 rounded-xl hover:border-black transition cursor-pointer text-sm sm:text-base"
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={paymentMode === option.value}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {/* Pay Button */}
          <div className="border-t pt-5 text-center">
            <p className="text-gray-600 text-sm mb-2">{totalItems} item(s)</p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">
              ₹{totalPrice.toFixed(2)}
            </h3>

            <button
              disabled={!paymentMode || isLoading || totalPrice <= 0}
              onClick={proceedToPay}
              className="w-full bg-black text-white py-3 sm:py-4 rounded-lg text-sm sm:text-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {paymentStatus === "cancelled"
                ? "Payment Cancelled"
                : paymentMode === "cod"
                ? "Place Order (COD)"
                : isLoading
                ? "Processing..."
                : `Proceed to Pay ₹${totalPrice.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
