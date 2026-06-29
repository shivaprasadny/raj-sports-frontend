import { configureStore } from "@reduxjs/toolkit";
import { categoryReducer } from "../features/category";
import { brandReducer } from "../features/brand";
import { cartReducer } from "../features/cart";
import { productReducer } from "../features/product";
import { wishlistReducer } from "../features/wishlist";

export const store = configureStore({
  reducer: {
    // Feature reducers keep frontend mock state organized by domain.
    brand: brandReducer,
    cart: cartReducer,
    category: categoryReducer,
    product: productReducer,
    // Wishlist is persisted to localStorage inside the slice itself.
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
