export interface ProductItems {
  productId: string;
  prodName?: string;
  prodDescription?: string;
  price?: number;
  quantity: number;
  total_quantity?: number;
  status?: "ACCEPTED" | "REJECTED" | ""
}