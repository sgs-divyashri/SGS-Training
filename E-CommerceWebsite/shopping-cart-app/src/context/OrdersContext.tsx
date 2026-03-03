import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../axios/axiosClient";
import { OrderItemRow } from "../types/orders";
import toast from "react-hot-toast";

type OrderContextValue = {
  items: OrderItemRow[];
  count: number;
  total: number;
  deleteOrder: (orderId: string) => Promise<void>;
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
        setItems(prev =>
          prev.map(r =>
            r.orderId === orderId ? { ...r, status: "CANCELLED" } : r
          )
        );

        toast.success(`Order ${row.orderId} cancelled.`);
      } catch (err: any) {

        setItems(prev =>
          prev.map(r =>
            r.orderId === orderId ? { ...r, status: row.status } : r
          )
        );

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

  const deleteOrder = async (orderId: string) => {
    const row = items.find((r) => r.orderId === orderId);
    if (!row) return;
    try {
      await api.delete(`delete-order/${row.orderId}`)
      setItems((prev) => prev.filter((r) => r.orderId !== orderId));
    }
    catch (err: any) {
      if (err.response.status === 401) {
        return;
      }
      const message =
        err?.response?.data?.error || err?.message || "Request failed";
      toast.error(message);
    }
  }

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
        deleteOrder,
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
