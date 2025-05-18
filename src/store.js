
import { configureStore } from '@reduxjs/toolkit';
import cartReducer   from './features/cart/cartSlice';
import authReducer   from './features/auth/authSlice';
import ordersReducer from './features/orders/ordersSlice';
import cartMiddleware from './features/cart/cartMiddleware';

export const store = configureStore({
  reducer: {
    cart:   cartReducer,
    auth:   authReducer,
    orders: ordersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(cartMiddleware),
});