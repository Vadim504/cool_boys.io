// src/store/uiSlice.js
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  isProfileOpen: boolean;
  isAuthOpen: boolean;
  isAddressOpen: boolean;
  isCheckoutOpen: boolean;
  isSupportOpen: boolean;
  selectedProductId: number | null;
};

const initialState: UiState = {
  isProfileOpen: false,
  isAuthOpen: false,
  isAddressOpen: false,
  isCheckoutOpen: false,
  isSupportOpen: false,
  selectedProductId: null,
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
    openAddressModal: (state) => {
      state.isAddressOpen = true;
    },
    closeAddressModal: (state) => {
      state.isAddressOpen = false;
    },
    openCheckout: (state) => {
      state.isCheckoutOpen = true;
    },
    closeCheckout: (state) => {
      state.isCheckoutOpen = false;
    },
    openSupport: (state) => {
      state.isSupportOpen = true;
    },
    closeSupport: (state) => {
      state.isSupportOpen = false;
    },
    openProductDetail: (state, action: PayloadAction<number>) => {
      state.selectedProductId = action.payload;
    },
    closeProductDetail: (state) => {
      state.selectedProductId = null;
    },
  },
});

export const {
  toggleProfile,
  toggleAuth,
  openAddressModal,
  closeAddressModal,
  openCheckout,
  closeCheckout,
  openSupport,
  closeSupport,
  openProductDetail,
  closeProductDetail,
} = uiSlice.actions;
export default uiSlice.reducer;
