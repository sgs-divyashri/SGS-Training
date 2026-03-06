export type OrderNotificationRow = {
  notifyId: string;
  orderId: string;
  items: Array<{ productId: string; prodName: string; price: number; quantity: number, status: "ACCEPTED" | "REJECTED" }>;
  total: number;
};