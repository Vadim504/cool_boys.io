import { describe, expect, it } from 'vitest';
import { productsData } from '../../src/data/product';
import { formatStreetAddress } from '../../src/utils/geocoding';
import {
  matchesProductSearch,
  normalizeSearchText,
  searchProducts,
} from '../../src/utils/productSearch';

describe('product search', () => {
  it('normalizes case, whitespace and yo letter', () => {
    expect(normalizeSearchText('  СЛАДКОЕ   Печенье  ')).toBe('сладкое печенье');
  });

  it('matches all query words across product fields', () => {
    const milk = productsData.find((product) => product.id === 1)!;

    expect(matchesProductSearch(milk, 'молоко завтрак')).toBe(true);
    expect(matchesProductSearch(milk, 'молоко шоколад')).toBe(false);
  });

  it('finds products by category label', () => {
    expect(searchProducts(productsData, 'напитки').length).toBeGreaterThan(0);
  });
});

describe('address formatting', () => {
  it('uses a street and house number when they are available', () => {
    expect(formatStreetAddress({ road: 'Тверская улица', house_number: '12' })).toBe(
      'Тверская улица, 12'
    );
  });

  it('falls back to alternate OSM street fields', () => {
    expect(formatStreetAddress({ pedestrian: 'Баумана', house_number: '7' })).toBe(
      'Баумана, 7'
    );
  });
});
