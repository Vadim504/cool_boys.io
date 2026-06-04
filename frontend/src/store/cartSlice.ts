import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { productsData } from '../data/product';
import type { CartLine, Product } from '../types';

const CART_STORAGE_KEY = 'cartItems';

type CartState = {
  items: CartLine[];
};

const toCartLine = (item: unknown): CartLine | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const candidate = item as Partial<CartLine> & Partial<Product>;
  const productId = typeof candidate.productId === 'number'
    ? candidate.productId
    : candidate.id;
  const product = productsData.find((productItem) => productItem.id === productId);
  if (!product || typeof candidate.quantity !== 'number') return null;

  const quantity = Math.min(Math.floor(candidate.quantity), product.stock);
  if (product.stock <= 0 || quantity <= 0) {
    return null;
  }

  return { productId: product.id, quantity };
};

const getCartItems = (): CartLine[] => {
  try {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(toCartLine)
      .filter((item): item is CartLine => item !== null);
  } catch {
    return [];
  }
};

const saveCartItems = (items: CartLine[]) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // localStorage can be unavailable in restricted browser modes.
  }
};

const persistCartItems = (items: CartLine[]) => {
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
      const item = state.items.find(i => i.productId === action.payload.id);
      const maxStock = action.payload.stock; // Получаем лимит из данных товара

      if (item) {
        // Проверяем: если текущее кол-во в корзине меньше склада, то прибавляем
        if (item.quantity < maxStock) {
          item.quantity += 1;
        }
      } else {
        // Если товара нет в корзине, проверяем, есть ли он вообще на складе
        if (maxStock > 0) {
          state.items.push({ productId: action.payload.id, quantity: 1 });
        }
      }
      persistCartItems(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.productId === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.productId !== action.payload);
        }
      }
      persistCartItems(state.items);
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.productId !== action.payload);
      persistCartItems(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartItems([]);
    },
    addManyToCart: (state, action: PayloadAction<CartLine[]>) => {
      action.payload.forEach((line) => {
        const product = productsData.find((productItem) => productItem.id === line.productId);
        if (!product) return;

        const item = state.items.find(i => i.productId === line.productId);
        const quantityToAdd = Math.max(0, line.quantity);

        if (item) {
          item.quantity = Math.min(product.stock, item.quantity + quantityToAdd);
          return;
        }

        const quantity = Math.min(product.stock, quantityToAdd);
        if (quantity > 0) {
          state.items.push({ productId: product.id, quantity });
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
