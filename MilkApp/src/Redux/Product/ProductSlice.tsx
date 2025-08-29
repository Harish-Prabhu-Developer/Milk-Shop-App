import { Product } from "@/Utils/@types/Products";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from '@env';

// Define the initial state of the product slice
//products interface

const initialState = {
  products: [] as Product[],
  loading: false,
  error: null as string | null,
};
;
// Create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
    "milkapp/products/all",
    async () => {
        try {
        console.log("API",API_URL);
        
        const response = await axios.get(`${API_URL}/milkapp/products/all`);
        console.log("Product Response:", response.data);
        
        return response.data;
        } catch (error) {
        throw new Error("Failed to fetch products");  
        }
    }
);


// Create the product slice
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {

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
            });
    },
});

export default productSlice.reducer;