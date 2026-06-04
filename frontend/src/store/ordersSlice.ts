import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Address, CartItem, Order } from '../types';
import { getProfile, saveProfileOrders } from '../utils/mockProfiles';

type OrdersState = {
  ownerPhone: string | null;
  items: Order[];
};

type CreateOrderInput = {
  items: CartItem[];
  address: Address;
  userPhone: string;
};

const getCurrentPhone = () => {
  try {
    return localStorage.getItem('userPhone') || null;
  } catch {
    return null;
  }
};

const getOrdersStateForPhone = (phoneNumber: string | null): OrdersState => {
  const profile = getProfile(phoneNumber);
  return {
    ownerPhone: profile?.phoneNumber || null,
    items: profile?.orders || [],
  };
};

const initialState: OrdersState = getOrdersStateForPhone(getCurrentPhone());

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    hydrateOrdersForUser: (_state, action: PayloadAction<string | null>) => {
      return getOrdersStateForPhone(action.payload);
    },
    createOrder: {
      reducer: (state, action: PayloadAction<Order>) => {
        state.items.unshift(action.payload);
        saveProfileOrders(action.payload.userPhone, state.items);
      },
      prepare: ({ items, address, userPhone }: CreateOrderInput) => {
        const createdAt = new Date().toISOString();
        const timestamp = Date.now();
        const orderItems = items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          weight: item.weight,
          image: item.image,
          quantity: item.quantity,
        }));
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
            userPhone,
          },
        };
      },
    },
  },
});

export const { hydrateOrdersForUser, createOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
