import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useOrderStore from "@/store/order.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const OrderTrack = () => {
  const { orderId } = useParams();
  const { trackingData, fetchTrackingData, isLoading, error } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrackingData(orderId);
  }, [orderId]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Fetching tracking details...
      </div>
    );

  if (!trackingData)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600">
        <p>No tracking data available.</p>
        <Button
          className="mt-4 bg-[#02066F]"
          onClick={() => navigate("/my-orders")}
        >
          Back to Orders
        </Button>
      </div>
    );

  const shipmentData = trackingData?.ShipmentData?.[0];
  const waybill = shipmentData?.Shipment?.AWB || "N/A";
  const currentStatus =
    shipmentData?.Shipment?.Status?.Status || "Not Available";
  const scans = shipmentData?.Shipment?.Scans || [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 font-inter">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Shipment Tracking
      </h1>

      {/* === Summary Card === */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <p className="text-gray-700 mb-2">
          <strong>Tracking ID:</strong> {waybill}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Current Status:</strong> {currentStatus}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Courier:</strong> Delhivery
        </p>

        {/* Optional external link */}
        {waybill !== "N/A" && (
          <a
            href={`https://www.delhivery.com/tracking?waybill=${waybill}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#02066F] underline text-sm"
          >
            Track on Delhivery Website
          </a>
        )}
      </div>

      {/* === Tracking History === */}
      <div className="mt-6 bg-white border rounded-lg p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Tracking Updates
        </h2>
        <ul className="divide-y divide-gray-100">
          {scans.length > 0 ? (
            scans.map((scan, index) => (
              <li key={index} className="py-3 text-sm">
                <p className="text-gray-800 font-medium">
                  {scan?.ScanDetail?.Scan || "Update"}
                </p>
                <p className="text-gray-500">
                  {scan?.ScanDetail?.ScanDateTime
                    ? new Date(scan.ScanDetail.ScanDateTime).toLocaleString()
                    : ""}
                  {scan?.ScanDetail?.ScannedLocation
                    ? ` - ${scan.ScanDetail.ScannedLocation}`
                    : ""}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic">No scans available yet.</p>
          )}
        </ul>
      </div>

      {/* === Back Button === */}
      <div className="mt-8 flex justify-end">
        <Button className="bg-[#02066F]" onClick={() => navigate("/my-orders")}>
          Back to My Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderTrack;
