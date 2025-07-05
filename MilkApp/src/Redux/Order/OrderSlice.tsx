import { Order, OrderProduct } from "@Utils/@types/Order";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface OrderState {
    MyOrders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    MyOrders: [],
    loading: false,
    error: null,
};

const OrderSlice = createSlice({
    name: "Order",
    initialState,
    reducers: {
        addToMyOrders: (state, action: PayloadAction<Order>) => {
            state.MyOrders.push(action.payload);
        },
        removeFromMyOrders: (state, action: PayloadAction<string>) => {
            state.MyOrders = state.MyOrders.filter(item => item.id !== action.payload);
        },
        clearMyOrders: (state) => {
            state.MyOrders = [];
        }
    }
});

export const { addToMyOrders, removeFromMyOrders, clearMyOrders } = OrderSlice.actions;
export default OrderSlice.reducer;