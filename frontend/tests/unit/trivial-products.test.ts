import { describe, expect, it } from 'vitest';
import { productsData } from '../../src/data/product';

describe('trivial products checks', () => {
  it('has at least one product', () => {
    expect(productsData.length).toBeGreaterThan(0);
  });
});
