import { Order, UpdateReceivedItems } from '@Utils/@types/Order';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ---------- Thunks ----------

// create the Order
export const CreateOrder = createAsyncThunk<any, void, { rejectValue: string }>(
  'milkapp/order/add',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(`${API_URL}/milkapp/order/add`, {}, headers);
      console.log('Create Order Response:', res.data);
      return res.data;
    } catch (error: any) {
      console.log(error.response);

      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Create Order failed');
    }
  },
);
// Update Order
export const ReOrderData = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/order/reorder/id',
  async (OrderID: string, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(
        `${API_URL}/milkapp/order/reorder/${OrderID}`,
        {},
        headers,
      );
      console.log('ReOrder Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'ReOrder failed');
    }
  },
);
// Fetch Order
export const fetchOrder = createAsyncThunk<any, void, { rejectValue: string }>(
  'milkapp/order/getall',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const response = await axios.get(`${API_URL}/milkapp/order/`, headers);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.msg || 'Failed to fetch Order data',
      );
    }
  },
);
// Update Order
export const updateOrderData = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>(
  'milkapp/order/edit/id',
  async (OrderUpdateDetails: UpdateReceivedItems, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();

      const res = await axios.put(
        `${API_URL}/milkapp/order/edit/${OrderUpdateDetails.OrderId}`,
        OrderUpdateDetails.Items,
        headers,
      );
      console.log('Update Order Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Update Order failed');
    }
  },
);
const OrderSlice = createSlice({
  name: 'Order',
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(CreateOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateOrder.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Add Order response : ', action.payload);
        if (action.payload.msg === 'Order created successfully') {
         const updatedOrder = action.payload.order;
          const index = state.MyOrders.findIndex(
            o => o._id === updatedOrder._id,
          );

          if (index !== -1) {
            // Replace existing order with updated order
            state.MyOrders[index] = updatedOrder;
          } else {
            // If it's new (not found), optionally add it
            state.MyOrders.push(updatedOrder);
          }
        }
      })
      .addCase(CreateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Add Order failed';
      })
      .addCase(ReOrderData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ReOrderData.fulfilled, (state, action) => {
        state.loading = false;
        console.log('ReOrder response : ', action.payload);
        if (action.payload.msg === 'ReOrder placed successfully') {
          const updatedOrder = action.payload.order;
          const index = state.MyOrders.findIndex(
            o => o._id === updatedOrder._id,
          );

          if (index !== -1) {
            // Replace existing order with updated order
            state.MyOrders[index] = updatedOrder;
          } else {
            // If it's new (not found), optionally add it
            state.MyOrders.push(updatedOrder);
          }
        }
      })
      .addCase(ReOrderData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'ReOrder failed';
      })
      .addCase(fetchOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.MyOrders = action.payload || [];
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
      .addCase(updateOrderData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderData.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Update Order response : ', action.payload);

        if (action.payload.msg === 'Order updated') {
          const updatedOrder = action.payload.order;
          const index = state.MyOrders.findIndex(
            o => o._id === updatedOrder._id,
          );

          if (index !== -1) {
            // Replace existing order with updated order
            state.MyOrders[index] = updatedOrder;
          } else {
            // If it's new (not found), optionally add it
            state.MyOrders.push(updatedOrder);
          }
        }
      })

      .addCase(updateOrderData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Update Order failed';
      });
  },
});

export default OrderSlice.reducer;
