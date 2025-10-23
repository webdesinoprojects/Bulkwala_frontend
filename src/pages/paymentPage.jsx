import React, { useEffect } from "react";
import useOrderStore from "@/store/order.store";
import useCartStore from "@/store/cart.store";
import { toast } from "sonner";

const PaymentPage = () => {
  const { paymentMode, setPaymentMode, handlePayment, isLoading } =
    useOrderStore();
  const {
    cart,
    totalAmount,
    totalItems,
    fetchCart,
    isLoading: cartLoading,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const proceedToPay = async () => {
    if (!paymentMode) {
      toast.error("Please select a payment method");
      return;
    }

    const shippingAddress = {
      name: "John Doe",
      phone: "9999999999",
      street: "MG Road",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
    };

    const result = await handlePayment(cart, shippingAddress);
    if (result?.type === "COD") {
      toast.success("COD Order Placed Successfully ");
    }
  };

  if (cartLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading cart details...
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Order Summary
        </h2>

        {/* Cart Table */}
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
                  className="border-b last:border-none"
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

        {/* Payment Method */}
        <h3 className="text-xl font-semibold text-center mb-4">
          Select Payment Method
        </h3>
        <div className="space-y-4 mb-6">
          {[
            { value: "online", label: "💳 Pay Online (Card/UPI)" },
            { value: "netbanking", label: "🏦 Net Banking" },
            { value: "cod", label: "💵 Cash on Delivery" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center space-x-3 border p-3 rounded-xl hover:border-black cursor-pointer"
            >
              <input
                type="radio"
                name="payment"
                value={value}
                checked={paymentMode === value}
                onChange={(e) => setPaymentMode(e.target.value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="border-t pt-6 text-center">
          <p className="text-gray-600 text-sm mb-1">{totalItems} item(s)</p>
          <h3 className="text-3xl font-bold mb-6">₹{totalAmount}</h3>

          <button
            disabled={!paymentMode || isLoading}
            onClick={proceedToPay}
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {paymentMode === "cod"
              ? isLoading
                ? "Placing Order..."
                : "Place Order (COD)"
              : isLoading
              ? "Processing..."
              : `Proceed to Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
