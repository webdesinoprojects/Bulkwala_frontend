import { create } from "zustand";
import {
  uploadBannerService,
  fetchBannersService,
  deactivateBannerService,
} from "@/services/banner.service";

export const useBannerStore = create((set, get) => ({
  banners: [],
  isLoading: false,
  isUpdating: false,

  fetchBanners: async () => {
    set({ isLoading: true });
    try {
      const banners = await fetchBannersService();
      set({ banners });
      return { success: true, data: banners };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  uploadBanner: async (formData) => {
    set({ isUpdating: true });
    try {
      const newBanner = await uploadBannerService(formData);
      set((state) => ({ banners: [newBanner, ...state.banners] }));
      return { success: true, data: newBanner };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isUpdating: false });
    }
  },

  deactivateBanner: async (id) => {
    set({ isUpdating: true });
    try {
      await deactivateBannerService(id);
      set((state) => ({
        banners: state.banners.filter((b) => b._id !== id),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isUpdating: false });
    }
  },
}));
