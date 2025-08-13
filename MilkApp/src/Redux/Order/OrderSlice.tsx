import { Order, UpdateReceivedItems} from '@Utils/@types/Order';
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
      const res = await axios.post(`${API_URL}/milkapp/order/add`, headers);
      console.log('Create Order Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Create Order failed');
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
      return rejectWithValue(error.response?.data?.msg || 'Failed to fetch Order data');
    }
  }
);
// Update Order
export const updateOrderData = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/order/edit/id',
  async (OrderUpdateDetails:UpdateReceivedItems, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.put(`${API_URL}/milkapp/order/edit/${OrderUpdateDetails.OrderId}`, OrderUpdateDetails.Items, headers);
      console.log('Update Order Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response) return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Update Order failed');
    }
  }
);
const OrderSlice = createSlice({
  name: 'Order',
  initialState,
  reducers: {
    
  },

  extraReducers: builder => {
    builder
      .addCase(CreateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateOrder.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Add Order response : ', action.payload);
        if (action.payload.msg === 'Order created successfully') {
        //   state.MyOrders = action.payload.order;
            fetchOrder();
        }
      }).addCase(CreateOrder.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || 'Add Order failed';
      })
      .addCase(fetchOrder.pending,(state)=>{
        state.loading = true;
        state.error = null;
      }).addCase(fetchOrder.fulfilled,(state,action)=>{
        state.loading = false;
        state.MyOrders = action.payload;
      }).addCase(fetchOrder.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      })
       .addCase(updateOrderData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderData.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Update Order response : ', action.payload);
        if (action.payload.msg === 'Order updated') {
          state.MyOrders = action.payload.order;
        }
      }).addCase(updateOrderData.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || 'Update Order failed';
      });
      
  },
});


export default OrderSlice.reducer;
