import { getProduct } from "./products";

/** Demo delivery fee in rupees. Single source for cart, checkout and server-side totals. */
export const DELIVERY_FEE = 49;

/** Whether customers may choose Cash on Delivery. Flip to false to hide it everywhere (also enforced server-side). */
export const COD_ENABLED = true;

export const toPaise = (rupees: number) => Math.round(rupees * 100);

export type PriceLineInput = { productId: string; qty: number };

/** Recalculates a cart from catalogue prices only — never from browser-supplied amounts. */
export function priceCart(items: PriceLineInput[]) {
  if (!items.length) throw new Error("Your cart is empty.");
  const lines = items.map((i) => {
    const p = getProduct(i.productId);
    if (!p) throw new Error(`Unknown product: ${i.productId}`);
    if (!Number.isInteger(i.qty) || i.qty < 1 || i.qty > 10) throw new Error("Quantity must be between 1 and 10.");
    return { productId: p.id, name: p.name, unitPaise: toPaise(p.price), qty: i.qty };
  });
  const subtotalPaise = lines.reduce((s, l) => s + l.unitPaise * l.qty, 0);
  const deliveryPaise = toPaise(DELIVERY_FEE);
  return { lines, subtotalPaise, deliveryPaise, totalPaise: subtotalPaise + deliveryPaise };
}
