export interface Product {
  productId: string;      
  p_name: string;
  p_description: string;
  price: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}