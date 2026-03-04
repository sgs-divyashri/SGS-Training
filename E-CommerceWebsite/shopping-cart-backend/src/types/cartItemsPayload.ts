import { ProductItems } from "./productItems";

export interface CartItemsPayload {
  cartId: string;
  userId: number;
  productId: string;
  quantity: number;
  addedAt?: Date;
}