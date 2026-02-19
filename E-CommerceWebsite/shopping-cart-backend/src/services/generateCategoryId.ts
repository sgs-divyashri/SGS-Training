export default function generateCategoryId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `category-${randomPart}`;
}