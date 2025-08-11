import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../../@types/Order';

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        ConfirmOrder: (state, action: PayloadAction<{ orderId: string; confirmDate: string }>) => {
            
        }
    },
});

export default orderSlice.reducer;
export const {ConfirmOrder } = orderSlice.actions;

