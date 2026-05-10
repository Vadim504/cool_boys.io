import { createSlice } from '@reduxjs/toolkit';

// Вспомогательная функция для безопасной работы с localStorage
const getJSON = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const initialState = {
  // Список всех адресов
  items: getJSON('deliveryAddresses') || [], 
  // Текущий выбранный адрес
  selectedAddress: localStorage.getItem('lastSelectedAddress') || 'улица Баумана, 1 к1',
};

// store/addressSlice.js
const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    items: JSON.parse(localStorage.getItem('deliveryAddresses')) || [],
    selectedAddress: localStorage.getItem('lastSelectedAddress') || '',
  },
  reducers: {
    addAddress: (state, action) => {
      // Проверяем на дубликаты
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
        // Сохраняем в localStorage для надежности
        localStorage.setItem('deliveryAddresses', JSON.stringify(state.items));
      }
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem('lastSelectedAddress', action.payload);
    },
    removeAddress: (state, action) => {
      state.items = state.items.filter(addr => addr !== action.payload);
      localStorage.setItem('deliveryAddresses', JSON.stringify(state.items));
    }
  }
});

export const { addAddress, setSelectedAddress, removeAddress } = addressSlice.actions;
export default addressSlice.reducer;