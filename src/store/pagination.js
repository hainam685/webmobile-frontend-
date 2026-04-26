/**
 * Pagination Slice
 * Centralized pagination state management
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 1,
  itemsPerPage: 10,
  filters: {},
  sorting: {
    field: null,
    order: 'asc', // asc or desc
  },
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = Math.max(1, action.payload);
    },
    setItemsPerPage: (state, action) => {
      const items = Math.max(1, Math.min(100, action.payload));
      state.itemsPerPage = items;
      state.currentPage = 1; // Reset to first page
    },
    setFilters: (state, action) => {
      state.filters = action.payload || {};
      state.currentPage = 1; // Reset to first page when filters change
    },
    setSorting: (state, action) => {
      state.sorting = action.payload;
      state.currentPage = 1; // Reset to first page when sorting changes
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.filters = {};
      state.sorting = { field: null, order: 'asc' };
    },
  },
});

export const { setCurrentPage, setItemsPerPage, setFilters, setSorting, resetPagination } =
  paginationSlice.actions;

export default paginationSlice;
