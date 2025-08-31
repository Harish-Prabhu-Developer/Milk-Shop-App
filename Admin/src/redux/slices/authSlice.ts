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
  loading: boolean;
  branch: BranchDataType | null;
  error: string | null;
}

// Async Thunk for login
export const login = createAsyncThunk(
  'milkapp/auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
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

      return rejectWithValue(
        error.response.data?.msg === 'Branch not found'
          ? 'Sorry,this branch OR User is not available. Please Contact Admin.'
          : error.response.data?.msg || 'Login failed',
      );
    }
  },
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
        } else if (action.payload.msg === 'Branch not found') {
          state.error =
            'Sorry,this branch OR User is not available. Please Contact Admin.';
        } else {
          state.OnStatus = 'Login failed';
          state.error = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error =
          typeof action.payload === 'string' ? action.payload : 'Login failed';
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
