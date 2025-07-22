import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../@types/Product';

interface ProductSliceState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductSliceState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

export const { addProduct, removeProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
