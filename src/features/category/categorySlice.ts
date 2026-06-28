import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockCategories } from "../../mocks/categories";
import type { Category } from "../../types/category";

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
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
  },
});

export const { addCategory } = categorySlice.actions;
export default categorySlice.reducer;