// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: localStorage.getItem('isAuth') === 'true',
    phoneNumber: localStorage.getItem('userPhone') || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuth = true;
      state.phoneNumber = action.payload;
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('userPhone', action.payload);
    },
    logout: (state) => {
      state.isAuth = false;
      state.phoneNumber = null;
      localStorage.clear();
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;