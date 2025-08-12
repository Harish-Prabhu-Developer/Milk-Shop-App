import {configureStore} from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice';
import productReducer from './Product/ProductSlice';
import cartReducer from './Cart/CartSlice';
import OrderReducer from './Order/OrderSlice';
const Store=configureStore({
    reducer:{
        auth:authReducer,
        product:productReducer,
        Cart:cartReducer,
        Order:OrderReducer,
    },

});
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;