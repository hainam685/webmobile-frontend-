/**
 * Product Slice - Refactored
 * Improved with helper functions, better state management, and error handling
 */

import { createSlice } from '@reduxjs/toolkit';
import { sanitizeObject } from '../utils/validation';

// Helper functions for efficient lookups
const findProductIndex = (products, productId) =>
  products.findIndex((p) => p._id === productId);

const findRomIndex = (roms, romValue) =>
  roms.findIndex((r) => r.rom === romValue);

const findVariantIndex = (variants, color) =>
  variants.findIndex((v) => v.color === color);

const normalizeRom = (rom) => ({
  rom: rom.rom,
  price: rom.price || 0,
  isDiscount: rom.isDiscount || false,
  variants: Array.isArray(rom.variants)
    ? rom.variants.map(normalizeVariant)
    : [],
});

const normalizeVariant = (variant) => ({
  color: variant.color,
  quantity: variant.quantity || 0,
  image: variant.image || '',
  sold: variant.sold || 0,
  isDiscount: variant.isDiscount || false,
});

const normalizeProduct = (product) => ({
  _id: product._id,
  name: product.name || '',
  category: product.category || '',
  roms: Array.isArray(product.roms)
    ? product.roms.map(normalizeRom)
    : [],
  lastUpdated: new Date().toISOString(),
});

// Initial State
const initialState = {
  Product: [],
  loading: false,
  error: null,
};

// Slice
const ProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    /**
     * Set all products (replace entire list)
     */
    setProduct: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.Product = action.payload.map(normalizeProduct);
        state.error = null;
      }
    },

    /**
     * Add or merge a product
     * Merges ROMs and variants if product already exists
     */
    addProduct: (state, action) => {
      const newProduct = action.payload;

      if (!newProduct._id) {
        state.error = 'Product ID is required';
        return;
      }

      try {
        const sanitized = sanitizeObject(newProduct);
        const normalized = normalizeProduct(sanitized);

        const existingIndex = findProductIndex(state.Product, normalized._id);

        if (existingIndex !== -1) {
          // Product exists - merge ROMs and variants
          const existing = state.Product[existingIndex];

          normalized.roms.forEach((newRom) => {
            const romIndex = findRomIndex(existing.roms, newRom.rom);

            if (romIndex !== -1) {
              // ROM exists - merge variants
              const existingRom = existing.roms[romIndex];
              existingRom.price = newRom.price;
              existingRom.isDiscount = newRom.isDiscount;

              newRom.variants.forEach((newVariant) => {
                const variantIndex = findVariantIndex(
                  existingRom.variants,
                  newVariant.color
                );

                if (variantIndex !== -1) {
                  // Variant exists - update it
                  Object.assign(existingRom.variants[variantIndex], newVariant);
                } else {
                  // Variant doesn't exist - add it
                  existingRom.variants.push(newVariant);
                }
              });
            } else {
              // ROM doesn't exist - add new ROM
              existing.roms.push(newRom);
            }
          });

          existing.lastUpdated = normalized.lastUpdated;
        } else {
          // Product doesn't exist - add new product
          state.Product.push(normalized);
        }

        state.error = null;
      } catch (error) {
        state.error = error.message || 'Error adding product';
      }
    },

    /**
     * Update existing product
     */
    updateProduct: (state, action) => {
      const updatedData = action.payload;

      if (!updatedData._id) {
        state.error = 'Product ID is required';
        return;
      }

      try {
        const sanitized = sanitizeObject(updatedData);
        const productIndex = findProductIndex(state.Product, sanitized._id);

        if (productIndex === -1) {
          state.error = `Product with ID ${sanitized._id} not found`;
          return;
        }

        const product = state.Product[productIndex];

        // Update basic info
        if (sanitized.name) product.name = sanitized.name;
        if (sanitized.category) product.category = sanitized.category;

        // Update ROMs if provided
        if (Array.isArray(sanitized.roms)) {
          sanitized.roms.forEach((updatedRom) => {
            const romIndex = findRomIndex(product.roms, updatedRom.rom);

            if (romIndex !== -1) {
              const rom = product.roms[romIndex];
              if (updatedRom.price !== undefined) rom.price = updatedRom.price;
              if (updatedRom.isDiscount !== undefined)
                rom.isDiscount = updatedRom.isDiscount;

              // Update variants
              if (Array.isArray(updatedRom.variants)) {
                updatedRom.variants.forEach((updatedVariant) => {
                  const variantIndex = findVariantIndex(
                    rom.variants,
                    updatedVariant.color
                  );

                  if (variantIndex !== -1) {
                    Object.assign(
                      rom.variants[variantIndex],
                      normalizeVariant(updatedVariant)
                    );
                  } else {
                    rom.variants.push(normalizeVariant(updatedVariant));
                  }
                });
              }
            }
          });
        }

        product.lastUpdated = new Date().toISOString();
        state.error = null;
      } catch (error) {
        state.error = error.message || 'Error updating product';
      }
    },

    /**
     * Remove product by ID
     */
    removeProduct: (state, action) => {
      const productId = action.payload;

      if (!productId) {
        state.error = 'Product ID is required';
        return;
      }

      const index = findProductIndex(state.Product, productId);

      if (index !== -1) {
        state.Product.splice(index, 1);
        state.error = null;
      } else {
        state.error = `Product with ID ${productId} not found`;
      }
    },

    /**
     * Update specific ROM price and discount status
     */
    updateRomPrice: (state, action) => {
      const { productId, rom, price, isDiscount } = action.payload;

      const productIndex = findProductIndex(state.Product, productId);
      if (productIndex === -1) return;

      const romIndex = findRomIndex(state.Product[productIndex].roms, rom);
      if (romIndex === -1) return;

      const romObj = state.Product[productIndex].roms[romIndex];
      if (price !== undefined) romObj.price = price;
      if (isDiscount !== undefined) romObj.isDiscount = isDiscount;

      state.Product[productIndex].lastUpdated = new Date().toISOString();
    },

    /**
     * Update variant quantity
     */
    updateVariantQuantity: (state, action) => {
      const { productId, rom, color, quantity } = action.payload;

      const productIndex = findProductIndex(state.Product, productId);
      if (productIndex === -1) return;

      const romIndex = findRomIndex(state.Product[productIndex].roms, rom);
      if (romIndex === -1) return;

      const variantIndex = findVariantIndex(
        state.Product[productIndex].roms[romIndex].variants,
        color
      );
      if (variantIndex === -1) return;

      const validQuantity = Math.max(0, parseInt(quantity, 10));
      state.Product[productIndex].roms[romIndex].variants[
        variantIndex
      ].quantity = validQuantity;

      state.Product[productIndex].lastUpdated = new Date().toISOString();
    },

    /**
     * Reset all products
     */
    resetProducts: (state) => {
      state.Product = [];
      state.error = null;
      state.loading = false;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setProduct,
  addProduct,
  updateProduct,
  removeProduct,
  updateRomPrice,
  updateVariantQuantity,
  resetProducts,
  clearError,
  setLoading,
} = ProductSlice.actions;

export default ProductSlice;
