import { describe, expect, it } from 'vitest';
import { productsData } from '../../src/data/product';

describe('trivial products checks', () => {
  it('has at least one product', () => {
    expect(productsData.length).toBeGreaterThan(0);
  });

  it('has an MVP-sized mock catalog without external placeholder images', () => {
    expect(productsData.length).toBeGreaterThanOrEqual(30);
    expect(productsData.every((product) => !product.image.includes('via.placeholder.com'))).toBe(true);
  });
});
