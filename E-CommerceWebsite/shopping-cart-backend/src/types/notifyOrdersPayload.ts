import { ProductItems } from "./productItems";

export interface NotifyOrdersPayload {
  notifyId: string;
  orderId: string;
  items: ProductItems[];
  receivedAt?: Date;
}