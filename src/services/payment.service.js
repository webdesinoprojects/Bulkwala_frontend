import { axiosInstance } from "@/lib/axios";

export const createPaymentOrder = async (payload) => {
  const res = await axiosInstance.post(`/api/payment/create-order`, payload, {
    withCredentials: true,
  });

  console.log("createPaymentOrder response:", res.data);
  return res.data.data; 
};

export const verifyPayment = async (payload) => {
  const res = await axiosInstance.post(`/api/payment/verify-order`, payload, {
    withCredentials: true,
  });
  return res.data.data;
};
