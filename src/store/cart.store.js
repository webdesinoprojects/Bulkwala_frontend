import {
  addToCartService,
  clearCartService,
  fetchCartService,
  removeCartItemService,
  updateCartItemService,
} from "@/services/cart.service";
import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: { items: [] },
  isLoading: false,
  isUpdating: false,

  addToCart: async (productId, quantity) => {
    set({ isUpdating: true });
    try {
      const cartData = await addToCartService(productId, quantity);
      set({ cart: cartData, isUpdating: false });
    } catch (error) {
      set({ isUpdating: false });
      console.error("Error adding to cart:", error);
    }
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cartData = await fetchCartService();
      set({ cart: cartData, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateCart: async (productId, quantity) => {
    set({ isUpdating: true });
    try {
      await updateCartItemService(productId, quantity);
      set((state) => {
        const updatedItems = state.cart.items.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        );
        return { cart: { ...state.cart, items: updatedItems } };
      });
    } catch (error) {
      set({ isUpdating: false });
    } finally {
      set({ isUpdating: false });
    }
  },

  removeCartItem: async (productId) => {
    set({ isUpdating: true });
    try {
      await removeCartItemService(productId);
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            (item) => item.product._id !== productId
          ),
        },
      }));
    } catch (error) {
      set({ isUpdating: false });
    } finally {
      set({ isUpdating: false });
    }
  },

  clearCart: async () => {
    set({ isUpdating: true });
    try {
      await clearCartService();
      set({ cart: { items: [] } });
    } catch (error) {
      set({ isUpdating: false });
    } finally {
      set({ isUpdating: false });
    }
  },
}));

export default useCartStore;
