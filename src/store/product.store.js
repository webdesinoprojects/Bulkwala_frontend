import {
  createProduct,
  getProducts,
  deleteProduct,
  restoreProduct,
  updateProduct,
  getProduct,
} from "@/services/product.service";
import { create } from "zustand";

export const useProductStore = create((set) => ({
  singleProduct: null,
  products: [],
  topProducts: [],
  newlyLaunchedProducts: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 12,
  filter: {},

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await getProducts(params);
      set({
        products: data.products,
        total: data.total,
        page: data.page,
        limit: data.limit,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTopProducts: async () => {
    try {
      const data = await getProducts({ isTopMenu: true, limit: 10 });
      set({ topProducts: data.products });
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchNewlyLaunchedProducts: async () => {
    try {
      const data = await getProducts({ isNewlyLaunched: true, limit: 10 });
      set({ newlyLaunchedProducts: data.products });
    } catch (error) {
      set({ error: error.message });
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
      throw error;
    }
  },

  editProduct: async (slug, productData) => {
    set({ loading: true, error: null });
    try {
      // ✅ Directly pass FormData if already provided
      let formData;

      if (productData instanceof FormData) {
        formData = productData;
      } else {
        formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => {
          if (key === "images" && value?.length > 0) {
            Array.from(value).forEach((img) => formData.append("images", img));
          } else if (Array.isArray(value)) {
            value.forEach((v) => formData.append(key, v));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
      }

      // ✅ Add slug & sku checks
      if (productData.slug) formData.append("slug", productData.slug);
      if (productData.sku) formData.append("sku", productData.sku);

      const updatedProduct = await updateProduct(slug, formData);

      set((state) => {
        const updatedList = Array.isArray(state.products)
          ? state.products.map((p) => (p.slug === slug ? updatedProduct : p))
          : (state.products?.products || []).map((p) =>
              p.slug === slug ? updatedProduct : p
            );

        return { products: updatedList, loading: false };
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Update failed:", error);
      }
      set({ error: error.message, loading: false });
      throw error;
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
      if (process.env.NODE_ENV === "development") {
        console.error("Delete failed:", error);
      }
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  restoreProduct: async (slug) => {
    set({ loading: true, error: null });
    try {
      const restored = await restoreProduct(slug);
      set((state) => {
        const list = Array.isArray(state.products)
          ? state.products
          : (state.products?.products || []);
        const updatedList = list.map((p) =>
          p.slug === slug ? { ...p, isDeleted: false } : p
        );
        return { products: updatedList, loading: false };
      });
      return restored;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getProductBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const product = await getProduct(slug);
      set({ singleProduct: product, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
