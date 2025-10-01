import { axiosInstance } from "@/lib/axios";

export const getProducts = async () => {
  const res = await axiosInstance.get("/api/product");
  return res.data.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("title", productData.title);
  formData.append("slug", productData.slug);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("stock", productData.stock);

  if (productData.category) formData.append("category", productData.category);
  if (productData.subcategory)
    formData.append("subcategory", productData.subcategory);

  // tags
  if (productData.tags && productData.tags.length > 0) {
    productData.tags.forEach((tag) => formData.append("tags", tag));
  }

  // booleans
  formData.append("isActive", productData.isActive);
  formData.append("isFeatured", productData.isFeatured);

  // multiple images
  if (productData.images && productData.images.length > 0) {
    Array.from(productData.images).forEach((img) => {
      formData.append("images", img);
    });
  }

  const res = await axiosInstance.post("/api/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};
