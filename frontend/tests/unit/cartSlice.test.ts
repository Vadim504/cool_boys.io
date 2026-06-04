import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productsData } from '../../src/data/product';
import type { CartItem, CartLine, Product } from '../../src/types';

const product: Product = productsData[0];

const loadCartSlice = async () => {
  vi.resetModules();
  return import('../../src/store/cartSlice');
};

describe('cartSlice persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('hydrates compact cart lines from localStorage', async () => {
    const item: CartLine = { productId: product.id, quantity: 2 };
    localStorage.setItem('cartItems', JSON.stringify([item]));

    const { default: cartReducer } = await loadCartSlice();

    expect(cartReducer(undefined, { type: 'unknown' }).items).toEqual([item]);
  });

  it('migrates legacy full product cart items from localStorage', async () => {
    const legacyItem: CartItem = { ...product, quantity: 2 };
    localStorage.setItem('cartItems', JSON.stringify([legacyItem]));

    const { default: cartReducer } = await loadCartSlice();

    expect(cartReducer(undefined, { type: 'unknown' }).items).toEqual([
      { productId: product.id, quantity: 2 },
    ]);
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
      { productId: product.id, quantity: 1 },
    ]);

    cartReducer(filledState, clearCart());
    expect(localStorage.getItem('cartItems')).toBe('[]');
  });
});
