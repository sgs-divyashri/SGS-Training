// NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../axios/axiosClient";
import { ViewOrderItemRow } from "../types/viewOrders";
import toast from "react-hot-toast";
import { getRole } from "../auth/auth";

type NotificationContextValue = {
  orders: ViewOrderItemRow[]; // only accepted/rejected orders
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
  const [orders, setOrders] = useState<ViewOrderItemRow[]>([]);
  const role = getRole();
  const lastStatusesRef = useRef<Record<string, string>>({});
  const initializedRef = useRef(false);

  useEffect(() => {
    if (role !== "User") return;
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order-status");

        const list = Array.isArray(res.data?.orderStatus)
          ? res.data.orderStatus
          : [];

        const nextOrders: ViewOrderItemRow[] = list
          .map((ord: any) => {
            const items = Array.isArray(ord.items) ? ord.items : [];
            const total = items.reduce(
              (sum: number, it: any) =>
                sum + Number(it.price ?? 0) * Number(it.quantity ?? 0),
              0,
            );

            return {
              orderId: String(ord.orderId),
              viewOrderId: String(ord.viewOrderId ?? ord.orderId),
              items: items.map((it: any) => ({
                prodName: String(it.prodName ?? ""),
                price: Number(it.price ?? 0),
                quantity: Number(it.quantity ?? 0),
              })),
              status: String(ord.adminStatus ?? "").toUpperCase(),
              total,
            };
          })
          .filter(
            (o: ViewOrderItemRow) =>
              o.status === "ACCEPTED" || o.status === "REJECTED",
          );

        const prevMap = lastStatusesRef.current;

        if (initializedRef.current) {
          nextOrders.forEach((o) => {
            const prev = prevMap[o.orderId];
            const curr = o.status;

            if (prev !== curr && (curr === "ACCEPTED" || curr === "REJECTED")) {
              const productName = o.items[0].prodName;
              const baseMsg = `${productName} (Order #${o.viewOrderId})`;

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
          nextMap[o.orderId] = o.status;
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

  const removeFromNotifications = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
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
