import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockCategories } from "../mocks/categories";
import type { Category } from "../types/category";

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: mockCategories,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Mock CRUD reducers keep category management frontend-only for now.
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((category) => category.id === action.payload.id);

      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      state.categories = state.categories.filter((category) => category.id !== action.payload);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;
