// placeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place } from '../../@types/Place';

interface PlaceState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaceState = {
  places: [ ],
  loading: false,
  error: null,
};

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places.push(action.payload);
    },
    removePlace: (state, action: PayloadAction<string>) => {
      state.places = state.places.filter((place: Place) => place._id !== action.payload);
    },
    editPlace: (state, action: PayloadAction<Place>) => {
      const index = state.places.findIndex((place: Place) => place._id === action.payload._id);
      if (index !== -1) {
        state.places[index] = action.payload;
      } else {
        state.places.push(action.payload);
      }
    },
  },
});

export default placeSlice.reducer;
export const { addPlace, removePlace, editPlace } = placeSlice.actions;
