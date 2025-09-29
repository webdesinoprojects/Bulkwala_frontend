import { create } from "zustand";
import { getCategories, createCategory } from "../services/category.service.js";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCategories();
      set({ categories: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await createCategory(categoryData);
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
