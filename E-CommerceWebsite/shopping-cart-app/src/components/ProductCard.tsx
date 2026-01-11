import { Product } from "../types/product";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {product.p_name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {product.p_description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-blue-600 font-bold">
            ₹{Number(product.price).toFixed(2)}
          </span>
          <button
            className="rounded-lg bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.p_name} to cart`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
