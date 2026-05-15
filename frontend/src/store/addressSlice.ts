import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Address } from '../types';

// Вспомогательная функция для безопасной работы с localStorage
const getJSON = (key: string): Address[] | null => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
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
        // Сохраняем в localStorage для надежности
        localStorage.setItem('deliveryAddresses', JSON.stringify(state.items));
      }
    },
    setSelectedAddress: (state, action: PayloadAction<Address>) => {
      state.selectedAddress = action.payload;
      localStorage.setItem('lastSelectedAddress', action.payload);
    },
    removeAddress: (state, action: PayloadAction<Address>) => {
      state.items = state.items.filter(addr => addr !== action.payload);
      localStorage.setItem('deliveryAddresses', JSON.stringify(state.items));
    }
  }
});

export const { addAddress, setSelectedAddress, removeAddress } = addressSlice.actions;
export default addressSlice.reducer;
