import { axiosInstance } from "@/lib/axios";

export const getProducts = async () => {
  const res = await axiosInstance.get("/api/product");
  return res.data.data;
};

export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("title", productData.title);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("stock", productData.stock);

  if (productData.category) {
    formData.append("category", productData.category);
  }
  if (productData.subcategory) {
    formData.append("subcategory", productData.subcategory);
  }

  // multiple images
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((img) => {
      formData.append("images", img); // backend should expect array of files
    });
  }

  const res = await axiosInstance.post("/api/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};
