import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Branch } from '../../@types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { jwtDecode } from 'jwt-decode';

interface UserState {
  users: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
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

// Create Branch
export const newBranch = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/branch/add',
  async (addNewBranch, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(
        `${API_URL}/milkapp/branch/add`,
        addNewBranch,
        headers,
      );
      console.log('Create Branch Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(
        error.response.data?.msg || 'Create Branch failed',
      );
    }
  },
);

// Fetch Branch
// Fetch Branch
export const fetchBranch = createAsyncThunk<any, void, { rejectValue: string }>(
  'milkapp/branch/all',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${API_URL}/milkapp/branch/all`, headers);
      console.log('Fetch Branch Response:', res.data);

      // get token safely
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No token found in AsyncStorage");
        return res.data; // return everything
      }

      // decode
      const decodedToken: any = jwtDecode(token);
      console.log("decodedToken:", decodedToken);

      // filter out logged-in branch
      const filteredUsers = res.data.filter(
        (user: any) => user._id !== decodedToken._id
      );

      return filteredUsers; // this goes straight to reducer
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Fetch Branch failed');
    }
  },
);

// Update Branch
export const updateBranch = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/branch/update/id',
  async (updateBranch, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.put(
        `${API_URL}/milkapp/branch/update/${updateBranch.id}`,
        updateBranch.data,
        headers,
      );
      console.log('Update Branch Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(
        error.response.data?.msg || 'Update Branch failed',
      );
    }
  },
);

// Delete Branch
export const deleteBranch = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/branch/remove/id',
  async (branchId, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.delete(
        `${API_URL}/milkapp/branch/remove/${branchId}`,
        headers,
      );
      console.log('Delete Branch Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(
        error.response.data?.msg || 'Delete Branch failed',
      );
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBranch.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // already filtered
      })
      .addCase(fetchBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(newBranch.pending, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(newBranch.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Create Branch Response:', action.payload);
        if (action.payload.msg === 'Branch created successfully') {
          state.users.push(action.payload.branch);
        }
      })
      .addCase(newBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Create Branch failed';
      })
      .addCase(updateBranch.pending, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Update Branch Response:', action.payload);
        if (action.payload.msg === 'Branch updated successfully') {
          const updatedBranchID = action.payload.branch;
          const index = state.users.findIndex(
            o => o._id === updatedBranchID._id,
          );
          if (index !== -1) {
            // Replace existing order with updated order
            state.users[index] = updatedBranchID;
          } else {
            // If it's new (not found), optionally add it
            state.users.push(updatedBranchID);
          }
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Update Branch failed';
      })
      .addCase(deleteBranch.pending, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Delete Branch Response:', action.payload);
        if (action.payload.msg === 'Branch deleted successfully') {
          state.users = state.users.filter(
            o => o._id !== action.payload.branch._id,
          );
        }
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Delete Branch failed';
      });
  },
});

export default userSlice.reducer;
