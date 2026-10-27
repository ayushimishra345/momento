import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getProduct } from "./products";
import type { Personalisation } from "./personalisation";

export type { Personalisation } from "./personalisation";
export type CartItem = { key: string; productId: string; qty: number; personalisation?: Personalisation };

export const DELIVERY_FEE = 49;

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

export const clampQuantity = (qty: number) => Number.isFinite(qty) ? Math.max(1, Math.min(10, Math.floor(qty))) : 1;
export function restoreCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const keys = new Set<string>();
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || typeof item.productId !== "string" || !getProduct(item.productId) || typeof item.key !== "string" || typeof item.qty !== "number") return [];
    const key = keys.has(item.key) ? crypto.randomUUID() : item.key;
    keys.add(key);
    const raw = item.personalisation;
    const personalisation: Personalisation | undefined = raw && typeof raw === "object" ? Object.fromEntries(Object.entries(raw).filter(([k, v]) => ["recipient", "note", "memory", "style", "photoName", "photoDataUrl"].includes(k) && typeof v === "string")) : undefined;
    return [{ key, productId: item.productId, qty: clampQuantity(item.qty), personalisation }];
  });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWish] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(restoreCart(JSON.parse(localStorage.getItem(CART) || "[]")));
    } catch {}
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(WISH) || "[]");
      setWish(Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === "string" && Boolean(getProduct(id))))] : []);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(CART, JSON.stringify(cart)); }
    catch { toast.error("Your cart works for this visit, but this browser couldn't save it for refresh.", { id: "cart-storage" }); }
  }, [cart, ready]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(WISH, JSON.stringify(wishlist)); }
    catch { toast.error("Your wishlist works for this visit, but this browser couldn't save it for refresh.", { id: "wish-storage" }); }
  }, [wishlist, ready]);

  const add: Store["add"] = (productId, personalisation) => {
    const p = getProduct(productId);
    if (!p) return;
    const key = `${productId}-${crypto.randomUUID()}`;
    setCart((c) => {
      if (!personalisation) {
        const ex = c.find((i) => i.productId === productId && !i.personalisation);
        if (ex) return c.map((i) => (i === ex ? { ...i, qty: clampQuantity(i.qty + 1) } : i));
      }
      return [...c, { key, productId, qty: 1, personalisation }];
    });
    toast.success(`${p?.name ?? "Gift"} added to your cart`);
  };

  const subtotal = cart.reduce((s, i) => s + (getProduct(i.productId)?.price ?? 0) * i.qty, 0);
  const value: Store = {
    cart, wishlist, add, subtotal,
    count: cart.reduce((s, i) => s + i.qty, 0),
    setQty: (key, qty) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: clampQuantity(qty) } : i))),
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
