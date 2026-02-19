import { CloseRounded, DoneAllRounded, DoneRounded } from "@mui/icons-material";
import { useAdminNotification } from "../context/adminNotificationContext";

export const AdminNotificationsPage = () => {
  const { orders, clear, acceptOrder, rejectOrder } = useAdminNotification();

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">Order Notifications</h2>

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

                <div className="flex items-center gap-3">
                  <button
                    className="px-2 py-1 border rounded bg-green-500 hover:bg-green-700"
                    onClick={() => acceptOrder(p.viewOrderId)}
                  >
                    <DoneRounded/>
                    Accept
                  </button>
                  <button
                    className="px-2 py-1 border rounded bg-red-500 hover:bg-red-700"
                    onClick={() => rejectOrder(p.viewOrderId)}
                  >
                    <CloseRounded/>
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <button
              className="px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900"
              onClick={clear}
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
