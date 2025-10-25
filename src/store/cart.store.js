import {
  addToCartService,
  clearCartService,
  fetchCartService,
  removeCartItemService,
  updateCartItemService,
} from "@/services/cart.service";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  totalItems: 0,
  isLoading: false,
  isUpdating: false,

  calculateTotals: () => {
    const { items, itemsPrice, shippingPrice, taxPrice } = get().cart;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    set({ totalPrice, totalItems });
  },

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cartData = await fetchCartService();
      set({
        cart: cartData,
        itemsPrice: cartData.itemsPrice,
        shippingPrice: cartData.shippingPrice,
        taxPrice: cartData.taxPrice,
        totalPrice: cartData.totalPrice,
        isLoading: false,
      });
      get().calculateTotals(); // ✅ auto update totals
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    set({ isUpdating: true });
    try {
      const cartData = await addToCartService(productId, quantity);
      set({ cart: cartData, isUpdating: false });
      get().calculateTotals();
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ isUpdating: false });
    }
  },

  updateCart: async (productId, quantity) => {
    set({ isUpdating: true });
    try {
      await updateCartItemService(productId, quantity);
      set((state) => {
        const updatedItems = state.cart.items.map((item) =>
          item.product._id === productId
            ? { ...item, quantity, totalPrice: item.product.price * quantity }
            : item
        );
        return { cart: { ...state.cart, items: updatedItems } };
      });

      console.log("Updated Cart State:", get().cart);

      get().calculateTotals();
    } catch (error) {
      console.error("Error updating cart:", error);
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
      get().calculateTotals();
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      set({ isUpdating: false });
    }
  },

  clearCart: async () => {
    set({ isUpdating: true });
    try {
      await clearCartService();
      set({
        cart: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
        totalItems: 0,
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      set({ isUpdating: false });
    }
  },
}));

export default useCartStore;
