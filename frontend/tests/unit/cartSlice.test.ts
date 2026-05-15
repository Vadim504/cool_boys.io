import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartItem, Product } from '../../src/types';

const product: Product = {
  id: 501,
  name: 'Test product',
  price: 120,
  weight: '1 pc',
  category: 'test',
  image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
  stock: 5,
};

const loadCartSlice = async () => {
  vi.resetModules();
  return import('../../src/store/cartSlice');
};

describe('cartSlice persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('hydrates cart items from localStorage', async () => {
    const item: CartItem = { ...product, quantity: 2 };
    localStorage.setItem('cartItems', JSON.stringify([item]));

    const { default: cartReducer } = await loadCartSlice();

    expect(cartReducer(undefined, { type: 'unknown' }).items).toEqual([item]);
  });

  it('falls back to an empty cart when stored data is invalid', async () => {
    localStorage.setItem('cartItems', '{invalid-json');

    const { default: cartReducer } = await loadCartSlice();

    expect(cartReducer(undefined, { type: 'unknown' }).items).toEqual([]);
  });

  it('updates localStorage when cart changes', async () => {
    const { addToCart, clearCart, default: cartReducer } = await loadCartSlice();

    const filledState = cartReducer(undefined, addToCart(product));
    expect(JSON.parse(localStorage.getItem('cartItems') || '[]')).toEqual([
      { ...product, quantity: 1 },
    ]);

    cartReducer(filledState, clearCart());
    expect(localStorage.getItem('cartItems')).toBe('[]');
  });
});
