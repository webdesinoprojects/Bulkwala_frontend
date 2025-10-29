import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useOrderStore from "@/store/order.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrderDetail = () => {
  const { orderId } = useParams();
  const {
    singleOrder: order,
    isLoading,
    fetchSingleOrder,
    error,
  } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSingleOrder(orderId);
  }, [orderId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600">
        <p>Order not found.</p>
        <Button
          className="mt-4 bg-[#02066F]"
          onClick={() => navigate("/my-orders")}
        >
          Back to Orders
        </Button>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

      {/* 🧾 ORDER SUMMARY */}
      <Card className="mb-6 border-gray-200 shadow-sm">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Order #{order._id.slice(-6).toUpperCase()}
          </CardTitle>
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </span>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Payment Mode:</strong> {order.paymentMode.toUpperCase()}
          </p>
          {order.transactionId && (
            <p>
              <strong>Transaction ID:</strong> {order.transactionId}
            </p>
          )}
          <p>
            <strong>Items Price:</strong> ₹{order.itemsPrice.toFixed(2)}
          </p>
          <p>
            <strong>Tax (18%):</strong> ₹{order.taxPrice.toFixed(2)}
          </p>
          <p>
            <strong>Shipping Price:</strong> ₹{order.shippingPrice.toFixed(2)}
          </p>
          <p className="text-lg font-semibold text-gray-900 border-t pt-2">
            Total Amount: ₹{order.totalPrice.toFixed(2)}
          </p>
          <div className="pt-2 text-sm text-gray-500">
            <p>
              <strong>Order Created:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            {order.deliveredAt && (
              <p>
                <strong>Delivered At:</strong>{" "}
                {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
            {order.cancelledAt && (
              <p>
                <strong>Cancelled At:</strong>{" "}
                {new Date(order.cancelledAt).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🚚 SHIPPING DETAILS */}
      <Card className="mb-6 border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Name:</strong> {order.shippingAddress?.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.shippingAddress?.phone}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}`}
          </p>
          <p>
            <strong>Country:</strong> {order.shippingAddress?.country}
          </p>
        </CardContent>
      </Card>

      {/* 🛍️ PRODUCT DETAILS */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Ordered Products
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-100">
          {order.products.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center justify-between py-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={
                    item.product?.images?.[0] ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.product?.title}
                  className="w-20 h-20 rounded-md object-cover border"
                />
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.product?.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-0 text-right">
                <span className="text-gray-800 font-semibold">
                  ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 🔙 BACK BUTTON */}
      <div className="mt-8 flex justify-end">
        <Button
          className="bg-[#02066F] hover:bg-[#03136e]"
          onClick={() => navigate("/my-orders")}
        >
          Back to My Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
