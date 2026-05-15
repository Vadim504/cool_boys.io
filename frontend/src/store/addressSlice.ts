import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Address } from '../types';

// Вспомогательная функция для безопасной работы с localStorage
const getJSON = (key: string): Address[] | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const saveAddresses = (items: Address[]) => {
  localStorage.setItem('deliveryAddresses', JSON.stringify(items));
};

const saveSelectedAddress = (address: Address) => {
  localStorage.setItem('lastSelectedAddress', address);
};

type AddressState = {
  items: Address[];
  selectedAddress: Address;
};

const initialState: AddressState = {
  // Список всех адресов
  items: getJSON('deliveryAddresses') || [], 
  // Текущий выбранный адрес
  selectedAddress: localStorage.getItem('lastSelectedAddress') || 'улица Баумана, 1 к1',
};

// store/addressSlice.js
const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      // Проверяем на дубликаты
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
        saveAddresses(state.items);
      }
      state.selectedAddress = action.payload;
      saveSelectedAddress(action.payload);
    },
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
      saveSelectedAddress(action.payload);
    },
    removeAddress: (state, action: PayloadAction<Address>) => {
      const wasSelected = state.selectedAddress === action.payload;
      state.items = state.items.filter(addr => addr !== action.payload);
      saveAddresses(state.items);

      if (wasSelected) {
        state.selectedAddress = state.items[0] || '';
        saveSelectedAddress(state.selectedAddress);
      }
    }
  }
});

export const { addAddress, setSelectedAddress, removeAddress } = addressSlice.actions;
export default addressSlice.reducer;
