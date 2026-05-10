import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './addressSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import uiReducer from './uiSlice'; // Редьюсер для управления UI (профиль, вход)

export const store = configureStore({
  reducer: {
    // 2. Добавь поле 'auth'. 
    // Именно это имя будет искать useSelector(state => state.auth)
    auth: authReducer, 
    addresses: addressReducer,
    cart: cartReducer,
    ui: uiReducer, // Добавляем редьюсер для управления UI (профиль, вход)
  },
});