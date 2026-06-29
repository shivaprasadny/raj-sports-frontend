import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BrandService } from "../../../services/BrandService";
import type { Brand } from "../types/brand";

interface BrandState {
  brands: Brand[];
  loading: boolean;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
};

export const fetchBrands = createAsyncThunk("brand/fetchAll", () =>
  BrandService.getAll()
);

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default brandSlice.reducer;
