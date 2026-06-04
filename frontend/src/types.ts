export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type NutritionFacts = {
  calories: number;
  proteins: number;
  fats: number;
  carbohydrates: number;
  per: '100 г' | '100 мл';
};

export type Product = {
  id: number;
  name: string;
  price: number;
  weight: string;
  category: string;
  image: string;
  stock: number;
  oldPrice?: number;
  description?: string;
  composition?: string;
  nutrition?: NutritionFacts;
  badge?: string;
};

export type CartLine = {
  productId: number;
  quantity: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type Address = {
  id: string;
  city: string;
  street: string;
  apartment?: string;
  floor?: string;
  entrance?: string;
  intercom?: string;
  comment?: string;
};

export type OrderStatus = 'created';

export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  weight: string;
  image: string;
  quantity: number;
};

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  address: Address;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  userPhone: string;
};
