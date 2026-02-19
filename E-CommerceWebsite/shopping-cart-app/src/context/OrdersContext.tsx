import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../axios/axiosClient";
import type { Product } from "../types/product";
import { OrderItemRow } from "../types/orders";
import toast from "react-hot-toast";

type OrderContextValue = {
  items: OrderItemRow[];
  count: number;
  total: number;
  cancelOrder: (orderId: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<OrderItemRow[]>([]);

  const fetchOrders = useCallback(async () => {
    const res = await api.get("/orders");

    const rows = res.data.orders.map((ord: any) => ({
      rowId: String(ord.orderId),
      orderId: String(ord.orderId),
      items: (ord.items || []).map((it: any) => ({
        prodName: it.prodName,
        price: Number(it.price),
        quantity: it.quantity,
      })),
      status: ord.status,
    }));

    setItems(rows);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = useCallback(
    async (orderId: string) => {
      const row = items.find((r) => r.orderId === orderId);
      if (!row) return;

      const payload = row.status;

      try {
        await api.patch(`/cancel-order/${row.orderId}`, payload);

        await api.delete(`/delete-notification-order/${row.orderId}`);
        toast.success(`Order ${row.orderId} cancelled.`);

        setItems((prev) => prev.filter((r) => r.orderId !== orderId));
      } catch (err: any) {
        console.error(err);
        if (err.response.status === 401) {
          return;
        }
        const message =
          err?.response?.data?.error || err?.message || "Request failed";
        toast.error(message);
      }
    },
    [items],
  );

  const count = items.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, it) => s + (it.quantity ?? 0), 0),
    0,
  );

  const total = items.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (s, it) => s + Number(it.price ?? 0) * Number(it.quantity ?? 0),
        0,
      ),
    0,
  );

  return (
    <OrderContext.Provider
      value={{
        items,
        count,
        total,
        cancelOrder,
        fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
