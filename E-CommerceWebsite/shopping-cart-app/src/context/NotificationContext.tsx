// NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../axios/axiosClient";
// import { ViewOrderItemRow } from "../types/viewOrders";
import toast from "react-hot-toast";
import { getRole } from "../auth/auth";
import { OrderNotificationRow } from "../types/orderNotification";

type NotificationContextValue = {
  orders: OrderNotificationRow[]; // only accepted/rejected orders
  cnt: number; // count of filtered orders
  removeFromNotifications: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = useState<OrderNotificationRow[]>([]);
  const role = getRole();
  const lastStatusesRef = useRef<Record<string, string>>({});
  const initializedRef = useRef(false);

  useEffect(() => {
    if (role !== "User") return;
    const fetchOrders = async () => {
      try {
        const res = await api.get("/notify-orders");

        const list = Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : [];

        const nextOrders: OrderNotificationRow[] = list
          .map((ord: any) => {
            const items = Array.isArray(ord.items) ? ord.items : [];
            const total = items.reduce(
              (sum: number, it: any) =>
                sum + Number(it.price ?? 0) * Number(it.quantity ?? 0),
              0,
            );

            return {
              notifyId: String(ord.notifyId),
              OrderId: String(ord.orderId),
              items: items.map((it: any) => ({
                prodName: String(it.prodName ?? ""),
                price: Number(it.price ?? 0),
                quantity: Number(it.quantity ?? 0),
              })),
              adminStatus: String(ord.adminStatus ?? "").toUpperCase(),
            };
          })
          .filter(
            (o: OrderNotificationRow) =>
              o.adminStatus === "ACCEPTED" || o.adminStatus === "REJECTED",
          );

        const prevMap = lastStatusesRef.current;

        if (initializedRef.current) {
          nextOrders.forEach((o) => {
            const prev = prevMap[o.orderId];
            const curr = o.adminStatus;

            if (prev !== curr && (curr === "ACCEPTED" || curr === "REJECTED")) {
              const productName = o.items[0].prodName;
              const baseMsg = `${productName} (Order #${o.notifyId})`;

              if (curr === "ACCEPTED") {
                toast.success(`${baseMsg} has been ACCEPTED`);
              } else {
                toast.error(`${baseMsg} has been REJECTED`);
              }
            }
          });
        } else {
          initializedRef.current = true;
        }

        setOrders(nextOrders);

        const nextMap: Record<string, string> = {};
        nextOrders.forEach((o) => {
          nextMap[o.orderId] = o.adminStatus;
        });
        lastStatusesRef.current = nextMap;
      } catch (e) {
        console.error(e);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [role]);

  const removeFromNotifications = async (notifyId: string) => {
    await api.delete(`/notify-orders/${notifyId}`)
    setOrders((prev) => prev.filter((o) => o.notifyId !== notifyId));
  };

  const clearAll = async () => {
    setOrders([]);
    lastStatusesRef.current = {};
  };

  return (
    <NotificationContext.Provider
      value={{ orders, cnt: orders.length, removeFromNotifications, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
