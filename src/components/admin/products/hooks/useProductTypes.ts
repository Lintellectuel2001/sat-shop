
export interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
  is_available?: boolean;
  is_physical?: boolean;
  purchase_price?: number;
}

export interface Order {
  id: string;
  product_id?: string;
  product_name: string;
  amount: string;
  customer_name?: string;
  customer_email?: string;
  status: 'pending' | 'validated' | 'cancelled';
  payment_id?: string;
  created_at: string;
}
