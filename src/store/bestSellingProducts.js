import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const loadBestSellingProductsAsync = createAsyncThunk(
  "products/loadBestSellingProductsAsync",
  async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getBestSellingProducts`);
    return res.data;
  }
);

const initialState = {
  BestSellingProducts: [],
  loading : false,
  error: null,
};
const BestSellingProductsSlice = createSlice({
  name: "bestSellingProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   builder
      .addCase(loadBestSellingProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBestSellingProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.BestSellingProducts = action.payload;
      })
      .addCase(loadBestSellingProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default BestSellingProductsSlice;
