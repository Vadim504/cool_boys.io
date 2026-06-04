import type { Product } from '../types';
import { PRODUCT_DETAILS } from './productDetails';

const productImages = [
  'milk',
  'greek-yogurt',
  'cottage-cheese',
  'russian-cheese',
  'butter',
  'bananas',
  'red-apples',
  'cucumbers',
  'plum-tomatoes',
  'avocado',
  'cola',
  'still-water',
  'orange-juice',
  'lemon-iced-tea',
  'cappuccino',
  'margherita-pizza',
  'caesar-salad',
  'bolognese-pasta',
  'chicken-soup',
  'chicken-wrap',
  'wheat-baguette',
  'croissant',
  'rye-bread',
  'cinnamon-buns',
  'chicken-fillet',
  'ground-beef',
  'turkey-steak',
  'grill-sausages',
  'salmon-steak',
  'peeled-shrimp',
  'cod-fillet',
  'mussels-sauce',
  'pelmeni',
  'vegetable-mix',
  'vanilla-ice-cream',
  'chicken-nuggets',
  'cheese-chips',
  'mixed-nuts',
  'salted-popcorn',
  'milk-chocolate',
  'oatmeal-cookies',
  'berry-marmalade',
] as const;

const productImage = (id: number) => `/products/${productImages[id - 1]}.webp`;

const product = (
  id: number,
  name: string,
  price: number,
  weight: string,
  category: string,
  stock: number,
  extra: Pick<Product, 'oldPrice' | 'badge'> = {}
): Product => ({
  id,
  name,
  price,
  weight,
  category,
  stock,
  image: productImage(id),
  ...PRODUCT_DETAILS[id],
  ...extra,
});

export const productsData: Product[] = [
  product(1, 'Молоко 3.2%', 89, '930 мл', 'dairy', 10),
  product(2, 'Йогурт Греческий', 65, '150 г', 'dairy', 5),
  product(3, 'Творог 5%', 139, '300 г', 'dairy', 12, {
    badge: 'Белок',
  }),
  product(4, 'Сыр Российский', 219, '200 г', 'dairy', 8, {
    oldPrice: 249,
  }),
  product(5, 'Сливочное масло', 189, '180 г', 'dairy', 7),

  product(6, 'Бананы', 120, '1 кг', 'vegetables-fruits', 20),
  product(7, 'Яблоки Ред', 95, '1 кг', 'vegetables-fruits', 15),
  product(8, 'Огурцы короткие', 159, '600 г', 'vegetables-fruits', 14),
  product(9, 'Помидоры сливка', 179, '500 г', 'vegetables-fruits', 11),
  product(10, 'Авокадо спелое', 129, '1 шт.', 'vegetables-fruits', 9, {
    badge: 'Хит',
  }),

  product(11, 'Кока-кола', 99, '500 мл', 'beverages', 8),
  product(12, 'Вода негазированная', 49, '1.5 л', 'beverages', 24),
  product(13, 'Апельсиновый сок', 149, '1 л', 'beverages', 10),
  product(14, 'Холодный чай лимон', 119, '1 л', 'beverages', 13),
  product(15, 'Кофе капучино', 139, '250 мл', 'beverages', 9),

  product(16, 'Пицца Маргарита', 349, '420 г', 'ready-meal', 6, {
    oldPrice: 399,
    badge: 'Готово',
  }),
  product(17, 'Салат Цезарь', 259, '220 г', 'ready-meal', 8),
  product(18, 'Паста Болоньезе', 329, '300 г', 'ready-meal', 7),
  product(19, 'Суп куриный', 189, '350 г', 'ready-meal', 5),
  product(20, 'Ролл с курицей', 219, '240 г', 'ready-meal', 10),

  product(21, 'Багет пшеничный', 79, '250 г', 'bread-bakery', 12),
  product(22, 'Круассан', 89, '80 г', 'bread-bakery', 10),
  product(23, 'Хлеб ржаной', 69, '350 г', 'bread-bakery', 9),
  product(24, 'Булочки с корицей', 149, '2 шт.', 'bread-bakery', 7),

  product(25, 'Филе куриное', 289, '500 г', 'meat-poultry', 8),
  product(26, 'Фарш говяжий', 349, '400 г', 'meat-poultry', 6),
  product(27, 'Индейка стейк', 319, '450 г', 'meat-poultry', 5),
  product(28, 'Колбаски гриль', 279, '360 г', 'meat-poultry', 7),

  product(29, 'Лосось стейк', 599, '300 г', 'fish-seafood', 4),
  product(30, 'Креветки очищенные', 429, '250 г', 'fish-seafood', 6),
  product(31, 'Треска филе', 329, '400 г', 'fish-seafood', 7),
  product(32, 'Мидии в соусе', 279, '300 г', 'fish-seafood', 5),

  product(33, 'Пельмени домашние', 249, '700 г', 'frozen', 12),
  product(34, 'Овощная смесь', 159, '400 г', 'frozen', 13),
  product(35, 'Мороженое ваниль', 129, '220 г', 'frozen', 10),
  product(36, 'Наггетсы куриные', 229, '300 г', 'frozen', 9),

  product(37, 'Чипсы сырные', 119, '140 г', 'snacks', 12),
  product(38, 'Ореховый микс', 199, '150 г', 'snacks', 10),
  product(39, 'Попкорн солёный', 89, '90 г', 'snacks', 15),

  product(40, 'Шоколад молочный', 99, '90 г', 'sweets', 14),
  product(41, 'Печенье овсяное', 129, '250 г', 'sweets', 12),
  product(42, 'Мармелад ягодный', 109, '180 г', 'sweets', 11),
];
