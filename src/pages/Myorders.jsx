import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useOrderStore from "@/store/order.store";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const MyOrders = () => {
  const { orders, isLoading, fetchMyOrders, error } = useOrderStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading your orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600">
        <p className="text-lg">You haven’t placed any orders yet.</p>
        <Button
          className="mt-4 bg-[#02066F]"
          onClick={() => navigate("/products")}
        >
          Browse Products
        </Button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-[#F7F9FC]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Order ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Product
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Total
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Payment
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 text-gray-800 font-medium">
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                <td className="px-4 py-3 flex items-center space-x-3">
                  <img
                    src={
                      order.products[0]?.product?.images?.[0] ||
                      "https://via.placeholder.com/60"
                    }
                    alt="product"
                    className="w-10 h-10 rounded-md object-cover border"
                  />
                  <span className="text-gray-700">
                    {order.products[0]?.product?.title || "Product"}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  ₹{order.totalPrice.toFixed(2)}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {order.paymentStatus}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <Button
                    variant="outline"
                    className="text-[#02066F] border-[#02066F] text-xs px-3 py-1"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>

          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
