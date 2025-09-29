import { create } from "zustand";
import {
  getSubcategories,
  createSubcategory,
} from "../services/subcategory.service.js";

export const useSubcategoryStore = create((set) => ({
  subcategories: [],
  loading: false,
  error: null,

  fetchSubcategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getSubcategories();
      set({ subcategories: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addSubcategory: async (subcategoryData) => {
    set({ loading: true, error: null });
    try {
      const newSubcategory = await createSubcategory(subcategoryData);
      set((state) => ({
        subcategories: [...state.subcategories, newSubcategory],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
