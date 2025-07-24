// placeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place, Route, VehicleDetails } from '../../@types/Place';

interface PlaceState {
  places: Place[];
  routes: Route[];
  Vehicles: VehicleDetails[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaceState = {
  places: [
    {
      id: 'fkjdskj1435426378vhdsjdjfsdgj',
      RouteGroup: 'Chennai',
      Route: [
        {
          id: 'afkdjsk34958hv488w9hc9',
          "Branch Name": 'KALLIKUPPAM NKC',
          "Route type": 'ROUTE 1',
        },
      ],
      VehicleDetails: {
        id: '1dsdsjkfhjdshkjdf',
        type: 'COMPANY VEHICLE',
        location: 'Chennai',
        distance: '99km',
      },
    },
  ],
  routes: [
    {
      id: 'afkdjsk34958hv488w9hc9',
      "Branch Name": 'KALLIKUPPAM NKC',
      "Route type": 'ROUTE 1',
    },
    {
      id: '84308hjkdhkjshkjhk39',
      "Branch Name": 'NANGANALLUR',
      "Route type": 'ROUTE 2',
    },
    {
      id: 'fdhsjkb483hc84c83838g8h83',
      "Branch Name": 'KAYARAMEDU',
      "Route type": 'ROUTE 3',
    },
    {
      id: 'hjkbhjkbhjkbhjkbhjkbhj045',
      "Branch Name": 'testing',
      "Route type": 'ADDITIONAL',
    },
  ],
  Vehicles: [
    {
      id: '1dsdsjkfhjdshkjdf',
      type: 'COMPANY VEHICLE',
      location: 'Chennai',
      distance: '99km',
    },
    {
      id: 'fkjdsh349394u8f84',
      type: 'PRIVATE VEHICLE',
      location: 'Bangalore',
      distance: '99km',
    },
  ],
  loading: false,
  error: null,
};

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    // Add
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places.push(action.payload);
    },
    addRoute: (state, action: PayloadAction<Route>) => {
      state.routes.push(action.payload);
    },
    addVehicle: (state, action: PayloadAction<VehicleDetails>) => {
      state.Vehicles.push(action.payload);
    },

    // Update
    updatePlace: (state, action: PayloadAction<Place>) => {
      const index = state.places.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.places[index] = action.payload;
      }
    },
    updateRoute: (state, action: PayloadAction<Route>) => {
      const index = state.routes.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.routes[index] = action.payload;
      }
    },
    updateVehicle: (state, action: PayloadAction<VehicleDetails>) => {
      const index = state.Vehicles.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.Vehicles[index] = action.payload;
      }
    },

    // Remove
    removePlace: (state, action: PayloadAction<string>) => {
      state.places = state.places.filter(p => p.id !== action.payload);
    },
    removeRoute: (state, action: PayloadAction<string>) => {
      state.routes = state.routes.filter(r => r.id !== action.payload);
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.Vehicles = state.Vehicles.filter(v => v.id !== action.payload);
    },
  },
});

export default placeSlice.reducer;

export const {
  addPlace,
  updatePlace,
  removePlace,
  addRoute,
  updateRoute,
  removeRoute,
  addVehicle,
  updateVehicle,
  removeVehicle,
} = placeSlice.actions;
