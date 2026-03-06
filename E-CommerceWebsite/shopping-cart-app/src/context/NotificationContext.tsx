import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../axios/axiosClient";
import toast from "react-hot-toast";
import { getRole } from "../auth/auth";
import { OrderNotificationRow } from "../types/orderNotification";

type NotificationContextValue = {
  orders: OrderNotificationRow[];
  cnt: number;
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
    let initialized = false;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/notify-orders");

        const list = Array.isArray(res.data?.notifications) ? res.data.notifications : [];

        const mapped: OrderNotificationRow[] = list.map((ord: any) => {
          const items = Array.isArray(ord.items) ? ord.items : [];
          // const total = items.reduce(
          //   (sum: number, it: any) =>
          //     sum + Number(it.price ?? 0) * Number(it.quantity ?? 0),
          //   0,
          // );

          return {
            notifyId: String(ord.notifyId),
            OrderId: String(ord.orderId),
            items: items.map((it: any) => ({
              productId: String(it.productId),
              prodName: String(it.prodName),
              price: Number(it.price),
              quantity: Number(it.quantity),
              status: (it.status)
            })),
          };
        })

        setOrders(prev => {
          if (initialized) {
            const prevSet = new Set(prev.map(o => o.notifyId));

            mapped.forEach(o => {
              if (!prevSet.has(o.notifyId)) {
                const name = o.items[0]?.prodName;
                const status = o.items[0]?.status?.toUpperCase();
                if (status === 'ACCEPTED') {
                  toast.success(`${name} has been ACCEPTED.`)
                }
                else if (status === 'REJECTED') {
                  toast.error(`${name} has been REJECTED.`)
                }
              }
            })
          } else {
            initialized = true;
          }

          return mapped;
        });
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
