import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    DiscountedProducts: [],
};
const DiscountedProductsSlice = createSlice({
    name: "discountedProducts",
    initialState,
    reducers: {
        setDiscountedProducts: (state, action) => {
            state.DiscountedProducts = action.payload;
        },

    }
});


export const { setDiscountedProducts } = DiscountedProductsSlice.actions;

export default DiscountedProductsSlice;
