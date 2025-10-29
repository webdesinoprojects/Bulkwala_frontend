import { axiosInstance } from "@/lib/axios";

export const getAllOrdersService = async () => {
  const res = await axiosInstance.get("/api/order", { withCredentials: true });
  return res.data.data || [];
};

export const updateOrderStatusService = async (orderId, status) => {
  const res = await axiosInstance.patch(
    `/api/order/${orderId}/status`,
    { status },
    { withCredentials: true }
  );
  return res.data.data;
};

export const updatePaymentStatusService = async (orderId, paymentStatus) => {
  const res = await axiosInstance.patch(
    `/api/order/${orderId}/payment-status`,
    { paymentStatus },
    { withCredentials: true }
  );
  return res.data.data;
};
