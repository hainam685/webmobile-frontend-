/**
 * Cart Slice - Refactored
 * Improved error handling, input validation, and sync between local and server
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';
import { sanitizeObject } from '../utils/validation';

// Constants
const CART_STORAGE_KEY = 'cartItems';

// Helper functions
const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const setLocalCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error storing cart:', error);
  }
};

const findCartItem = (cart, { productId, color, rom }) =>
  cart.find(
    (item) =>
      item.productId === productId &&
      item.color === color &&
      item.rom === rom
  );

const validateQuantity = (quantity) => {
  const qty = parseInt(quantity, 10);
  return Math.max(1, Math.min(qty, 999));
};

const updateOrAddItem = (cart, item) => {
  const validItem = {
    ...item,
    quantity: validateQuantity(item.quantity),
  };

  const existing = findCartItem(cart, validItem);
  if (existing) {
    existing.quantity = validateQuantity(
      existing.quantity + validItem.quantity
    );
  } else {
    cart.push(validItem);
  }
  return cart;
};

// Async Thunks
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await apiClient.get('/api/getCart');
        return res.data.cart?.items || [];
      }
      return getLocalCart();
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to load cart'
      );
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (itemToAdd, { rejectWithValue }) => {
    try {
      // Validate and sanitize input
      if (!itemToAdd.productId || !itemToAdd.color || !itemToAdd.rom) {
        throw new Error('Missing required cart item fields');
      }

      const validItem = {
        ...sanitizeObject(itemToAdd),
        quantity: validateQuantity(itemToAdd.quantity || 1),
      };

      const token = localStorage.getItem('token');

      if (!token) {
        const localCart = getLocalCart();
        updateOrAddItem(localCart, validItem);
        setLocalCart(localCart);
        return { items: localCart };
      }

      // Fetch current cart and user data in parallel
      const [userRes, cartRes] = await Promise.all([
        apiClient.get('/auth/user'),
        apiClient.get('/api/getCart'),
      ]);

      const serverCart = cartRes.data.cart?.items || [];
      updateOrAddItem(serverCart, validItem);

      const totalAmount = serverCart.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );

      const { fullName, email, numberPhone, address } = userRes.data;

      await apiClient.post('/api/saveCart', {
        items: serverCart,
        totalAmount,
        userInfo: {
          fullName: fullName || '',
          email: email || '',
          numberPhone: numberPhone || '',
          address: address || '',
        },
      });

      return { items: serverCart };
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to add item to cart'
      );
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (itemToRemove, { rejectWithValue }) => {
    try {
      if (!itemToRemove.productId || !itemToRemove.color || !itemToRemove.rom) {
        throw new Error('Missing required item fields');
      }

      const token = localStorage.getItem('token');

      if (!token) {
        const localCart = getLocalCart();
        const filtered = localCart.filter(
          (item) => !findCartItem([itemToRemove], item)
        );
        setLocalCart(filtered);
        return filtered;
      }

      const res = await apiClient.put('/api/removeItemFromCart', itemToRemove);
      return res.data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to remove item from cart'
      );
    }
  }
);

export const updateCartQuantityAsync = createAsyncThunk(
  'cart/updateCartQuantityAsync',
  async ({ productId, color, rom, quantity }, { rejectWithValue }) => {
    try {
      if (!productId || !color || !rom) {
        throw new Error('Missing required item fields');
      }

      const validQuantity = validateQuantity(quantity);
      const token = localStorage.getItem('token');

      if (!token) {
        const localCart = getLocalCart();
        const item = findCartItem(localCart, { productId, color, rom });
        if (item) {
          item.quantity = validQuantity;
        }
        setLocalCart(localCart);
        return localCart;
      }

      const res = await apiClient.put('/api/updateCartQuantity', {
        productId,
        color,
        rom,
        quantity: validQuantity,
      });
      return res.data.items || [];
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to update cart quantity'
      );
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await apiClient.post('/api/clearCart', {});
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      return [];
    } catch (error) {
      return rejectWithValue(
        error.message || 'Failed to clear cart'
      );
    }
  }
);

// Initial State
const initialState = {
  items: getLocalCart(),
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    // Load Cart
    builder
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to Cart
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Quantity
    builder
      .addCase(updateCartQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCartQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice;
