import { createContext, useContext, useEffect, useState, useRef } from "react";
import { api } from "../axios/axiosClient";
import { ViewOrderItemRow } from "../types/viewOrders";
import toast from "react-hot-toast";
import { getRole } from "../auth/auth";

type AdminNotificationContextValue = {
  orders: ViewOrderItemRow[];
  adminCount: number;
  addOrder: (row: ViewOrderItemRow) => void;
  acceptOrder: (viewOrderId: string) => void;
  rejectOrder: (viewOrderId: string) => void;
  clear: () => void;
};

const AdminNotificationContext = createContext<
  AdminNotificationContextValue | undefined
>(undefined);

export const AdminNotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = useState<ViewOrderItemRow[]>([]);
  const role = getRole();

  const knownIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (role !== "Admin") return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/view");

        const apiOrders = Array.isArray(res.data?.orders)
          ? res.data.orders
          : [];

        const rows: ViewOrderItemRow[] = apiOrders.map((ord: any) => {
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
              prodName: it.prodName,
              price: it.price,
              quantity: it.quantity,
            })),
            status: ord.status,
            total,
          };
        });

        if (role === "Admin") {
          const prevIds = knownIdsRef.current;
          if (initializedRef.current) {
            rows.forEach((o) => {
              if (!prevIds.has(o.viewOrderId)) {
                const name = o.items?.[0]?.prodName;
                toast(`New order received: ${name} (ID: ${o.viewOrderId})`);
              }
            });
          } else {
            initializedRef.current = true;
          }
        }
        knownIdsRef.current = new Set(rows.map((r) => r.viewOrderId));
        setOrders(rows);
      } catch (err: any) {
        console.error(err);
        if (err.response.status === 401) {
          return;
        }
        toast.error("Failed to load orders");
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 50000);
    return () => clearInterval(interval);
  }, [role]);

  const addOrder = (row: ViewOrderItemRow) => {
    setOrders((prev) =>
      prev.some((x) => x.orderId === row.orderId) ? prev : [row, ...prev],
    );
  };

  const setStatus = (viewOrderId: string, status: "ACCEPTED" | "REJECTED") => {
    setOrders((prev) =>
      prev.map((r) => (r.viewOrderId === viewOrderId ? { ...r, status } : r)),
    );
  };

  const acceptOrder = async (viewOrderId: string) => {
    setStatus(viewOrderId, "ACCEPTED");

    try {
      await api.patch(`/order/view/status/${viewOrderId}`, {
        status: "ACCEPTED",
      });

      await api.patch(`/order/status/${viewOrderId}`, { status: "ACCEPTED" });
    } catch (e) {}
  };

  const rejectOrder = async (viewOrderId: string) => {
    setStatus(viewOrderId, "REJECTED");
    try {
      await api.patch(`/order/view/status/${viewOrderId}`, {
        status: "REJECTED",
      });

      await api.patch(`/order/status/${viewOrderId}`, { status: "REJECTED" });
    } catch (e) {
      throw e;
    }
  };

  const adminCount = orders.length;

  const clear = () => setOrders([]);

  return (
    <AdminNotificationContext.Provider
      value={{ orders, adminCount, addOrder, acceptOrder, rejectOrder, clear }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};

export const useAdminNotification = () => {
  const ctx = useContext(AdminNotificationContext);
  if (!ctx)
    throw new Error(
      "useAdminNotification must be used within AdminNotificationProvider",
    );
  return ctx;
};

export const useOptionalAdminNotification = () =>
  useContext(AdminNotificationContext); 
