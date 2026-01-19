
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Product } from "../types/product";

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: { id: string | number } }
  | { type: "INCREMENT"; payload: { id: string | number } }
  | { type: "DECREMENT"; payload: { id: string | number } }
  | { type: "CLEAR" }
  | { type: "SET"; payload: CartState }; // for hydration from storage

type CartContextValue = {
  items: CartItem[];
  count: number;      // total quantity (sum)
  total: number;      // sum of price * qty
  addToCart: (p: Product) => void;
  removeFromCart: (id: string | number) => void;
  increment: (id: string | number) => void;
  decrement: (id: string | number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Helper to normalize a product ID key (you used productId/id/sku interchangeably)
function getId(p: any): string | number {
  return p?.productId; // last-resort fallback
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const id = getId(action.payload);
      const idx = state.items.findIndex(it => getId(it) === id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
        return { items };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "INCREMENT": {
      const items = state.items.map(it =>
        getId(it) === action.payload.id ? { ...it, quantity: it.quantity + 1 } : it
      );
      return { items };
    }
    case "DECREMENT": {
      const items = state.items
        .map(it =>
          getId(it) === action.payload.id ? { ...it, quantity: it.quantity - 1 } : it
        )
        .filter(it => it.quantity > 0);
      return { items };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter(it => getId(it) !== action.payload.id);
      return { items };
    }
    case "CLEAR":
      return { items: [] };
    case "SET":
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_KEY = "myshop_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.items)) {
          dispatch({ type: "SET", payload: parsed });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value: CartContextValue = useMemo(() => {
    const count = state.items.reduce((sum, it) => sum + it.quantity, 0);
    const total = state.items.reduce(
      (sum, it) => sum + Number(it.price ?? 0) * it.quantity,
      0
    );

    return {
      items: state.items,
      count,
      total,
      addToCart: (p: Product) => dispatch({ type: "ADD_ITEM", payload: p }),
      removeFromCart: (id: string | number) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
      increment: (id: string | number) => dispatch({ type: "INCREMENT", payload: { id } }),
      decrement: (id: string | number) => dispatch({ type: "DECREMENT", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}