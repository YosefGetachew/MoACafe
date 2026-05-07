
export type Category = 'Coffee' | 'Breakfast' | 'Local' | 'Quick Bites' | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
}

export interface Cafeteria {
  id: string;
  name: string;
  logo: string;
  hero: string;
  description: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Rejected';

export interface Order {
  id: string;
  cafeteriaId: string;
  customerName: string;
  customerPhone: string;
  items: MenuItem[];
  total: number;
  paymentMethod: 'cash' | 'telebirr' | 'cbebirr';
  deliveryOption: 'pickup' | 'delivery';
  building?: string;
  office?: string;
  status: OrderStatus;
  createdAt: string;
  settledAt?: string;
}

export interface User {
  username: string;
  cafeteriaId: string;
  role: 'staff' | 'admin';
}
