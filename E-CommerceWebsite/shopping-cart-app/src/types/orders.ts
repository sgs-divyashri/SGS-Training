export type OrderItemRow = {
  rowId: string;
  orderId: string;
  items: Array<{ prodName: string; price: number; quantity: number}>;
  status: string;
};