import { create } from "zustand";
import {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
  clearWishlistService,
} from "@/services/wishlist.service";

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getWishlistService();
      set({ wishlist: data.products || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const state = get();
    const exists = state.wishlist.some((p) => p._id === productId);

    // ✅ Optimistic update (instant feedback)
    set({
      wishlist: exists
        ? state.wishlist.filter((p) => p._id !== productId)
        : [...state.wishlist, { _id: productId }],
    });

    try {
      const data = await addToWishlistService(productId);

      // ✅ Sync final state with backend (ensure accurate data)
      set({ wishlist: data.products || [] });
    } catch (error) {
      console.error("Wishlist toggle failed:", error);

      // ❌ Rollback optimistic update if API fails
      set({
        wishlist: exists
          ? [...state.wishlist, { _id: productId }]
          : state.wishlist.filter((p) => p._id !== productId),
      });
    }
  },

  removeWishlistItem: async (productId) => {
    try {
      const data = await removeFromWishlistService(productId);
      set({ wishlist: data.products || [] });
    } catch (error) {
      set({ error: error.message });
    }
  },

  clearWishlist: async () => {
    try {
      await clearWishlistService();
      set({ wishlist: [] });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
