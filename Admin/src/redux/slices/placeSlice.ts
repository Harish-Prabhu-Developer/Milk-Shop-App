// placeSlice.ts
// Redux slice for managing places and routes
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Place, Route} from '../../@types/Place';

interface PlaceState {
  places: Place[];
  loading: boolean;
  error: string | null;
}

const initialState: PlaceState = {
  places: [
    {
      id: 'fkjdskj1435426378vhdsjdjfsdgj',
      RouteGroup: 'Chennai',
      type: 'COMPANY VEHICLE',
      location: 'Chennai',
      distance: '99km',
      Route: [
        {
          id: 'afkdjsk34958hv488w9hc9',
          'Branch Name': 'KALLIKUPPAM NKC',
          'Route type': 'ROUTE 1',
        },
        {
          id: '84308hjkdhkjshkjhk39',
          'Branch Name': 'NANGANALLUR',
          'Route type': 'ROUTE 2',
        },
        {
          id: 'fdhsjkb483hc84c83838g8h83',
          'Branch Name': 'KAYARAMEDU',
          'Route type': 'ROUTE 3',
        },
      ],
      
    },
  ],
  loading: false,
  error: null,
};

const placeSlice = createSlice({
  name: 'place',
  initialState,
  reducers: {
    // Place
    addPlace: (state, action: PayloadAction<Place>) => {
      state.places.push(action.payload);
    },
    updatePlace: (state, action: PayloadAction<Place>) => {
      const index = state.places.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.places[index] = action.payload;
      }
    },
    removePlace: (state, action: PayloadAction<string>) => {
      state.places = state.places.filter(p => p.id !== action.payload);
    },

    // Route inside Place
    addRoute: (state, action: PayloadAction<{ placeId: string; route: Route }>) => {
      const place = state.places.find(p => p.id === action.payload.placeId);
      if (place) {
        place.Route.push(action.payload.route);
      }
    },
    updateRoute: (state, action: PayloadAction<{ placeId: string; route: Route }>) => {
      const place = state.places.find(p => p.id === action.payload.placeId);
      if (place) {
        const index = place.Route.findIndex(r => r.id === action.payload.route.id);
        if (index !== -1) {
          place.Route[index] = action.payload.route;
        }
      }
    },
    removeRoute: (state, action: PayloadAction<{ placeId: string; routeId: string }>) => {
      const place = state.places.find(p => p.id === action.payload.placeId);
      if (place) {
        place.Route = place.Route.filter(r => r.id !== action.payload.routeId);
      }
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
} = placeSlice.actions;
