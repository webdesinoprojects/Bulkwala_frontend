import { axiosInstance } from "@/lib/axios";

export const getAllOrdersService = async () => {
  const res = await axiosInstance.get("/api/order");
  return res.data.data;
};

export const updateOrderStatusService = async (orderId, status) => {
  const res = await axiosInstance.patch(`/api/order/${orderId}/status`, {
    status,
  });
  return res.data.data;
};

export const updatePaymentStatusService = async (orderId, paymentStatus) => {
  const res = await axiosInstance.patch(
    `/api/order/${orderId}/payment-status`,
    { paymentStatus }
  );
  return res.data.data;
};

export const syncShipmentService = async (orderId) => {
  const res = await axiosInstance.post(`/api/order/${orderId}/sync-shipment`);
  return res.data.data;
};

export const retryShipmentService = async (orderId) => {
  const res = await axiosInstance.post(
    `/api/order/${orderId}/retry-shipment`
  );
  return res.data.data;
};

export const downloadLabelService = async (orderId) => {
  const res = await axiosInstance.get(`/api/order/${orderId}/shipping-label`, {
    responseType: "blob",
  });
  return res.data;
};
