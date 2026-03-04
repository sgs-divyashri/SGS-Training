export interface ProductPayload {
  productId: string;
  p_name: string;
  p_description: string;
  categoryId: string;
  price: number;
  total_quantity: number;
  inStock: string;
  addedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}