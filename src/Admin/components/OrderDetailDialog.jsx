import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAdminOrdersStore } from "@/store/adminOrders.store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrderDetailDialog({ open, onOpenChange, order }) {
  const { downloadLabel } = useAdminOrdersStore();

  if (!order) return null;

  const handleDownloadLabel = async () => {
    const res = await downloadLabel(order._id);
    if (res.success && res.blob) {
      const blob = new Blob([res.blob], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Label_${order.trackingId}.pdf`;
      a.click();
      toast.success("Label downloaded successfully!");
    } else {
      toast.warning("Label not available yet (shipment not picked)");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#02066F]">
            Order Details – #{order._id?.slice(-6)?.toUpperCase()}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <section className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm text-gray-500">Payment Mode</p>
              <p className="font-medium capitalize">{order.paymentMode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <Badge
                className={
                  order.paymentStatus === "success"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {order.paymentStatus?.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <p className="font-medium">{order.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="font-semibold text-lg text-[#02066F]">
                ₹{order.totalPrice?.toFixed(2)}
              </p>
            </div>
          </section>

          {/* Customer Info */}
          <section className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">
              Customer Information
            </h3>
            <p>
              <strong>Name:</strong> {order.user?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {order.user?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"}
            </p>
          </section>

          {/* Shipping Address */}
          {order.paymentMode !== "pickup" ? (
            <section className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-800">
                Shipping Address
              </h3>
              <p>
                {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </section>
          ) : (
            <section className="border p-4 rounded-lg bg-yellow-50">
              <h3 className="font-semibold mb-2 text-gray-800">
                Pickup from Store
              </h3>
              <p>Bulkwala Store, Jain Park, Uttam Nagar, Delhi 110059</p>
            </section>
          )}

          {/* Product List */}
          {/* Product List */}
          <section className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-gray-800">Products</h3>
            <div className="divide-y">
              {order.products?.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    {p.product?.images?.[0] || p.product?.image_url?.[0] ? (
                      <img
                        src={
                          p.product?.images?.[0] || p.product?.image_url?.[0]
                        }
                        alt={p.product?.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        📦
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-gray-800">
                        {p.product?.title || "Unnamed Product"}
                      </p>

                      <p className="text-gray-500 text-xs">
                        Qty: {p.quantity} × ₹{p.product?.price?.toFixed(2)}
                      </p>

                      {p.product?.sku && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          <strong>SKU:</strong> {p.product.sku}
                        </p>
                      )}

                      {p.product?._id && (
                        <p className="text-xs text-gray-400">
                          <strong>ID:</strong> {p.product._id}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-gray-800 whitespace-nowrap">
                    ₹{(p.product?.price * p.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipment Info */}
          {order.trackingId && (
            <section className="border p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-800">
                Shipment Details
              </h3>
              <p>
                <strong>Courier:</strong> {order.courierName || "Delhivery"}
              </p>
              <p>
                <strong>Tracking ID:</strong>{" "}
                <a
                  href={`https://www.delhivery.com/tracking?waybill=${order.trackingId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {order.trackingId}
                </a>
              </p>
              <p>
                <strong>Status:</strong> {order.shipmentStatus || "Not Shipped"}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleDownloadLabel}
              >
                📄 Download Label
              </Button>
            </section>
          )}

          <div className="text-right">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
