import {
  addToCartService,
  applyCouponService,
  applyReferralService,
  clearCartService,
  fetchCartService,
  removeCartItemService,
  removeCouponService,
  removeReferralService,
  updateCartItemService,
} from "@/services/cart.service";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  totalItems: 0,
  discount: 0,
  couponApplied: false,
  appliedCouponCode: "",
  referralApplied: false,
  referralCode: null,
  referralDiscount: 0,
  isLoading: false,
  isUpdating: false,
  couponError: "",
  buyNowProductId: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const cartData = await fetchCartService();
      set({
        cart: cartData,
        itemsPrice: cartData.itemsPrice || 0,
        shippingPrice: cartData.shippingPrice || 0,
        totalPrice: cartData.totalPrice || 0,
        discount: cartData.discount || 0,
        couponApplied: !!cartData.coupon,
        appliedCouponCode: cartData.couponCode || "",
        flashDiscount: cartData.flashDiscount || 0,
        flashDiscountPercent: cartData.flashDiscountPercent || 0,
        referralApplied: !!cartData.referralCode,
        referralCode: cartData.referralCode,
        referralDiscount: cartData.referralDiscount || 0,
        isLoading: false,
      });
      // get().calculateTotals();
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ isLoading: false });
    }
  },

  calculateTotals: () => {
    const state = get();
    const { cart } = state;
    const items = cart?.items || [];
    const itemsPrice = cart.itemsPrice || 0;
    const shippingPrice = cart.shippingPrice || 0;
    const discount = state.discount || 0;

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = itemsPrice + shippingPrice - discount;

    set({ totalItems, totalPrice });
  },

  applyCoupon: async (code) => {
    try {
      set({ isUpdating: true, couponError: null });
      const res = await applyCouponService(code);

      // ✅ When backend sends ApiResponse
      if (res.success) {
        await get().fetchCart();
        set({
          couponApplied: true,
          appliedCouponCode: code,
          discount: res.data?.discount || 0,
        });
        return { success: true, message: res.message };
      } else {
        const msg = res.message || "Invalid coupon code";
        set({ couponError: msg });
        return { success: false, message: msg };
      }
    } catch (err) {
      // ✅ Handle “already used” gracefully
      const msg =
        err.response?.data?.message || "Invalid or expired coupon code";
      set({ couponError: msg });
      return { success: false, message: msg };
    } finally {
      set({ isUpdating: false });
    }
  },

  removeCoupon: async () => {
    set({ isUpdating: true, couponError: "" });
    try {
      const response = await removeCouponService();

      set((state) => ({
        discount: 0,
        couponApplied: false,
        appliedCouponCode: "",
        cart: {
          ...state.cart,
          totalPrice: response.totalPrice || state.totalPrice,
        },
      }));

      get().calculateTotals();
    } catch (error) {
      console.error("Error removing coupon:", error);
      set({ couponError: error.response?.data?.message || error.message });
    } finally {
      set({ isUpdating: false });
    }
  },

  addToCart: async (productId, quantity) => {
    set({ isUpdating: true });
    try {
      const cartData = await addToCartService(productId, quantity);

      // if coupon no longer valid after new item total
      if (cartData.discount && cartData.totalPrice < cartData.minOrderValue) {
        set({
          discount: 0,
          couponApplied: false,
          appliedCouponCode: "",
        });
      }

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
          item.product._id === productId ? { ...item, quantity } : item
        );
        return { cart: { ...state.cart, items: updatedItems } };
      });
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

      set((state) => {
        const updatedItems = state.cart.items.filter(
          (item) => item.product._id !== productId
        );

        const newState = {
          cart: { ...state.cart, items: updatedItems },
        };

        // if no items left → clear coupon + discount
        if (updatedItems.length === 0) {
          newState.discount = 0;
          newState.couponApplied = false;
          newState.appliedCouponCode = "";
        }

        return newState;
      });

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
        cart: { items: [] },
        itemsPrice: 0,
        shippingPrice: 0,
        totalPrice: 0,
        discount: 0,
        couponApplied: false,
        appliedCouponCode: "",
        totalItems: 0,
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      set({ isUpdating: false });
    }
  },

  clearCartOnLogout: () => {
    set({
      cart: { items: [] },
      itemsPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      discount: 0,
      couponApplied: false,
      appliedCouponCode: "",
      totalItems: 0,
    });
  },

  // ✅ Apply Referral
  applyReferral: async (referralCode) => {
    set({ isUpdating: true });
    try {
      const res = await applyReferralService({ referralCode });
      await get().fetchCart();
      return { success: true, data: res };
    } catch (err) {
      // ✅ catch message from backend
      const message =
        err.response?.data?.message || "Invalid or expired referral code";
      return { success: false, message };
    } finally {
      set({ isUpdating: false });
    }
  },

  // ✅ Remove Referral
  removeReferral: async () => {
    set({ isUpdating: true });
    try {
      await removeReferralService();
      await get().fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      set({ isUpdating: false });
    }
  },

  setBuyNowProduct: (productId) => set({ buyNowProductId: productId }),

  clearBuyNow: () => set({ buyNowProductId: null }),
}));

export default useCartStore;
