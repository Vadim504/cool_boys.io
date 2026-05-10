import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProductCard from '../../src/components/ProductCard/ProductCard';
import cartReducer from '../../src/store/cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

describe('fragile ProductCard markup test', () => {
  it('renders specific nested class structure', () => {
    const product = {
      id: 101,
      name: 'Тестовый товар',
      price: 100,
      weight: '500 г',
      category: 'snacks',
      image: 'https://via.placeholder.com/150',
      stock: 3,
    };

    const { container } = render(
      <Provider store={store}>
        <ProductCard product={product} onOpenDetail={vi.fn()} />
      </Provider>
    );

    // This is intentionally brittle: it depends on exact class nesting.
    expect(container.querySelector('.product-card .product-image img')).toBeInTheDocument();
    expect(container.querySelector('.product-card .product-controls .add-button')).toBeInTheDocument();
  });
});
