export type OrderNotificationRow = {
  notifyId: string;
  orderId: string;
  items: Array<{ prodName: string; price: number; quantity: number }>;
  adminStatus: "ACCEPTED" | "REJECTED"
};