import {configureStore} from '@reduxjs/toolkit';
import placeReducer from './slices/placeSlice';
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
const store=configureStore({
    reducer:{
        place:placeReducer,
        user:userReducer,
        product:productReducer,
        order:orderReducer, 

    },

});

export type RootState=ReturnType<typeof store.getState>; //exporting the State type
export type AppDispatch =typeof store.dispatch; //exporting the dispatch type
export default store; 