import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getCart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.cart?.items || [];
    } else {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async ({ productId, color, rom }, { getState }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const currentCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = currentCartItems.filter(
        item => !(item.productId === productId && item.color === color && item.rom === rom)
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      return updatedCartItems;
    } else {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/removeItemFromCart`,
        { productId, color, rom },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.items;
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (itemToAdd, { getState }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existing = localCart.find(
        item => item.productId === itemToAdd.productId && item.rom === itemToAdd.rom && item.color === itemToAdd.color
      );
      if (existing) {
        existing.quantity += itemToAdd.quantity;
      } else {
        localCart.push(itemToAdd);
      }
      localStorage.setItem("cartItems", JSON.stringify(localCart));
      return { items: localCart };
    } else {
      const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = userRes.data;

      const cartRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getCart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let serverCart = cartRes.data.cart?.items || [];

      const existing = serverCart.find(
        item => item.productId === itemToAdd.productId && item.rom === itemToAdd.rom && item.color === itemToAdd.color
      );
      if (existing) {
        existing.quantity += itemToAdd.quantity;
      } else {
        serverCart.push(itemToAdd);
      }

      const totalAmount = serverCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/saveCart`,
        {
          items: serverCart,
          totalAmount,
          userInfo: {
            fullName: userData.fullName,
            email: userData.email,
            numberPhone: userData.numberPhone,
            address: userData.address || ""
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return { items: serverCart };
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async () => {
    const token = localStorage.getItem("token");

    if (token) {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/clearCart`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      localStorage.removeItem("cartItems");
    }

    return [];
  }
);

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.items = action.payload;
    });

    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.items = action.payload.items;
    });

    builder.addCase(loadCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });

     builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.items = [];
    });
  },
});
export default cartSlice;
