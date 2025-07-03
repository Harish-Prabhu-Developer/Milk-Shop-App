import {configureStore} from '@reduxjs/toolkit';
import productReducer from './Product/ProductSlice';
const Store=configureStore({
    reducer:{
        product:productReducer,
    },

});
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;