import { Product } from "@/Utils/@types/Products";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state of the product slice
//products interface
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
    unit: '1 Litre',
    description: 'Rich and creamy milk with high fat content. Ideal for desserts and full-bodied taste.',
    nutrition: 'Energy: 70 kcal, Fat: 4.5g, Protein: 3.5g, Carbs: 4.9g',
    image: require('@assets/ProductImages/Milk.png'),
  },
  {
    id: '2',
    name: 'Toned Milk',
    price: 25.0,
    unit: '1 Litre',
    description: 'Milk with reduced fat content while retaining nutrients. Suitable for daily consumption.',
    nutrition: 'Energy: 58 kcal, Fat: 3.0g, Protein: 3.1g, Carbs: 4.8g',
    image: require('@assets/ProductImages/Milk.png'),
  },
  {
    id: '3',
    name: 'Skimmed Milk',
    price: 23.0,
    unit: '1 Litre',
    description: 'Fat-free milk, ideal for weight-conscious consumers and protein-rich diets.',
    nutrition: 'Energy: 35 kcal, Fat: 0.1g, Protein: 3.4g, Carbs: 5.0g',
    image: require('@assets/ProductImages/Milk.png'),
  },
  {
    id: '4',
    name: 'Curd',
    price: 35.0,
    unit: '500 gm',
    description: 'Thick and fresh curd made from pure milk. Good source of probiotics.',
    nutrition: 'Energy: 98 kcal, Fat: 4.3g, Protein: 3.1g, Carbs: 11g',
    image: require('@assets/ProductImages/Gurd.png'),
  },
  {
    id: '5',
    name: 'Paneer',
    price: 85.0,
    unit: '200 gm',
    description: 'Soft and fresh paneer ideal for cooking and grilling. Rich in protein and calcium.',
    nutrition: 'Energy: 265 kcal, Fat: 21g, Protein: 18g, Carbs: 1.2g',
    image: require('@assets/ProductImages/Panner.png'),
  },
  {
    id: '6',
    name: 'Ghee',
    price: 450.0,
    unit: '500 ml',
    description: 'Pure desi ghee made from cow milk. Enhances flavor and digestion.',
    nutrition: 'Energy: 900 kcal, Fat: 100g, Protein: 0g, Carbs: 0g',
    image: require('@assets/ProductImages/Ghee.png'),
  },
  {
    id: '7',
    name: 'Butter',
    price: 75.0,
    unit: '100 gm',
    description: 'Creamy and smooth butter made from churned cream. Perfect for toast or baking.',
    nutrition: 'Energy: 717 kcal, Fat: 81g, Protein: 0.85g, Carbs: 0.06g',
    image: require('@assets/ProductImages/Butter.png'),
  },
],
    loading: false,
    error: null,
};
// Create an async thunk for fetching products
export const fetchProducts = createAsyncThunk(
    "milkapp/products/all",
    async () => {
        const response = await axios.get("http://10.76.23.247:3000/milkapp/products/all");
        return response.data;
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