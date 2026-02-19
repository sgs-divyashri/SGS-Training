export default function generateOrderId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `order-${randomPart}`;
}