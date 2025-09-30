import { axiosInstance } from "@/lib/axios";

export const getCategories = async () => {
  const res = await axiosInstance.get("/api/category");
  return res.data.data;
};

export const createCategory = async (categoryData) => {
  console.log(categoryData.image);
  const formData = new FormData();

  formData.append("name", categoryData.name);
  formData.append("slug", categoryData.slug);

  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }
  const res = await axiosInstance.post("/api/category", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};
