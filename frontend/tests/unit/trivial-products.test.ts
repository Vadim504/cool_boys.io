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

  it('provides descriptions, ingredients and nutrition facts for every product', () => {
    expect(
      productsData.every((product) => {
        const nutrition = product.nutrition;

        return Boolean(
          product.description &&
          product.composition &&
          nutrition &&
          nutrition.calories >= 0 &&
          nutrition.proteins >= 0 &&
          nutrition.fats >= 0 &&
          nutrition.carbohydrates >= 0 &&
          ['100 г', '100 мл'].includes(nutrition.per)
        );
      })
    ).toBe(true);
  });
});
