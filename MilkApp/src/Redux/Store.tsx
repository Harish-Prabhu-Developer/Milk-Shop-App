import {configureStore} from '@reduxjs/toolkit';
import productReducer from './Product/ProductSlice';
import cartReducer from './Cart/CartSlice';
const Store=configureStore({
    reducer:{
        product:productReducer,
        Cart:cartReducer,
    },

});
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;