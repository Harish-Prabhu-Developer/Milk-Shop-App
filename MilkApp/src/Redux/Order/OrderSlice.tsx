import { Order, OrderProduct, ReceivedItem } from "@Utils/@types/Order";
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
        cancelOrder: (state, action: PayloadAction<{ id: string }>) => {
        const { id } = action.payload;

        state.MyOrders = state.MyOrders.map(order =>
            order.OrderId === id
            ? {
                ...order,
                OrderStatus: 'Cancelled',
                DeliveryStatus: 'Returned',
                CancelOrderDate: new Date().toISOString(),
                }
            : order
        );
        },
        confirmOrder: (state, action: PayloadAction<{ id: string, receivedItems: ReceivedItem[] }>) => {
            const { id } = action.payload;
            console.log("Received Items:", action.payload.receivedItems);
            
            state.MyOrders = state.MyOrders.map(order =>
                order.OrderId === id
                    ? {
                        ...order,
                        OrderStatus: 'Delivered',
                        ReceivedStatus: 'Confirmed',
                        ReceivedDate: new Date().toISOString(),
                        ReceivedItems: order.ProductData.map(product => ({
                            id: product.id,
                            receivedQty: product.quantity,
                        })),
                    }
                    : order
            );
        },

        clearMyOrders: (state) => {
            state.MyOrders = [];
        }
    }
});

export const { addToMyOrders, removeFromMyOrders, cancelOrder,clearMyOrders,confirmOrder } = OrderSlice.actions;
export default OrderSlice.reducer;