import { ProductItems } from "./productItems";

export interface ViewOrdersPayload {
  viewOrderId: string;
  orderId: string;
  orderedBy: number;
  items: ProductItems[];
  totalAmount: number;
  status: string;
  userStatus: string;
  receivedAt?: Date;
}