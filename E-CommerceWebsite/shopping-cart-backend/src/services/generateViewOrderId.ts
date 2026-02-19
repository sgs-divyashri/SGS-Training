export default function generateViewOrderId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `viewOrder-${randomPart}`;
}