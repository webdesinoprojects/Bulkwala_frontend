import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 

export const createPaymentOrder = async (payload) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/payment/create-order`, payload, {
    withCredentials: true,
  });
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/payment/verify`, payload, {
    withCredentials: true,
  });
  return data;
};
