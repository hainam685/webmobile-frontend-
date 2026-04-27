/**
 * Best Selling Products Slice - Refactored
 * Improved with better error handling and timestamp tracking
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';
import { getErrorMessage } from '../config/api';

/**
 * Load best selling products from API
 */
export const loadBestSellingProductsAsync = createAsyncThunk(
  'bestSellingProducts/loadBestSellingProductsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/api/getBestSellingProducts');
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.message || getErrorMessage(error.status) || 'Failed to load best selling products'
      );
    }
  }
);

// Initial State
const initialState = {
  BestSellingProducts: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const BestSellingProductsSlice = createSlice({
  name: 'bestSellingProducts',
  initialState,
  reducers: {
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset products
     */
    resetProducts: (state) => {
      state.BestSellingProducts = [];
      state.error = null;
      state.loading = false;
      state.lastUpdated = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBestSellingProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBestSellingProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.BestSellingProducts = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(loadBestSellingProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetProducts, setLoading } = BestSellingProductsSlice.actions;

export default BestSellingProductsSlice;
