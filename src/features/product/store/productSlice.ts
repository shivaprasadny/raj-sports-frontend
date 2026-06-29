import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductService } from "../../../services/ProductService";
import type { Product } from "../types/product";

interface ProductState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

export const fetchProducts = createAsyncThunk("product/fetchAll", () =>
  ProductService.getAll()
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
