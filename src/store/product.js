import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Product: [],
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.Product = action.payload;
    },


    addProduct: (state, action) => {
      const newProduct = action.payload;

      const existingProductIndex = state.Product.findIndex(
        (product) =>
          product.name === newProduct.name &&
          product.category === newProduct.category
      );

      if (existingProductIndex !== -1) {
        const existingProduct = state.Product[existingProductIndex];

        newProduct.roms.forEach((newRom) => {
          const existingRom = existingProduct.roms.find(r => r.rom === newRom.rom);

          if (existingRom) {
            // ROM đã tồn tại → duyệt variant
            newRom.variants.forEach((newVariant) => {
              const existingVariant = existingRom.variants.find(
                (v) => v.color === newVariant.color
              );

              if (existingVariant) {
                existingVariant.quantity = newVariant.quantity;
                existingVariant.image = newVariant.image; // cập nhật ảnh nếu cần
              } else {
                existingRom.variants.push({
                  ...newVariant,
                  sold: 0,
                  isDiscount: false,
                });
              }
            });
          } else {
            // ROM chưa tồn tại → thêm mới
            existingProduct.roms.push({
              rom: newRom.rom,
              price: newRom.price,
              isDiscount: newRom.isDiscount || false,
              variants: newRom.variants.map((v) => ({
                ...v,
                sold: v.sold || 0,
                isDiscount: v.isDiscount || false,
              })),
            });
          }
        });
      } else {
        // Sản phẩm chưa có → thêm mới
        state.Product.push({
          _id: newProduct._id,
          name: newProduct.name,
          category: newProduct.category,
          roms: newProduct.roms.map((rom) => ({
            rom: rom.rom,
            price: rom.price,
            isDiscount: rom.isDiscount || false,
            variants: rom.variants.map((variant) => ({
              ...variant,
              sold: variant.sold || 0,
              isDiscount: variant.isDiscount || false,
            })),
          })),
        });
      }
    },




    updateProduct: (state, action) => {
      const updatedData = action.payload;
      const productIndex = state.Product.findIndex(product => product._id === updatedData._id);

      if (productIndex !== -1) {
        const existingProduct = state.Product[productIndex];
        const updatedProduct = {
          ...existingProduct,
          name: updatedData.name || existingProduct.name,
          category: updatedData.category || existingProduct.category,
        };

        if (updatedData.roms) {
          updatedProduct.roms = updatedData.roms.map(updatedRom => {
            const existingRom = existingProduct.roms.find(r => r.rom === updatedRom.rom);

            if (existingRom) {
              const newPrice = updatedRom.price !== undefined ? updatedRom.price : existingRom.price;

              const updatedVariants = updatedRom.variants.map(updatedVariant => {
                const existingVariant = existingRom.variants.find(v => v.color === updatedVariant.color);
                if (existingVariant) {
                  return {
                    ...existingVariant,
                    ...updatedVariant,
                  };
                }
                return updatedVariant;
              });

              return {
                ...existingRom,
                price: newPrice,
                variants: updatedVariants,
              };
            }

            return updatedRom;
          });
        }

        state.Product[productIndex] = updatedProduct;
      } else {
        console.warn("Không tìm thấy sản phẩm với ID:", updatedData._id);
      }
    },
  }
});

export const { setProduct, addProduct, updateProduct } = ProductSlice.actions;

export default ProductSlice;
