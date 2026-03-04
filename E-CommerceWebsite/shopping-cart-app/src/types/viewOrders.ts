export type ViewOrderItemRow = {
  viewOrderId: string;
  orderId: string;
  items: Array<{  productId: string; prodName: string; price: number; quantity: number; status: "ACCEPTED" | "REJECTED" }>;
  // status: "ACCEPTED" | "REJECTED"
  total: number
};