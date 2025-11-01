import { axiosInstance } from "@/lib/axios";

// ✅ Get all reviews for a product
export const getReviewsService = async (productId) => {
  const res = await axiosInstance.get(`/api/reviews/${productId}`);
  return res.data.data;
};

// ✅ Add a review (multipart form)
export const addReviewService = async (productId, formData) => {
  const res = await axiosInstance.post(`/api/reviews/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// ✅ Update existing review
export const updateReviewService = async (productId, reviewId, formData) => {
  const res = await axiosInstance.patch(
    `/api/reviews/${productId}/${reviewId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data.data;
};

// ✅ Delete a review (user/admin)
export const deleteReviewService = async (productId, reviewId) => {
  const res = await axiosInstance.delete(
    `/api/reviews/${productId}/${reviewId}`
  );
  return res.data.data;
};
