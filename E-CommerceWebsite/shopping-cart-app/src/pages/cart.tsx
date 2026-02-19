import { useState } from "react";
import { useCart } from "../context/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { decodeToken } from "../auth/auth";
import { useOrder } from "../context/OrdersContext";

export const CartPage = () => {
  const {
    items,
    total,
    removeFromCart,
    increment,
    decrement,
    placeOrders,
    placeOrderItem,
    saveQuantity,
    clearCart,
  } = useCart();
  const { fetchOrders } = useOrder();
  const [placingId, setPlacingId] = useState<string | null>(null);
  const [placingAll, setPlacingAll] = useState(false);
  const claims = decodeToken();
  const userId = claims?.userId;

  const placingOrderItems = async (cartId: string) => {
    if (items.length === 0 || placingId) return;
    try {
      setPlacingId(cartId);
      await new Promise((res) => setTimeout(res, 1000));
      await placeOrderItem(cartId);
      toast.success("Order placed");
      await fetchOrders();
    } catch (err: any) {
      console.error(err);
      if (err.response.status === 401) {
        return;
      }
      toast.error("Failed to place order");
    } finally {
      setPlacingId(null);
    }
  };

  const onPlaceAll = async () => {
    if (placingAll) return;
    if (items.length === 0) return;
    try {
      setPlacingAll(true);
      await new Promise((res) => setTimeout(res, 1000));
      await placeOrders();
      toast.success("All orders placed");
      await fetchOrders();
    } catch {
      toast.error("Failed to place all orders");
    } finally {
      setPlacingAll(false);
    }
  };

  const saveDirectQuantity = async (cartId: string, qty: number) => {
    try {
      const claims = decodeToken();
      await saveQuantity(cartId, claims?.userId!, qty);
      toast.success("Quantity updated");
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const EditableQuantity = ({
    quantity,
    onChange,
  }: {
    quantity: number;
    onChange: (q: number) => void;
  }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(String(quantity));

    const startEdit = () => {
      setValue(String(quantity));
      setEditing(true);
    };

    const finishEdit = () => {
      const num = Number(value);
      if (!isNaN(num) && num >= 0) {
        onChange(num);
      }
      setEditing(false);
    };

    const cancel = () => {
      setEditing(false);
      setValue(String(quantity));
    };

    return (
      <div className="min-w-[32px] text-center">
        {editing ? (
          <input
            autoFocus
            className="w-12 border rounded px-1 text-center"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") finishEdit();
              if (e.key === "Escape") cancel();
            }}
          />
        ) : (
          <span
            className="cursor-pointer select-none"
            onDoubleClick={startEdit}
          >
            {quantity}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded border p-4 bg-white text-gray-700">
          Your cart is empty.
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((it) => {
              const id = it.cartId;
              return (
                <li
                  key={id}
                  className="rounded border p-3 bg-white flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{it.prodName}</div>
                    <div className="text-gray-600 text-sm mt-1">
                      {it.prodDescription}
                    </div>
                    <div className="text-sm text-gray-600">
                      Price: ₹ {Number(it.price).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Quantity: {it.total_quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => decrement(it.cartId)}
                    >
                      -
                    </button>

                    <EditableQuantity
                      quantity={it.quantity}
                      onChange={(newQty) =>
                        saveDirectQuantity(it.cartId, newQty)
                      }
                    />

                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => increment(it.cartId)}
                    >
                      +
                    </button>
                    <button
                      className="px-2 py-2 mx-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-sm disabled:opacity-50"
                      onClick={() => placingOrderItems(it.cartId)}
                      disabled={placingId === it.cartId}
                    >
                      {placingId === it.cartId
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>
                    <CloseIcon
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(it.cartId)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">
              Total: ₹ {total.toFixed(2)}
            </div>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900 shadow-sm disabled:opacity-50"
              onClick={onPlaceAll}
              disabled={placingAll}
            >
              {placingAll ? "Placing All Orders..." : "Place All Orders"}
            </button>
          </div>
          <div>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900"
              onClick={() => clearCart(userId!)}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
