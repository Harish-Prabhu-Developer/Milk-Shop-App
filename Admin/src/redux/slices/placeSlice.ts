// placeSlice.ts
// Redux slice for managing places and routes
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place, Route } from '../../@types/Place';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

interface PlaceState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaceState = {
  places: [],
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

// Create a Place
export const newPlace = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/place/create',
  async (addNewPlace, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(
        `${API_URL}/milkapp/place/create`,
        addNewPlace,
        headers,
      );
      console.log('Create Route Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Create Place failed');
    }
  },
);

// Fetch Place
export const fetchPlaces = createAsyncThunk<any, void, { rejectValue: string }>(
  'milkapp/place/all',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.get(`${API_URL}/milkapp/place/all`, headers);
      console.log('Fetch Place Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Fetch Place failed');
    }
  },
);

// Update Place
export const updatePlace = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/place/update/id',
  async (updateplace, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.put(
        `${API_URL}/milkapp/place/update/${updateplace.id}`,
        updateplace.data,
        headers,
      );
      console.log('Update Place Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Update Place failed');
    }
  },
);

// Delete Place
export const deletePlace = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/place/remove/id',
  async (placeID, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.delete(
        `${API_URL}/milkapp/place/remove/${placeID}`,
        headers,
      );
      console.log('Delete Place Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Delete Place failed');
    }
  },
);

//  -------------ROUTES---------------------

// Create a Route
export const newRoute = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/place/addroute/id',
  async (addNewRoute, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.post(
        `${API_URL}/milkapp/place/addroute/${addNewRoute.id}`,
        addNewRoute.data,
        headers,
      );
      console.log('Create Route Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Create Route failed');
    }
  },
);
// Update Route
export const updateRoute = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/place/updateroute/placeId/routeId',
  async (updateRoute, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.put(
        `${API_URL}/milkapp/place/updateroute/${updateRoute.placeId}/${updateRoute.routeId}`,
        updateRoute.data,
        headers,
      );
      console.log('Update Route Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Update Route failed');
    }
  },
);

// Delete Route
export const deleteRoute = createAsyncThunk<any, any, { rejectValue: string }>(
  'milkapp/place/removeroute/placeId/RouteId',
  async (reomveRoute, { rejectWithValue }) => {
    try {
      const headers = await getHeaders();
      const res = await axios.delete(
        `${API_URL}/milkapp/place/removeroute/${reomveRoute.placeId}/${reomveRoute.routeId}`,
        headers,
      );
      console.log('Delete Route Response:', res.data);
      return res.data;
    } catch (error: any) {
      if (!error.response)
        return rejectWithValue('Network Error: Server unreachable.');
      return rejectWithValue(error.response.data?.msg || 'Delete Route failed');
    }
  },
);

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(newPlace.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(newPlace.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Create Place Response:', action.payload);
      if (action.payload.msg === 'Place created successfully') {
        state.places.push(action.payload.place);
      }
    });
    builder.addCase(newPlace.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Create Place failed';
    });
    builder.addCase(fetchPlaces.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPlaces.fulfilled, (state, action) => {
      state.loading = false;
      state.places = action.payload;
    });
    builder.addCase(fetchPlaces.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch places';
    });
    builder.addCase(updatePlace.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePlace.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Update Place Response:', action.payload);
      if (action.payload.msg === 'Place updated successfully') {
        const index = state.places.findIndex(
          place => place._id === action.payload.place._id,
        );
        if (index !== -1) {
          state.places[index] = action.payload.place;
        }
      }
    });
    builder.addCase(updatePlace.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Update Place failed';
    });
    builder.addCase(deletePlace.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePlace.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Delete Place Response:', action.payload);
      if (action.payload.msg === 'Place deleted successfully') {
        state.places = state.places.filter(
          place => place._id !== action.payload.place._id,
        );
      }
    });
    builder.addCase(deletePlace.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Delete Place failed';
    });
    builder.addCase(newRoute.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(newRoute.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Create Route Response:', action.payload);
      if (action.payload.msg === 'Route created successfully') {
        state.places.push(action.payload.place);
      }
    });
    builder.addCase(newRoute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Create Route failed';
    });
    builder.addCase(updateRoute.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRoute.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Update Route Response:', action.payload);
      if (action.payload.msg === 'Route updated successfully') {
        const index = state.places.findIndex(
          place => place._id === action.payload.place._id,
        );
        if (index !== -1) {
          state.places[index] = action.payload.place;
        }
      }
    });
    builder.addCase(updateRoute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Update Route failed';
    });
    builder.addCase(deleteRoute.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRoute.fulfilled, (state, action) => {
      state.loading = false;
      console.log('Delete Route Response:', action.payload);
      if (action.payload.msg === 'Route deleted successfully') {
        state.places = state.places.filter(
          place => place._id !== action.payload.place._id,
        );
      }
    });
    builder.addCase(deleteRoute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Delete Route failed';
    });
  },
});

export default placeSlice.reducer;
