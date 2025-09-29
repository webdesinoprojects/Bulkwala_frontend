import { axiosInstance } from "@/lib/axios";

export const getProducts = async () => {
  const res = await axiosInstance.get("api/products");
  return res.data.data;
};

export const createProduct = async (productData) => {
  const res = await axiosInstance.post("api/products", productData);
  return res.data.data;
};
