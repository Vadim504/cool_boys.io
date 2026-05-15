export type Category = {
  id: string;
  name: string;
  icon: string;
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
  badge?: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type Address = string;

export type OrderStatus = 'created';

export type OrderItem = CartItem;

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  address: Address;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};
