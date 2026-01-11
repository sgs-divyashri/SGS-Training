
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, total, increment, decrement, removeFromCart, clear } = useCart();

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded border p-4 bg-white text-gray-700">Your cart is empty.</div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map(it => {
              const id = it.productId;
              return (
                <li key={id} className="rounded border p-3 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{it.p_name}</div>
                    <div className="text-sm text-gray-600">₹{Number(it.price).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 border rounded" onClick={() => decrement(id)}>-</button>
                    <span className="min-w-[24px] text-center">{it.quantity}</span>
                    <button className="px-2 py-1 border rounded" onClick={() => increment(id)}>+</button>
                    <button className="ml-3 px-2 py-1 border rounded text-red-600" onClick={() => removeFromCart(id)}>
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</div>
            <button className="px-4 py-2 rounded bg-gray-800 text-white" onClick={clear}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
