import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryService } from "../../../services/CategoryService";
import type { Category } from "../types/category";

interface CategoryState {
  categories: Category[];
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
};

export const fetchCategories = createAsyncThunk("category/fetchAll", () =>
  CategoryService.getAll()
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
