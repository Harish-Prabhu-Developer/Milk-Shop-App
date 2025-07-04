import { CartProduct } from "@/Utils/@types/Products";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
interface CartState {
    Carts: CartProduct[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    Carts: [],
    loading: false,
    error: null,
}

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartProduct>) => {
            state.Carts.push(action.payload);
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.Carts = state.Carts.filter(product => product.id !== action.payload);
        },
        EditOnCart: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const { id, quantity } = action.payload;
            const product = state.Carts.find(product => product.id === id);
            if (product) {
                product.quantity = quantity;
            }
        }
    },
    extraReducers: (builder) => {

    },
});


export const { addToCart, removeFromCart, EditOnCart } = CartSlice.actions;
export default CartSlice.reducer;