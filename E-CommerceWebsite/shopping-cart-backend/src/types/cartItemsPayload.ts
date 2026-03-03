import { ProductItems } from "./productItems";

export interface CartItemsPayload {
  cartId: string;
  userId: number;
  productId: string;
  prodName: string;
  prodDescription: string;
  price: number;
  quantity: number;
  total_quantity: number;
  addedAt?: Date;
}