import { createSelector } from '@reduxjs/toolkit';
import { productsData } from '../data/product';
import type { CartItem } from '../types';
import type { RootState } from './index';

const selectCartLines = (state: RootState) => state.cart.items;

export const selectCartItems = createSelector(
  [selectCartLines],
  (lines): CartItem[] => lines
    .map((line) => {
      const product = productsData.find((item) => item.id === line.productId);
      if (!product) return null;
      return { ...product, quantity: line.quantity };
    })
    .filter((item): item is CartItem => item !== null)
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
