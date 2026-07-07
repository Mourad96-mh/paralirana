"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";
import type { Product } from "./products";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
};

type State = { items: CartItem[] };

type Action =
  | { type: "add"; product: Product; qty?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((i) => i.id === action.product.id);
      const qty = action.qty ?? 1;
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: action.product.id,
            slug: action.product.slug,
            name: action.product.name,
            brand: action.product.brand,
            price: action.product.price,
            qty,
          },
        ],
      };
    }
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "setQty":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      };
    case "clear":
      return { items: [] };
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "paralirana-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", state: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<CartContextType>(() => {
    const count = state.items.reduce((n, i) => n + i.qty, 0);
    const total = state.items.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      items: state.items,
      count,
      total,
      add: (product, qty) => dispatch({ type: "add", product, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
