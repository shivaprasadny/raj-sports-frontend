import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../product";
import type { CartState } from "../types/cart";

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Cart reducers keep product purchasing UI local until checkout exists.
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push({
        productId: product.id,
        name: product.name,
        price: product.salePrice ?? product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((cartItem) => cartItem.productId === action.payload);

      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((cartItem) => cartItem.productId === action.payload);

      if (!item) return;

      if (item.quantity <= 1) {
        state.items = state.items.filter((cartItem) => cartItem.productId !== action.payload);
        return;
      }

      item.quantity -= 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
