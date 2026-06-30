import { axiosInstance } from "@/lib/axios";

export const getAllOrdersService = async () => {
  const res = await axiosInstance.get("/api/admin/orders");
  return res.data.data;
};

export const updateOrderStatusService = async (orderId, status) => {
  const res = await axiosInstance.patch(`/api/admin/orders/${orderId}/status`, {
    status,
  });
  return res.data.data;
};

export const updatePaymentStatusService = async (orderId, paymentStatus) => {
  const res = await axiosInstance.patch(
    `/api/admin/orders/${orderId}/payment-status`,
    { paymentStatus }
  );
  return res.data.data;
};

export const syncShipmentService = async (orderId) => {
  const res = await axiosInstance.post(`/api/admin/orders/${orderId}/sync`);
  return res.data.data;
};

export const retryShipmentService = async (orderId) => {
  const res = await axiosInstance.post(
    `/api/admin/orders/${orderId}/retry-shipment`
  );
  return res.data.data;
};

export const downloadLabelService = async (orderId) => {
  const res = await axiosInstance.get(`/api/admin/orders/${orderId}/label`, {
    responseType: "blob",
  });
  return res.data;
};