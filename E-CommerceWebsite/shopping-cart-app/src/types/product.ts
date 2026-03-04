export interface Product {
  productId: string;      
  p_name: string;
  p_description: string;
  prod_category: string;
  price: number | string;
  total_quantity?: number | string;
  inStock: string;
  isNotification: boolean;
  createdAt?: string;
  updatedAt?: string;
}