export default function generateCartItemId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `cart-${randomPart}`;
}