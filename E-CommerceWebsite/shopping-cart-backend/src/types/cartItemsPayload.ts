import { ProductItems } from "./productItems";

export interface CartItemsPayload {
  cartId: string;
  items: ProductItems[];
  userId: number;
  // total_quantity?: number;
  // totalCount?: number;
  addedAt?: Date;
}