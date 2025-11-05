import { create } from "zustand";
import {
  startOfferService,
  fetchActiveOfferService,
} from "@/services/offer.service";

export const useOfferStore = create((set, get) => ({
  activeOffer: null,
  isLoading: false,

  startOffer: async (data) => {
    set({ isLoading: true });
    try {
      const offer = await startOfferService(data);
      set({ activeOffer: offer });
      return { success: true, data: offer };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActiveOffer: async () => {
    set({ isLoading: true });
    try {
      const offer = await fetchActiveOfferService();
      set({ activeOffer: offer });
      return { success: true, data: offer };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));
