// src/store/uiSlice.js
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  isProfileOpen: boolean;
  isAuthOpen: boolean;
};

const initialState: UiState = {
  isProfileOpen: false,
  isAuthOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleProfile: (state, action: PayloadAction<boolean>) => {
      state.isProfileOpen = action.payload;
    },
    toggleAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuthOpen = action.payload;
    },
  },
});

export const { toggleProfile, toggleAuth } = uiSlice.actions;
export default uiSlice.reducer;
