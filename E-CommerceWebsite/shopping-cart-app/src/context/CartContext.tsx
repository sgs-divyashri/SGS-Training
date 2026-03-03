import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../axios/axiosClient";
import { decodeToken, getRole } from "../auth/auth";
import type { Product } from "../types/product";
import toast from "react-hot-toast";

export type CartItem = {
  cartId: string;
  userId: number;
  prodId: string;
  prodName: string;
  prodDescription: string;
  price: number;
  quantity: number;
  total_quantity: number;
};

type AddToCartInput = {
  product: Product;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  increment: (cartId: string) => Promise<void>;
  decrement: (cartId: string) => Promise<void>;
  saveQuantity: (
    cartId: string,
    userId: number,
    newQty: number,
  ) => Promise<void>;
  addToCart: (inp: AddToCartInput) => Promise<void>;
  placeOrderItem: (cartId: string) => Promise<void>;
  placeOrders: () => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  clearCart: (userId: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const role = getRole();

  useEffect(() => {
    if (role !== "User") return;

    const fetch = async () => {
      try {
        const res = await api.get("/cart-items");
        const raw = res.data.cartItems;

        const next: CartItem[] = raw.map((x: any) => ({
          cartId: x.cartId,
          userId: x.userId,
          prodId: x.productId,
          prodName: x.prodName ?? "",
          prodDescription: x.prodDescription ?? "",
          price: Number(x.price ?? 0),
          quantity: Number(x.quantity ?? 0),
          total_quantity: Number(x.total_quantity ?? 0),
        }));
        setItems(next);
      } catch {
        setItems([]);
      }
    };
    fetch();
    const interval = setInterval(fetch, 50000);
    return () => clearInterval(interval);
  }, [role]);

  const addToCart = useCallback(
    async ({ product, quantity = 1 }: { product: Product, quantity?: number }) => {
      const claims = decodeToken();
      if (!claims?.userId || !claims?.email) {
        throw new Error("Missing user identity in token");
      }

      const payload = {
        userId: claims.userId,
        productId: product.productId,
        quantity,
      };

      const res = await api.post("/cart/add", payload);

      const cart = res.data?.cart;

      setItems((curr) => {
        const idx = curr.findIndex((x) => x.cartId === cart.cartId);
        const mapped: CartItem = {
          cartId: cart.cartId,
          userId: cart.userId,
          prodId: cart.productId,
          prodName: cart.prodName ?? "",
          prodDescription: cart.prodDescription ?? "",
          price: Number(cart.price ?? 0),
          quantity: Number(cart.quantity ?? 0),
          total_quantity: Number(cart.total_quantity ?? 0),
        };

        if (idx >= 0) {
          const next = [...curr];
          next[idx] = mapped;
          return next;
        }
        return [mapped, ...curr];
      });
    },
    [],
  );

  const placeOrders = useCallback(async () => {
    const claims = decodeToken();
    const userId = claims?.userId;
    if (!userId) throw new Error("Missing user identity in token");

    const payload = {
      orderedBy: userId,
      items: items.map((it) => ({
        productId: it.prodId,
        quantity: it.quantity,
      })),
    };

    const orderedIds = new Set(payload.items.map((i) => i.productId));
    setItems((curr) => curr.filter((it) => !orderedIds.has(it.prodId)));

    try {
      await api.post(`/orders/place`, payload);

      await api.delete(`/all-cart-item/${userId}`);

      const updatedCart = await api.get(`/cart-items`);

      const raw = updatedCart.data?.cartItems ?? [];
      const next = raw.map((x: any) => ({
        ...x,
        quantity: x.quantity,
      }));

      setItems(next);
    } catch { }
  }, [items]);

  const placeOrderItem = useCallback(
    async (cartId: string) => {
      const claims = decodeToken();
      const userId = claims?.userId;
      if (!userId) throw new Error("Missing user identity in token");

      const item = items.find((x) => x.cartId === cartId);
      if (!item) throw new Error("Cart item not found");

      const payload = {
        orderedBy: userId,
        items: [
          {
            productId: item.prodId,
            quantity: item.quantity,
          },
        ],
      };

      const prev = items;
      setItems((curr) => curr.filter((x) => x.cartId !== cartId));

      try {
        await api.post(`/orders/place`, payload);

        await api.delete(`/cart-item/${cartId}`);

        const updatedCart = await api.get(`/cart-items`);

        const raw = updatedCart.data?.cartItems ?? [];
        const next = raw.map((x: any) => ({
          ...x,
          quantity: x.quantity,
        }));

        setItems(next);
      } catch (err) {
        setItems(prev);
        throw err;
      }
    },
    [items],
  );

  const saveQuantity = useCallback(
    async (cartId: string, userId: number, newQty: number) => {
      const item = items.find((it) => it.cartId === cartId);
      if (!item) return;

      const max = Number(item.total_quantity ?? Infinity);

      if (newQty > max) {
        toast.error(`Only ${max} item${max === 1 ? "" : "s"} in stock.`);
        return;
      }

      if (newQty < 0) newQty = 0;

      setItems((curr) => {
        if (newQty <= 0) return curr.filter((it) => it.cartId !== cartId);
        return curr.map((it) =>
          it.cartId === cartId ? { ...it, quantity: newQty } : it,
        );
      });

      try {
        if (newQty <= 0) {
          await api.delete(`/cart-item/${cartId}`);
        } else {
          await api.patch(`/cart/edit/${cartId}/${userId}`, { quantity: newQty });
        }
      } catch (err) {
        setItems(items);
        throw err;
      }
    },
    [items],
  );

  const increment = useCallback(
    async (cartId: string) => {
      const item = items.find((it) => it.cartId === cartId);
      if (!item) return;

      const claims = decodeToken();
      const userId = claims?.userId;
      if (!userId) throw new Error("Missing user identity in token");

      const max = Number(item.total_quantity ?? Infinity);
      const next = item.quantity + 1;

      if (next > max) {
        toast.error(`Only ${max} item${max === 1 ? "" : "s"} in stock.`);
        return;
      }

      await saveQuantity(cartId, userId, next);
    },
    [items, saveQuantity],
  );

  const decrement = useCallback(
    async (cartId: string) => {
      const item = items.find((it) => it.cartId === cartId);
      if (!item) return;

      const claims = decodeToken();
      const userId = claims?.userId;
      if (!userId) throw new Error("Missing user identity in token");

      await saveQuantity(cartId, userId, item.quantity - 1);
    },
    [items, saveQuantity],
  );

  const removeFromCart = useCallback(async (cartId: string) => {
    const res = await api.delete(`/cart-item/${cartId}`);

    const deletedId = res.data.deletedID;
    if (deletedId) {
      setItems((prev) => prev.filter((it) => it.cartId !== deletedId));
      return;
    }
  }, []);

  const clearCart = async (userId: number) => {
    const res = await api.delete(`/all-cart-item/${userId}`);
    const userID = res.data.userID;
    if (userID) {
      setItems((prev) => prev.filter((it) => it.userId !== userID));
      return;
    }
  };

  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  const total = items.reduce(
    (sum, it) => sum + Number(it.price) * it.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        increment,
        decrement,
        addToCart,
        placeOrders,
        placeOrderItem,
        removeFromCart,
        clearCart,
        saveQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
