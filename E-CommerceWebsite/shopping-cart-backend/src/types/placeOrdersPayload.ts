import { ProductItems } from "./productItems";

export interface PlaceOrdersPayload {
  orderId: string;
  orderedBy: number;
  items: ProductItems[];
  totalAmount: number;
  status: string;
  placedAt?: Date;
}