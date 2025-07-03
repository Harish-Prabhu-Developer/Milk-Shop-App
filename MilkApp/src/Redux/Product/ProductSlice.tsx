import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state of the product slice
//products interface
type Product = {
    id: string;
    name: string;
    price: number;
    image: any;
  };
interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}
const initialState: ProductState = {
    products: [
        {
    id: '1',
    name: 'Full Cream Milk',
    price: 28.5,
    image: require('@assets/image.png'),
  },
  {
    id: '2',
    name: 'Toned Milk',
    price: 25.0,
    image: require('@assets/image.png'),
  },
  {
    id: '3',
    name: 'Skimmed Milk',
    price: 23.0,
    image: require('@assets/image.png'),
  },
  { id: '4', name: 'Curd', price: 35.0, image: require('@assets/image.png') },
  { id: '5', name: 'Paneer', price: 85.0, image: require('@assets/image.png') },
  { id: '6', name: 'Ghee', price: 450.0, image: require('@assets/image.png') },
  { id: '7', name: 'Butter', price: 75.0, image: require('@assets/image.png') },

    ],
    loading: false,
    error: null,
};
// Create an async thunk for fetching products
// export const fetchProducts = createAsyncThunk(
//     "product/fetchProducts",
//     async () => {
//         const response = await axios.get("https://api.example.com/products");
//         return response.data;
//     }
// );
// Create the product slice
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
        },
        removeProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(product => product.id !== action.payload);
        },
        
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchProducts.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(fetchProducts.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.products = action.payload;
    //         })
    //         .addCase(fetchProducts.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.error.message || "Failed to fetch products";
    //         });
    // },
});

export default productSlice.reducer;