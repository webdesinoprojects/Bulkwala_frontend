import { axiosInstance } from "@/lib/axios";

export const createOrderService = async (payload) => {
  const res = await axiosInstance.post(`/api/order/`, payload, {
    withCredentials: true,
  });

  return res.data.data;
};

export const verifyOrderService = async (payload) => {
  const res = await axiosInstance.post(`/api/order/verify-payment`, payload, {
    withCredentials: true,
  });
  console.log("verifyOrderService payload:", res.data.data);
  return res.data.data;
};

export const getSingleOrderService = async (orderId) => {
  const res = await axiosInstance.get(`/api/order/${orderId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const getMyOrdersService = async () => {
  const res = await axiosInstance.get("/api/order/my-orders", {
    withCredentials: true,
  });
  return res.data.data;
};
