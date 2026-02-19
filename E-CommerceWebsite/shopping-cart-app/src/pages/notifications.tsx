import { useNotification } from "../context/NotificationContext";

export const NotificationsPage = () => {
  const { orders, removeFromNotifications, clearAll } = useNotification();

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">
        Notifications
      </h2>

      {orders.length === 0 ? (
        <div className="rounded border my-4 p-4 bg-white text-gray-700">
          No notifications yet.
        </div>
      ) : (
        <>
          <ul className="space-y-3 my-4">
            {orders.map((p) => (
              <li
                key={p.orderId}
                className="border rounded p-3 flex items-center justify-between"
              >
                <div className="mt-2 space-y-2">
                  {p.items.map((it, idx) => (
                    <div key={idx}>
                      <div className="font-medium">Product Name: <span className="text-sm font-medium">{it.prodName}</span></div>
                      <div className="text-sm font-semibold">
                        Price: ₹ {it.price.toFixed(2)}
                      </div>
                      <div className="text-sm">Quantity: {it.quantity}</div>
                      <div className="text-sm">Status: <span className={p.status === 'ACCEPTED' ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{p.status}</span></div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => removeFromNotifications(p.orderId)}
                  className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  title="Remove this notification"
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <button
              className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
