import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mockBrands } from "../mocks/brands";
import type { Brand } from "../types/brand";

interface BrandState {
  brands: Brand[];
}

const initialState: BrandState = {
  brands: mockBrands,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    // Mock CRUD reducers let admin screens behave like real forms.
    addBrand: (state, action: PayloadAction<Brand>) => {
      state.brands.push(action.payload);
    },
    updateBrand: (state, action: PayloadAction<Brand>) => {
      const index = state.brands.findIndex((brand) => brand.id === action.payload.id);

      if (index !== -1) {
        state.brands[index] = action.payload;
      }
    },
    deleteBrand: (state, action: PayloadAction<number>) => {
      state.brands = state.brands.filter((brand) => brand.id !== action.payload);
    },
  },
});

export const { addBrand, updateBrand, deleteBrand } = brandSlice.actions;
export default brandSlice.reducer;
