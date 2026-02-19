export interface Product {
  productId: string;      
  p_name: string;
  p_description: string;
  prod_category: string;
  price: number | string;
  qty?: number | string;
  inStock: string;
  isNotification: boolean;
  createdAt?: string;
  updatedAt?: string;
}