

import { axiosInstance } from "@/lib/axios";

export const getSubcategories = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/api/subcategory?${query}`);
  return res.data.data;
};

export const createSubcategory = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("category", data.category);
  if (data.slug) formData.append("slug", data.slug);
  if (data.image) formData.append("image", data.image);

  const res = await axiosInstance.post("/api/subcategory", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};
export const updateSubcategory = async (slug, data) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.category) formData.append("category", data.category);
  if (data.slug) formData.append("slug", data.slug);
  if (data.image) formData.append("image", data.image);

  const res = await axiosInstance.put(`/api/subcategory/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const deleteSubcategory = async (slug) => {
  const res = await axiosInstance.delete(`/api/subcategory/${slug}`);
  return res.data.data;
};