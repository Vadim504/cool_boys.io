import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Address, CartItem, Order } from '../types';

type OrdersState = {
  items: Order[];
};

type CreateOrderInput = {
  items: CartItem[];
  address: Address;
};

const getOrders = (): Order[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem('mockOrders') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem('mockOrders', JSON.stringify(orders));
};

const initialState: OrdersState = {
  items: getOrders(),
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: {
      reducer: (state, action: PayloadAction<Order>) => {
        state.items.unshift(action.payload);
        saveOrders(state.items);
      },
      prepare: ({ items, address }: CreateOrderInput) => {
        const createdAt = new Date().toISOString();
        const timestamp = Date.now();
        const orderItems = items.map((item) => ({ ...item }));
        const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
          payload: {
            id: `order-${timestamp}`,
            number: `MF-${String(timestamp).slice(-6)}`,
            createdAt,
            address,
            items: orderItems,
            total,
            status: 'created' as const,
          },
        };
      },
    },
  },
});

export const { createOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
