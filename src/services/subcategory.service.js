import { axiosInstance } from "@/lib/axios";

export const getSubcategories = async () => {
  const res = await axiosInstance.get("api/subcategories");
  return res.data.data;
};

export const createSubcategory = async (subcategoryData) => {
  const res = await axiosInstance.post("api/subcategories", subcategoryData);
  return res.data.data;
};
