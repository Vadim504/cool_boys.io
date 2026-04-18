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

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    // Добавить новый адрес
    addAddress: (state, action) => {
      state.items.push(action.payload);
      state.selectedAddress = action.payload; // Сразу выбираем новый
      localStorage.setItem('deliveryAddresses', JSON.stringify(state.items));
      localStorage.setItem('lastSelectedAddress', action.payload);
    },
    // Удалить адрес
    removeAddress: (state, action) => {
      state.items = state.items.filter(addr => addr !== action.payload);
      localStorage.setItem('deliveryAddresses', JSON.stringify(state.items));
      
      // Если удалили тот, что был выбран — сбрасываем выбор
      if (state.selectedAddress === action.payload) {
        state.selectedAddress = state.items[0] || '';
        localStorage.setItem('lastSelectedAddress', state.selectedAddress);
      }
    },
    // Выбрать адрес из списка
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem('lastSelectedAddress', action.payload);
    }
  }
});

export const { addAddress, removeAddress, setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;