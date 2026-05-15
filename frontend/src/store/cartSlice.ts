import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../types';

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      const maxStock = action.payload.stock; // Получаем лимит из данных товара

      if (item) {
        // Проверяем: если текущее кол-во в корзине меньше склада, то прибавляем
        if (item.quantity < maxStock) {
          item.quantity += 1;
        }
      } else {
        // Если товара нет в корзине, проверяем, есть ли он вообще на складе
        if (maxStock > 0) {
          state.items.push({ ...action.payload, quantity: 1 });
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    addManyToCart: (state, action: PayloadAction<CartItem[]>) => {
      action.payload.forEach((product) => {
        const item = state.items.find(i => i.id === product.id);
        const quantityToAdd = Math.max(0, product.quantity);

        if (item) {
          item.quantity = Math.min(item.stock, item.quantity + quantityToAdd);
          return;
        }

        const quantity = Math.min(product.stock, quantityToAdd);
        if (quantity > 0) {
          state.items.push({ ...product, quantity });
        }
      });
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  removeItemFromCart,
  clearCart,
  addManyToCart,
} = cartSlice.actions;
export default cartSlice.reducer;
