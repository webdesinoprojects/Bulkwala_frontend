import { axiosInstance } from "@/lib/axios";

export const getCategories = async () => {
  const res = await axiosInstance.get("/api/category");
  return res.data.data;
};

export const createCategory = async (categoryData) => {
  const formData = new FormData();
  formData.append("name", categoryData.name);
  if (categoryData.slug) formData.append("slug", categoryData.slug);
  if (categoryData.image) formData.append("image", categoryData.image);

  if (categoryData.banner && categoryData.banner.length > 0) {
    categoryData.banner.forEach((file) => {
      formData.append("banner", file);
    });
  }

  const res = await axiosInstance.post("/api/category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// 🆕 UPDATE CATEGORY
export const updateCategory = async (slug, categoryData) => {
  const formData = new FormData();
  if (categoryData.name) formData.append("name", categoryData.name);
  if (categoryData.image) formData.append("image", categoryData.image);
  if (categoryData.banner && categoryData.banner.length > 0) {
    categoryData.banner.forEach((file) => {
      formData.append("banner", file);
    });
  }

  const res = await axiosInstance.put(`/api/category/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// 🆕 DELETE CATEGORY
export const deleteCategory = async (slug) => {
  const res = await axiosInstance.delete(`/api/category/${slug}`);
  return res.data.data;
};
