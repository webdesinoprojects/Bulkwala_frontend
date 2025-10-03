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

  //  single video
  if (productData.video) {
    formData.append("video", productData.video);
  }
  if (productData.sku && productData.sku.trim() !== "") {
    formData.append("sku", productData.sku.trim());
  }
  if (productData.genericName && productData.genericName.trim() !== "") {
    formData.append("genericName", productData.genericName.trim());
  }
  if (
    productData.manufacturerName &&
    productData.manufacturerName.trim() !== ""
  ) {
    formData.append("manufacturerName", productData.manufacturerName.trim());
  }

  if (productData.countryOfOrigin)
    formData.append("countryOfOrigin", productData.countryOfOrigin);

  // colors
  if (productData.color && productData.color.length > 0) {
    productData.color.forEach((c) => formData.append("color", c));
  }

  const res = await axiosInstance.post("/api/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};
