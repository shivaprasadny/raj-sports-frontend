import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../product/types/product";

// localStorage key used to persist the wishlist across page refreshes.
const WISHLIST_KEY = "raj_sports_wishlist";

interface WishlistState {
  items: Product[];
}

// Load saved wishlist items from localStorage. Falls back to empty on any error.
const loadWishlist = (): Product[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
};

// Persist the current items array to localStorage after every mutation.
const persist = (items: Product[]) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // Ignore write errors (e.g., private browsing quota).
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: loadWishlist() } as WishlistState,
  reducers: {
    // Toggle a product in/out of the wishlist in one action.
    // ProductCard and ProductDetails both call this single action.
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }

      persist(state.items);
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state.items);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
