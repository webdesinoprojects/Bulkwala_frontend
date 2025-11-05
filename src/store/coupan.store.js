import { create } from "zustand";
import {
  createCouponService,
  fetchCouponsService,
  validateCouponService,
} from "@/services/coupon.service";

export const useCouponStore = create((set, get) => ({
  coupons: [],
  isLoading: false,
  isValidating: false,

  fetchCoupons: async () => {
    set({ isLoading: true });
    try {
      const coupons = await fetchCouponsService();
      set({ coupons });
      return { success: true, data: coupons };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  createCoupon: async (data) => {
    set({ isLoading: true });
    try {
      const newCoupon = await createCouponService(data);
      set((state) => ({ coupons: [newCoupon, ...state.coupons] }));
      return { success: true, data: newCoupon };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  validateCoupon: async (data) => {
    set({ isValidating: true });
    try {
      const result = await validateCouponService(data);
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isValidating: false });
    }
  },
}));
