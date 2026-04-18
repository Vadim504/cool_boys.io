import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './addressSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    // Теперь все адреса будут лежать в state.addresses
    addresses: addressReducer,
    // Теперь все элементы корзины будут лежать в state.cart
    cart: cartReducer,
  },
});