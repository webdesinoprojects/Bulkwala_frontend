import { axiosInstance } from "@/lib/axios";

export const getCategories = async () => {
  const res = await axiosInstance.get("api/categories");
  return res.data.data;
};

export const createCategory = async (categoryData) => {
  const res = await axiosInstance.post("api/categories", categoryData);
  return res.data.data;
};
