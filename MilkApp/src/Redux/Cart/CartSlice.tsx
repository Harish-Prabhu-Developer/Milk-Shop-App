import { AddToCart, CartProduct } from '@/Utils/@types/Cart';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface CartState {
  Carts: CartProduct;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  Carts: {
    _id: '',
    user: '',
    items: [], // ✅ empty array so .length works
    createdAt: '',
    updatedAt: '',
    totalAmount: 0
  },
  loading: false,
  error: null,
};

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ---------- Thunks ----------

// Add to Cart
export const addToCart = createAsyncThunk<CartProduct, AddToCart, { rejectValue: string }>(
  'milkapp/cart/add',
  async (productAddToCart, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(`${API_URL}/milkapp/cart/add`, productAddToCart, headers);
      console.log('AddToCart Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response) return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Add to cart failed');
    }
  }
);

// Update Cart
export const updateCart = createAsyncThunk<CartProduct, AddToCart, { rejectValue: string }>(
  'milkapp/cart/update',
  async (updateCartItem, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.put(`${API_URL}/milkapp/cart/update`, updateCartItem, headers);
      console.log('Update Cart Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response) return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Update cart failed');
    }
  }
);

// Fetch Cart
export const fetchCart = createAsyncThunk<CartProduct, void, { rejectValue: string }>(
  'milkapp/cart/getall',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const response = await axios.get(`${API_URL}/milkapp/cart/`, headers);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch Cart data');
    }
  }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk<CartProduct, string, { rejectValue: string }>(
  'milkapp/cart/remove',
  async (id, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const response = await axios.delete(`${API_URL}/milkapp/cart/remove/${id}`, headers);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to remove Cart data');
    }
  }
);

// ---------- Slice ----------
const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add to cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.Carts = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Add to cart failed';
    });

    // Fetch cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Fetch Cart Response:', action.payload);
      
      state.Carts = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch Cart data';
    });

    // Update cart
    builder.addCase(updateCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Update Cart Response:', action.payload);
      
      state.Carts = action.payload;
    });
    builder.addCase(updateCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Update cart failed';
    });

    // Remove from cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.Carts = action.payload;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Remove from cart failed';
    });
  },
});

export default CartSlice.reducer;
