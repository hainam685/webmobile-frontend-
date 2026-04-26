/**
 * usePaginatedData Hook
 * Redux-integrated hook for paginating data
 */

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setItemsPerPage, setFilters, resetPagination } from '../store/pagination';

/**
 * Hook for managing paginated data from Redux
 * @param {Array} data - Array of items to paginate
 * @returns {object} Pagination state and functions
 */
export const usePaginatedData = (data = []) => {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage, filters } = useSelector(
    (state) => state.pagination
  );

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!Array.isArray(data) || Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key];
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(String(value).toLowerCase());
        }
        return itemValue === value;
      });
    });
  }, [data, filters]);

  // Calculate pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const validPage = Math.min(currentPage, Math.max(1, totalPages));
    const start = (validPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return {
      currentData: filteredData.slice(start, end),
      totalPages,
      totalItems: filteredData.length,
      validPage,
    };
  }, [filteredData, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    dispatch(setCurrentPage(validPage));
  };

  const goToNextPage = () => {
    if (currentPage < paginationData.totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    currentPage: paginationData.validPage,
    totalPages: paginationData.totalPages,
    totalItems: paginationData.totalItems,
    currentData: paginationData.currentData,
    itemsPerPage,
    goToPage,
    goToNextPage,
    goToPrevPage,
    updateItemsPerPage: (items) => dispatch(setItemsPerPage(items)),
    updateFilters: (newFilters) => dispatch(setFilters(newFilters)),
    resetPagination: () => dispatch(resetPagination()),
  };
};

export default usePaginatedData;
