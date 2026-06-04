import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Address } from '../types';
import { isSameAddress } from '../utils/address';
import { getProfile, saveProfileAddresses } from '../utils/mockProfiles';

type AddressState = {
  ownerPhone: string | null;
  items: Address[];
  selectedAddress: Address | null;
};

const getCurrentPhone = () => {
  try {
    return localStorage.getItem('userPhone') || null;
  } catch {
    return null;
  }
};

const getAddressStateForPhone = (phoneNumber: string | null): AddressState => {
  const profile = getProfile(phoneNumber);
  const selectedAddress =
    profile?.addresses.find((address) => address.id === profile.selectedAddressId) ||
    profile?.addresses[0] ||
    null;

  return {
    ownerPhone: profile?.phoneNumber || null,
    items: profile?.addresses || [],
    selectedAddress,
  };
};

const persistAddressState = (state: AddressState) => {
  saveProfileAddresses(
    state.ownerPhone,
    state.items,
    state.selectedAddress?.id || null
  );
};

const initialState: AddressState = getAddressStateForPhone(getCurrentPhone());

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    hydrateAddressesForUser: (_state, action: PayloadAction<string | null>) => {
      return getAddressStateForPhone(action.payload);
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      if (!state.ownerPhone) return;

      const existingAddress = state.items.find((address) => isSameAddress(address, action.payload));
      if (existingAddress) {
        state.selectedAddress = existingAddress;
      } else {
        state.items.push(action.payload);
        state.selectedAddress = action.payload;
      }
      persistAddressState(state);
    },
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
      persistAddressState(state);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      const wasSelected = state.selectedAddress?.id === action.payload;
      state.items = state.items.filter(address => address.id !== action.payload);

      if (wasSelected) {
        state.selectedAddress = state.items[0] || null;
      }
      persistAddressState(state);
    }
  }
});

export const {
  hydrateAddressesForUser,
  addAddress,
  setSelectedAddress,
  removeAddress,
} = addressSlice.actions;
export default addressSlice.reducer;
