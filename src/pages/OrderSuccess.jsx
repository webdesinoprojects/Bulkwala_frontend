import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state?.orderData || {};
  const paymentType = location.state?.paymentType || "Online Payment";

  console.log("Order Data from ordersuccess page:", orderData);
  console.log("Payment Type:", paymentType);

  // Extract data safely for both types (COD / Online)
  const orderId = orderData?._id || "N/A";
  const totalAmount = orderData?.totalPrice || "N/A";
  const paymentStatus = orderData?.paymentStatus || "N/A";
  const itemCount = orderData?.products?.length || 0;
  const city = orderData?.shippingAddress?.city || "N/A";
  const customerName = orderData?.shippingAddress?.name || "N/A";
  const paymentMode = orderData?.paymentMode?.toUpperCase() || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-lg w-full">
        {/* ✅ Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={80} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your{" "}
          <span className="font-semibold">{paymentType}</span> order has been
          confirmed.
        </p>

        {/* 🧾 Order Info */}
        <div className="bg-gray-100 rounded-lg text-left p-4 mb-6 text-gray-700 space-y-1">
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
          <p>
            <strong>Customer:</strong> {customerName}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{totalAmount}
          </p>
          <p>
            <strong>Items:</strong> {itemCount}
          </p>
          <p>
            <strong>Payment Status:</strong> {paymentStatus.toUpperCase()}
          </p>
          <p>
            <strong>Payment Mode:</strong> {paymentMode}
          </p>
          <p>
            <strong>Shipping City:</strong> {city}
          </p>
        </div>

        {/* 🧭 Buttons */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          View My Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-gray-600 hover:underline text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
