import { CloseRounded } from "@mui/icons-material";
import { useOrder } from "../context/OrdersContext";
import { useState } from "react";

export const OrdersPage = () => {
  const { items, total, cancelOrder, deleteOrder } = useOrder();

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
                      className={`ml-3 px-2 py-1 border rounded ${isCancelled
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-700 text-white hover:bg-red-700"
                        }`}
                      disabled={isCancelled}
                      onClick={async () => {
                        // if (isCancelled) return;
                        await cancelOrder(it.orderId);
                      }}
                    >
                      {isCancelled ? "Cancelled" : "Cancel Order"}
                    </button>
                    <button onClick={() => deleteOrder(it.orderId)}>
                      <CloseRounded />
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
          </div>
        </>
      )}
    </div>
  );
}
