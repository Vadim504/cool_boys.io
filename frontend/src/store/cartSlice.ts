import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'cartItems';

type CartState = {
  items: CartItem[];
};

const isCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const cartItem = item as Partial<CartItem>;
  return (
    typeof cartItem.id === 'number' &&
    typeof cartItem.name === 'string' &&
    typeof cartItem.price === 'number' &&
    typeof cartItem.weight === 'string' &&
    typeof cartItem.category === 'string' &&
    typeof cartItem.image === 'string' &&
    typeof cartItem.stock === 'number' &&
    typeof cartItem.quantity === 'number'
  );
};

const normalizeCartItem = (item: CartItem): CartItem | null => {
  const quantity = Math.min(Math.floor(item.quantity), item.stock);

  if (item.stock <= 0 || quantity <= 0) {
    return null;
  }

  return { ...item, quantity };
};

const getCartItems = (): CartItem[] => {
  try {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isCartItem)
      .map(normalizeCartItem)
      .filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
};

const saveCartItems = (items: CartItem[]) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
};

const persistCartItems = (items: CartItem[]) => {
  saveCartItems(items.map(item => ({ ...item })));
};

const initialState: CartState = {
  items: getCartItems(),
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
      persistCartItems(state.items);
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
      persistCartItems(state.items);
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      persistCartItems(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartItems([]);
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
      persistCartItems(state.items);
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
