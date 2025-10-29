import { create } from "zustand";
import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
  clearWishlistService,
} from "@/services/wishlist.service";

export const useWishlistStore = create((set) => ({
  wishlist: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const data = await getWishlistService();
      set({ wishlist: data.products || [], isLoading: false });
    } catch (error) {
      console.error("Fetch wishlist failed:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      set({ isLoading: true });
      const data = await addToWishlistService(productId);
      set({ wishlist: data.products || [], isLoading: false });
      return data.products || [];
    } catch (error) {
      console.error("Toggle wishlist failed:", error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  removeWishlistItem: async (productId) => {
    try {
      set({ isLoading: true });
      const data = await removeFromWishlistService(productId);
      set({ wishlist: data.products || [], isLoading: false });
    } catch (error) {
      console.error("Remove wishlist item failed:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  clearWishlist: async () => {
    try {
      set({ isLoading: true });
      await clearWishlistService();
      set({ wishlist: [], isLoading: false });
    } catch (error) {
      console.error("Clear wishlist failed:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
