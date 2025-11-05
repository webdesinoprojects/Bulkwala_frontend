import { axiosInstance } from "@/lib/axios";

export const uploadBannerService = async (formData) => {
  const res = await axiosInstance.post("/api/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const fetchBannersService = async () => {
  const res = await axiosInstance.get("/api/banners/active");
  return res.data.data;
};

export const deactivateBannerService = async (id) => {
  const res = await axiosInstance.put(`/api/banners/${id}/deactivate`);
  return res.data.data;
};
