import React, { useEffect } from "react";
import usePaymentStore from "@/store/payment.store";
import useCartStore from "@/store/cart.store";

const PaymentPage = () => {
  const { paymentMode, setPaymentMode, initiatePayment, isLoading } =
    usePaymentStore();
  const { cart, totalAmount, totalItems, fetchCart, isLoading: cartLoading } =
    useCartStore();

  useEffect(() => {
    fetchCart();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
                  <td className="p-3 text-gray-800">{item.product.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              value="online"
              checked={paymentMode === "online"}
              onChange={(e) => setPaymentMode(e.target.value)}
            />
            <span>💳 Pay Online (Card / UPI)</span>
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
            <span>💵 Cash on Delivery</span>
          </label>
        </div>

        {/* 💰 Total */}
        <div className="border-t pt-6 text-center">
          <p className="text-gray-600 text-sm mb-1">{totalItems} item(s)</p>
          <h3 className="text-3xl font-bold mb-6">₹{totalAmount}</h3>

          <button
            disabled={!paymentMode || isLoading || totalAmount <= 0}
            onClick={initiatePayment}
            className="w-full bg-black text-white py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : `Proceed to Pay ₹${totalAmount || 0}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
