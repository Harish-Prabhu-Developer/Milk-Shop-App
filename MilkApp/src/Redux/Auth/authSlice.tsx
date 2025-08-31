import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
// Define user type based on your JWT structure
interface User {
  id: string;
  email: string;
}

interface Notification{
  _id: string;
  title: string;
  message: string;
  date: string;
  type: string;
}
interface BranchDataType {
  _id: string;
  branchName: string;
  email: string;
  phone: string;
  address?: string;
  contactPerson?: string;
  location?: string;
  role: string;
  type: string;
  registeredDate: string;
}

interface AuthState {
  user: User | null;
  OnStatus: string;
  branch: BranchDataType | null;
  loading: boolean;
  notificationCount: number;
  notifications: Notification[];
  error: string | null;
}
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Async Thunk for login
export const login = createAsyncThunk(
  'milkapp/auth/login',
  async (credentials:{email:string,password:string,fcmToken?: string }, { rejectWithValue }) => {
    try {
      console.log("API",API_URL);
      
      const res = await axios.post(
        `${API_URL}/milkapp/auth/login`,
        credentials,
      );
      console.log('Login Response:', res.data);
      return res.data;
    } catch (error: any) {

      if (!error.response) {
        console.log('Network Error: Server unreachable.');
        return rejectWithValue('Network Error: Server unreachable.');
      }

      return rejectWithValue(error.response.data?.msg==='Branch not found'?'Sorry,this branch OR User is not available. Please Contact Admin.':error.response.data?.msg || 'Login failed');
    }
  },
);

// Async Thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'milkapp/auth/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${API_URL}/milkapp/auth/notifications`, headers);
      console.log('Notifications Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        console.log('Network Error: Server unreachable.');
        return rejectWithValue('Network Error: Server unreachable.');
      }
      return rejectWithValue(error.response.data?.msg || 'Failed to fetch notifications');
    }
  }
);
// Async Thunk for fetching profile
export const fetchProfile = createAsyncThunk(
  'milkapp/auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_URL}/milkapp/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      if (!error.response) {
        console.log('Network Error: Server unreachable.');
        return rejectWithValue('Network Error: Server unreachable.');
      }
      return rejectWithValue(
        error.response.data?.msg || 'Failed to fetch profile',
      );
    }
  },
);

const initialState: AuthState = {
  user: null,
  OnStatus: '',
  notificationCount: 0,
  notifications: [],
  branch: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
        state.OnStatus = '';
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.msg === 'Login successful') {
          try {
            state.user = jwtDecode<any>(action.payload.token);
            AsyncStorage.setItem('isLoggedIn', 'true');
            AsyncStorage.setItem('token', action.payload.token);
            state.OnStatus = action.payload.msg;
          } catch (error: any) {
            console.error('Invalid token:', error.message);
          }
        } else if (action.payload.msg === 'Invalid credentials') {
          state.error = 'Invalid credentials';
        }else if (action.payload.msg === 'Branch not found') {
            state.error= 'Sorry,this branch OR User is not available. Please Contact Admin.';
        } else {
          state.OnStatus = 'Login failed';
          state.error = null ;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = typeof action.payload === "string" ? action.payload : "Login failed";
        
      })
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.notificationCount = action.payload.length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch notifications";
      })
            .addCase(fetchProfile.fulfilled, (state, action) => {
              state.loading = false;
              state.branch = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
              state.loading = false;
              state.error =
                typeof action.payload === 'string'
                  ? action.payload
                  : 'Failed to fetch profile';
            });
    },
});

export default authSlice.reducer;