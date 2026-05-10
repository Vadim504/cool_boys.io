// src/store/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isProfileOpen: false,
    isAuthOpen: false,
  },
  reducers: {
    toggleProfile: (state, action) => {
      state.isProfileOpen = action.payload;
    },
    toggleAuth: (state, action) => {
      state.isAuthOpen = action.payload;
    },
  },
});

export const { toggleProfile, toggleAuth } = uiSlice.actions;
export default uiSlice.reducer;