import { axiosInstance } from "@/lib/axios";

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await axiosInstance.get(`/api/product?${query}`);
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
  formData.append("isTopMenu", productData.isTopMenu ?? false);
  formData.append("isNewlyLaunched", productData.isNewlyLaunched ?? false);

  // optional number fields
  if (productData.discountPrice !== undefined && productData.discountPrice !== "")
    formData.append("discountPrice", productData.discountPrice);
  if (productData.gstSlab !== undefined && productData.gstSlab !== "")
    formData.append("gstSlab", productData.gstSlab);

  // multiple images
  if (productData.images && productData.images.length > 0) {
    Array.from(productData.images).forEach((img) => {
      formData.append("images", img);
    });
  }

  // single video
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

  try {
    const res = await axiosInstance.post("/api/product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.message ||
      err.message ||
      "Failed to add product";
    throw new Error(message);
  }
};

export const deleteProduct = async (slug) => {
  try {
    const res = await axiosInstance.delete(`/api/product/${slug}`);
    return res.data.data;
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || err.message;
    throw new Error(message);
  }
};

export const restoreProduct = async (slug) => {
  try {
    const res = await axiosInstance.patch(`/api/product/${slug}/restore`);
    return res.data.data;
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || err.message;
    throw new Error(message);
  }
};

export const updateProduct = async (slug, productData) => {
  const res = await axiosInstance.put(`/api/product/${slug}`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const getProduct = async (slug) => {
  const res = await axiosInstance.get(`/api/product/${slug}`);
  return res.data.data;
};
