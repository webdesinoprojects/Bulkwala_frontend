import { axiosInstance } from "@/lib/axios";

export const createOrderService = async (payload) => {
  const res = await axiosInstance.post(`/api/order/`, payload, {
    withCredentials: true,
  });

  return res.data.data;
};

export const verifyOrderService = async (payload) => {
  console.log("verifyOrderService payload:", payload);
  const res = await axiosInstance.post(`/api/order/verify-payment`, payload, {
    withCredentials: true,
  });
  return res.data.data;
};
