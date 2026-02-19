import { useOrder } from "../context/OrdersContext";
import { useState } from "react";

export const OrdersPage = () => {
  const { items, total, cancelOrder } = useOrder();
  const [busyId, setBusyId] = useState<string | null>(null);

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {items.length === 0 ? (
        <div className="rounded border p-4 bg-white text-gray-700">
          No orders yet.
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((it) => {
              const id = it.rowId;
              const isCancelled = it.status === "CANCELLED";
              const isBusy = busyId === it.orderId;
              return (
                <li
                  key={id}
                  className="rounded border p-3 bg-white flex items-center justify-between"
                >
                  <div className="mt-2 space-y-2">
                    {it.items.map((it, idx) => (
                      <div key={idx}>
                        <div className="font-medium">{it.prodName}</div>
                        <div className="text-sm font-semibold">
                          Price: ₹ {it.price.toFixed(2)}
                        </div>
                        <div className="text-sm">Qty: {it.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`ml-3 px-2 py-1 border rounded ${
                        isCancelled
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-700 text-white hover:bg-red-700"
                      }`}
                      disabled={isCancelled}
                      onClick={() => {
                        if (isCancelled || isBusy) return;
                        setBusyId(it.orderId);
                        cancelOrder(it.orderId);
                      }}
                    >
                      {isCancelled ? "Cancelled" : "Cancel Order"}
                    </button>
                    <div></div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-semibold">
              Total: ₹ {total.toFixed(2)}
            </div>
            {/* <button className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900" onClick={clear}>
              Clear Cart
            </button> */}
          </div>
        </>
      )}
    </div>
  );
}
