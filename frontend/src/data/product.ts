import type { Product } from '../types';

const productImage = (label: string, from: string, to: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="180" height="180" rx="32" fill="url(#bg)" />
      <circle cx="138" cy="42" r="18" fill="rgba(255,255,255,0.35)" />
      <circle cx="42" cy="138" r="26" fill="rgba(255,255,255,0.22)" />
      <text x="90" y="96" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const product = (
  id: number,
  name: string,
  price: number,
  weight: string,
  category: string,
  stock: number,
  label: string,
  colors: [string, string],
  extra: Pick<Product, 'oldPrice' | 'description' | 'badge'> = {}
): Product => ({
  id,
  name,
  price,
  weight,
  category,
  stock,
  image: productImage(label, colors[0], colors[1]),
  ...extra,
});

export const productsData: Product[] = [
  product(1, 'Молоко 3.2%', 89, '930 мл', 'dairy', 10, 'Milk', ['#5DBBFF', '#7E8CFF'], {
    description: 'Пастеризованное молоко для завтраков, каши и кофе.',
  }),
  product(2, 'Йогурт Греческий', 65, '150 г', 'dairy', 5, 'Yogurt', ['#7BDCB5', '#38A3A5'], {
    description: 'Плотный йогурт без лишней сладости.',
  }),
  product(3, 'Творог 5%', 139, '300 г', 'dairy', 12, 'Curd', ['#B8F2E6', '#5EAAA8'], {
    badge: 'Белок',
  }),
  product(4, 'Сыр Российский', 219, '200 г', 'dairy', 8, 'Cheese', ['#FFD166', '#F77F00'], {
    oldPrice: 249,
  }),
  product(5, 'Сливочное масло', 189, '180 г', 'dairy', 7, 'Butter', ['#FFE66D', '#FF9F1C']),

  product(6, 'Бананы', 120, '1 кг', 'vegetables-fruits', 20, 'Banana', ['#FFE45E', '#F9A620']),
  product(7, 'Яблоки Ред', 95, '1 кг', 'vegetables-fruits', 15, 'Apple', ['#FF6B6B', '#C1121F']),
  product(8, 'Огурцы короткие', 159, '600 г', 'vegetables-fruits', 14, 'Fresh', ['#80ED99', '#2D6A4F']),
  product(9, 'Помидоры сливка', 179, '500 г', 'vegetables-fruits', 11, 'Tomato', ['#FF8A5B', '#D62828']),
  product(10, 'Авокадо спелое', 129, '1 шт.', 'vegetables-fruits', 9, 'Avocado', ['#95D5B2', '#40916C'], {
    badge: 'Хит',
  }),

  product(11, 'Кока-кола', 99, '500 мл', 'beverages', 8, 'Cola', ['#343A40', '#D00000']),
  product(12, 'Вода негазированная', 49, '1.5 л', 'beverages', 24, 'Water', ['#90E0EF', '#0077B6']),
  product(13, 'Апельсиновый сок', 149, '1 л', 'beverages', 10, 'Juice', ['#FFB703', '#FB8500']),
  product(14, 'Холодный чай лимон', 119, '1 л', 'beverages', 13, 'Tea', ['#F4D35E', '#386641']),
  product(15, 'Кофе капучино', 139, '250 мл', 'beverages', 9, 'Coffee', ['#8D6E63', '#3E2723']),

  product(16, 'Пицца Маргарита', 349, '420 г', 'ready-meal', 6, 'Pizza', ['#FFADAD', '#E76F51'], {
    oldPrice: 399,
    badge: 'Готово',
  }),
  product(17, 'Салат Цезарь', 259, '220 г', 'ready-meal', 8, 'Salad', ['#B7E4C7', '#52B788']),
  product(18, 'Паста Болоньезе', 329, '300 г', 'ready-meal', 7, 'Pasta', ['#F4A261', '#BC6C25']),
  product(19, 'Суп куриный', 189, '350 г', 'ready-meal', 5, 'Soup', ['#FFD6A5', '#E85D04']),
  product(20, 'Ролл с курицей', 219, '240 г', 'ready-meal', 10, 'Roll', ['#CAF0F8', '#00B4D8']),

  product(21, 'Багет пшеничный', 79, '250 г', 'bread-bakery', 12, 'Bread', ['#E9C46A', '#B08968']),
  product(22, 'Круассан', 89, '80 г', 'bread-bakery', 10, 'Bake', ['#FFE8A3', '#D4A373']),
  product(23, 'Хлеб ржаной', 69, '350 г', 'bread-bakery', 9, 'Rye', ['#A98467', '#6C584C']),
  product(24, 'Булочки с корицей', 149, '2 шт.', 'bread-bakery', 7, 'Buns', ['#F6BD60', '#9C6644']),

  product(25, 'Филе куриное', 289, '500 г', 'meat-poultry', 8, 'Chicken', ['#FFC2D1', '#FF758F']),
  product(26, 'Фарш говяжий', 349, '400 г', 'meat-poultry', 6, 'Beef', ['#E76F51', '#7F1D1D']),
  product(27, 'Индейка стейк', 319, '450 г', 'meat-poultry', 5, 'Turkey', ['#FFCAD4', '#C9184A']),
  product(28, 'Колбаски гриль', 279, '360 г', 'meat-poultry', 7, 'Grill', ['#F77F00', '#9D0208']),

  product(29, 'Лосось стейк', 599, '300 г', 'fish-seafood', 4, 'Salmon', ['#FFAFCC', '#FB6F92']),
  product(30, 'Креветки очищенные', 429, '250 г', 'fish-seafood', 6, 'Shrimp', ['#A2D2FF', '#0077B6']),
  product(31, 'Треска филе', 329, '400 г', 'fish-seafood', 7, 'Fish', ['#BDE0FE', '#4361EE']),
  product(32, 'Мидии в соусе', 279, '300 г', 'fish-seafood', 5, 'Mussel', ['#CDB4DB', '#7209B7']),

  product(33, 'Пельмени домашние', 249, '700 г', 'frozen', 12, 'Frozen', ['#D0F4DE', '#00B4D8']),
  product(34, 'Овощная смесь', 159, '400 г', 'frozen', 13, 'Mix', ['#B5E48C', '#168AAD']),
  product(35, 'Мороженое ваниль', 129, '220 г', 'frozen', 10, 'Ice', ['#E0FBFC', '#98C1D9']),
  product(36, 'Наггетсы куриные', 229, '300 г', 'frozen', 9, 'Nuggets', ['#FFD166', '#EF476F']),

  product(37, 'Чипсы сырные', 119, '140 г', 'snacks', 12, 'Chips', ['#FEE440', '#F15BB5']),
  product(38, 'Ореховый микс', 199, '150 г', 'snacks', 10, 'Nuts', ['#DDB892', '#7F5539']),
  product(39, 'Попкорн солёный', 89, '90 г', 'snacks', 15, 'Corn', ['#FFF3B0', '#CA6702']),

  product(40, 'Шоколад молочный', 99, '90 г', 'sweets', 14, 'Choco', ['#9C6644', '#582F0E']),
  product(41, 'Печенье овсяное', 129, '250 г', 'sweets', 12, 'Cookie', ['#E9C46A', '#BC6C25']),
  product(42, 'Мармелад ягодный', 109, '180 г', 'sweets', 11, 'Sweet', ['#FF70A6', '#9D4EDD']),
];
