import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getProduct } from "./products";

export type Personalisation = { recipient?: string; note?: string; memory?: string; style?: string; photoName?: string };
export type CartItem = { key: string; productId: string; qty: number; personalisation?: Personalisation };

export { DELIVERY_FEE } from "./pricing";

type Store = {
  cart: CartItem[];
  wishlist: string[];
  add: (productId: string, personalisation?: Personalisation) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  updatePersonalisation: (key: string, p: Personalisation) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<Store | null>(null);
const CART = "momento-demo-cart";
const WISH = "momento-demo-wishlist";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWish] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem(CART) || "[]"));
      setWish(JSON.parse(localStorage.getItem(WISH) || "[]"));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(CART, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem(WISH, JSON.stringify(wishlist)); }, [wishlist, ready]);

  const add: Store["add"] = (productId, personalisation) => {
    const p = getProduct(productId);
    setCart((c) => {
      if (!personalisation) {
        const ex = c.find((i) => i.productId === productId && !i.personalisation);
        if (ex) return c.map((i) => (i === ex ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...c, { key: `${productId}-${Date.now()}`, productId, qty: 1, personalisation }];
    });
    toast.success(`${p?.name ?? "Gift"} added to your cart`);
  };

  const subtotal = cart.reduce((s, i) => s + (getProduct(i.productId)?.price ?? 0) * i.qty, 0);
  const value: Store = {
    cart, wishlist, add, subtotal,
    count: cart.reduce((s, i) => s + i.qty, 0),
    setQty: (key, qty) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i))),
    remove: (key) => setCart((c) => c.filter((i) => i.key !== key)),
    updatePersonalisation: (key, p) => setCart((c) => c.map((i) => (i.key === key ? { ...i, personalisation: p } : i))),
    clear: () => setCart([]),
    toggleWish: (id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
