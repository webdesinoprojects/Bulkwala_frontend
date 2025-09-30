import { axiosInstance } from "@/lib/axios";

export const getSubcategories = async () => {
  const res = await axiosInstance.get("/api/subcategory");
  return res.data.data;
};

export const createSubcategory = async (subcategoryData) => {
  const formData = new FormData();
  formData.append("name", subcategoryData.name);
  formData.append("slug", subcategoryData.slug);
  formData.append("description", subcategoryData.description);
  formData.append("category", subcategoryData.category);

  if (subcategoryData.image) {
    formData.append("image", subcategoryData.image);
  }

  const res = await axiosInstance.post("/api/subcategory", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};
