import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockProducts } from "../mocks/products";
import type { Product } from "../types/product";

interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: mockProducts,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Admin CRUD is local mock state until backend product APIs exist.
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((product) => product.id === action.payload.id);

      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter((product) => product.id !== action.payload);
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
