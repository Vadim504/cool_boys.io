import { CATEGORIES } from '../constants/categories';
import type { Product } from '../types';

const categoryNames = new Map(
  CATEGORIES.map((category) => [category.id, category.name])
);

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesProductSearch(product: Product, query: string): boolean {
  const terms = normalizeSearchText(query).split(' ').filter(Boolean);
  if (terms.length === 0) return true;

  const searchableText = normalizeSearchText(
    [
      product.name,
      product.description,
      product.composition,
      product.badge,
      categoryNames.get(product.category),
    ]
      .filter(Boolean)
      .join(' ')
  );

  return terms.every((term) => searchableText.includes(term));
}

export function searchProducts(products: Product[], query: string): Product[] {
  return products.filter((product) => matchesProductSearch(product, query));
}
