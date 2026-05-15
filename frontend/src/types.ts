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
};

export type CartItem = Product & {
  quantity: number;
};

export type Address = string;
