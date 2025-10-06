import {
  createProduct,
  getProducts,
  deleteProduct,
} from "@/services/product.service";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts();
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await createProduct(productData);
      set((state) => ({
        products: Array.isArray(state.products)
          ? [...state.products, newProduct]
          : [...(state.products?.products || []), newProduct],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProduct: async (slug) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(slug);
      set((state) => {
        const updatedList = Array.isArray(state.products)
          ? state.products.filter((product) => product.slug !== slug)
          : (state.products?.products || []).filter(
              (product) => product.slug !== slug
            );
        return { products: updatedList, loading: false };
      });
    } catch (error) {
      console.error("Delete failed:", error);
      set({ error: error.message, loading: false });
    }
  },
}));
