import { axiosInstance } from "@/lib/axios";

export const addToCartService = async (productId, quantity) => {
  const res = await axiosInstance.post("/api/cart", { productId, quantity });
  return res.data.data;
};

export const fetchCartService = async () => {
  const res = await axiosInstance.get("/api/cart");
  return res.data.data;
};

export const updateCartItemService = async (productId, quantity) => {
  const res = await axiosInstance.put("/api/cart", { productId, quantity });
  return res.data.data;
};

export const removeCartItemService = async (productId) => {
  const res = await axiosInstance.delete(`/api/cart/remove/${productId}`);
  return res.data.data;
};

export const clearCartService = async () => {
  const res = await axiosInstance.delete("/api/cart/clear-cart");
  return res.data.data;
};
