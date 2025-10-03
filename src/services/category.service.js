import { axiosInstance } from "@/lib/axios";

export const getCategories = async () => {
  const res = await axiosInstance.get("/api/category");
  return res.data.data;
};

export const createCategory = async (categoryData) => {
  const formData = new FormData();

  formData.append("name", categoryData.name);
  if (categoryData.slug) {
    formData.append("slug", categoryData.slug);
  }

  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  // 🆕 handle banners
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
