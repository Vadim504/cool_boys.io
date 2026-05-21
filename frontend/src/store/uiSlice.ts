// src/store/uiSlice.js
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UiState = {
  isProfileOpen: boolean;
  isAuthOpen: boolean;
  isAddressOpen: boolean;
  isCheckoutOpen: boolean;
  isSupportOpen: boolean;
  isCartOpen: boolean;
  selectedProductId: number | null;
};

const initialState: UiState = {
  isProfileOpen: false,
  isAuthOpen: false,
  isAddressOpen: false,
  isCheckoutOpen: false,
  isSupportOpen: false,
  isCartOpen: false,
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
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    openProductDetail: (state, action: PayloadAction<number>) => {
      state.selectedProductId = action.payload;
    },
    closeProductDetail: (state) => {
      state.selectedProductId = null;
    },
    /** Восстановление UI из URL (обновление страницы, назад/вперёд в браузере) */
    hydrateUiFromSearchParams: (state, action: PayloadAction<URLSearchParams>) => {
      const modal = action.payload.get('modal');
      const productRaw = action.payload.get('product');

      state.isAuthOpen = modal === 'auth';
      state.isProfileOpen = modal === 'profile';
      state.isAddressOpen = modal === 'address';
      state.isCheckoutOpen = modal === 'checkout';
      state.isSupportOpen = modal === 'support';
      state.isCartOpen = modal === 'cart';

      if (productRaw) {
        const id = Number(productRaw);
        state.selectedProductId = Number.isFinite(id) ? id : null;
      } else {
        state.selectedProductId = null;
      }
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
  openCart,
  closeCart,
  openProductDetail,
  closeProductDetail,
  hydrateUiFromSearchParams,
} = uiSlice.actions;
export default uiSlice.reducer;
