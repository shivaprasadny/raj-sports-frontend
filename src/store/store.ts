import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "../features/category";
import { brandReducer } from "../features/brand";
import { cartReducer } from "../features/cart";
import { productReducer } from "../features/product";

export const store = configureStore({
  reducer: {
    // Feature reducers keep frontend mock state organized by domain.
    brand: brandReducer,
    cart: cartReducer,
    category: categoryReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
