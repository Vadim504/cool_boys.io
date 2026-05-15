// store/authSlice.js
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isAuth: boolean;
  phoneNumber: string | null;
};

const initialState: AuthState = {
  isAuth: localStorage.getItem('isAuth') === 'true',
  phoneNumber: localStorage.getItem('userPhone') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuth = true;
      state.phoneNumber = action.payload;
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('userPhone', action.payload);
    },
    logout: (state) => {
      state.isAuth = false;
      state.phoneNumber = null;
      localStorage.removeItem('isAuth');
      localStorage.removeItem('userPhone');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
