import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
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
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
      stock: 3,
    };

    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <ProductCard product={product} />
        </Provider>
      </MemoryRouter>
    );

    // This is intentionally brittle: it depends on exact class nesting.
    expect(container.querySelector('.product-card .product-image img')).toBeInTheDocument();
    expect(container.querySelector('.product-card .product-controls .add-button')).toBeInTheDocument();
  });
});
