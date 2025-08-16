import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../@types/Product';
import axios from "axios";
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const getHeaders = async (isMultipart = false) => {
  const token = await AsyncStorage.getItem("token");
  const headers: any = {
    Authorization: `Bearer ${token}`,
  };
  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }
  return { headers };
};
// Create Product
export const newProduct = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/products/add',
  async (addNewProduct, { rejectWithValue }) => {
    try {
      const headers = await getHeaders(true);
      console.log("API_URL",API_URL);
      
      const res = await axios.post(`${API_URL}/milkapp/products/add`, addNewProduct, headers);
      console.log('Create Product Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response) return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Create Product failed');
    }
  }
);

// Fetch Cart
export const fetchProducts = createAsyncThunk<any, void, { rejectValue: string }>(
  'milkapp/products/all',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      console.log("API_URL",API_URL);
      
      const response = await axios.get(`${API_URL}/milkapp/products/all`, headers);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch Products data');
    }
  }
);
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // addProduct: (state, action: PayloadAction<Product>) => {
    //   state.products.push(action.payload);
    // },
    // removeProduct: (state, action: PayloadAction<string>) => {
    //   state.products = state.products.filter(p => p.id !== action.payload);
    // },
    // updateProduct: (state, action: PayloadAction<Product>) => {
    //   const idToUpdate = String(action.payload.id);
    //   const index = state.products.findIndex(p => String(p.id) === idToUpdate);
    //   if (index !== -1) {
    //     state.products[index] = {
    //       ...action.payload,
    //       id: idToUpdate, // Ensure ID remains consistent
    //     };
    //   } else {
    //     console.warn(`Product with id ${idToUpdate} not found`);
    //   }
    // },


  },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch products";
            })
            .addCase(newProduct.pending, (state) => {
                state.loading=false;
                state.error = null;
            })
            .addCase(newProduct.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Create Product Response:', action.payload);
                if (action.payload.msg === 'Product created successfully') {
                    state.products.push(action.payload.product);                  
                }                

            })
            .addCase(newProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Create Product failed';
            });
    },  
});


export default productSlice.reducer;
