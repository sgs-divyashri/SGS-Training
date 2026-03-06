import { createContext, useContext, useEffect, useState, useRef } from "react";
import { api } from "../axios/axiosClient";
import { ViewOrderItemRow } from "../types/viewOrders";
import toast from "react-hot-toast";
import { getRole } from "../auth/auth";

type AdminNotificationContextValue = {
  orders: ViewOrderItemRow[];
  adminCount: number;
  addOrder: (row: ViewOrderItemRow) => void;
  acceptOrder: (orderId: string, productId: string) => void;
  rejectOrder: (orderId: string, productId: string) => void;
  removeNotifications: (viewOrderId: string) => void
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

  useEffect(() => {
    if (role !== "Admin") return;
    let initialized = false;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/view");

        const apiOrders = Array.isArray(res.data?.orders) ? res.data.orders : [];

        const rows: ViewOrderItemRow[] = apiOrders.map((ord: any) => {
          const items = Array.isArray(ord.items) ? ord.items : [];
          const total = items.reduce(
            (sum: number, it: any) =>
              sum + Number(it.price ?? 0) * Number(it.quantity ?? 0),
            0,
          );

          return {
            orderId: String(ord.orderId),
            viewOrderId: String(ord.viewOrderId),
            items: items.map((it: any) => ({
              productId: String(it.productId),
              prodName: it.prodName,
              price: Number(it.price),
              quantity: it.quantity,
              status: it.status
            })),
            total,
          };
        });

        setOrders(prev => {
          if (initialized) {
            const prevSet = new Set(prev.map(o => o.viewOrderId));
            rows.forEach(o => {
              if (!prevSet.has(o.viewOrderId)) {
                const name = o.items[0]?.prodName;
                toast.success(`New order received: ${name} (ID: ${o.viewOrderId})`);
              }
            });
          } else {
            initialized = true;
          }
          return rows;
        })
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

  const setStatus = (orderId: string, productId: string, status: "ACCEPTED" | "REJECTED") => {
    setOrders((prev) =>
      prev.map(o =>
        o.orderId !== orderId ? o : {
          ...o, items: o.items.map(it =>
            String(it.productId) === String(productId) ? { ...it, status } : it
          ),
        }
      )
    );
  };

  const acceptOrder = async (orderId: string, productId: string) => {
    setStatus(orderId, productId, "ACCEPTED");

    try {
      await api.patch(`/order/status/${orderId}/${productId}`, { status: "ACCEPTED" });
    } catch (e) { }
  };

  const rejectOrder = async (orderId: string, productId: string) => {
    setStatus(orderId, productId, "REJECTED");
    try {
      await api.patch(`/order/status/${orderId}/${productId}`, { status: "REJECTED" });
    } catch (e) {
      throw e;
    }
  };

  const adminCount = orders.length;

  const removeNotifications = async (viewOrderId: string) => {
    await api.delete(`/order/${viewOrderId}`)
    setOrders((prev) => prev.filter((o) => o.viewOrderId !== viewOrderId));
  }

  const clear = () => setOrders([]);

  return (
    <AdminNotificationContext.Provider
      value={{ orders, adminCount, addOrder, acceptOrder, rejectOrder, removeNotifications, clear }}
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
