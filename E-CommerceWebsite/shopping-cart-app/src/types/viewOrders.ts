export type ViewOrderItemRow = {
  viewOrderId: string;
  orderId: string;
  items: Array<{ prodName: string; price: number; quantity: number }>;
  status: "ACCEPTED" | "REJECTED"
  total: number
};