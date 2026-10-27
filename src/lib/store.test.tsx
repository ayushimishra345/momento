import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clampQuantity, DELIVERY_FEE, restoreCart, StoreProvider, useStore } from "./store";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
function Probe() {
  const store = useStore();
  return <><output data-testid="state">{JSON.stringify({ cart: store.cart, subtotal: store.subtotal, total: store.cart.length ? store.subtotal + DELIVERY_FEE : 0 })}</output>
    <button onClick={() => { for (let i = 0; i < 12; i++) store.add("kind-day-mug"); }}>Repeat add</button>
    <button onClick={() => { store.add("letter-in-wax", { recipient: "Riya" }); store.add("letter-in-wax", { recipient: "Kabir" }); }}>Two versions</button>
    <button onClick={() => store.remove(store.cart[0]?.key ?? "")}>Remove first</button>
  </>;
}
const state = () => JSON.parse(screen.getByTestId("state").textContent ?? "{}");
beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("cart regression checks", () => {
  it("bounds quantities from 1 to 10", () => {
    expect(clampQuantity(0)).toBe(1); expect(clampQuantity(12)).toBe(10); expect(clampQuantity(NaN)).toBe(1);
  });
  it("applies the same quantity cap to repeated Add to cart", () => {
    render(<StoreProvider><Probe /></StoreProvider>);
    act(() => screen.getByText("Repeat add").click());
    expect(state().cart[0].qty).toBe(10);
    expect(state().subtotal).toBe(2490);
    expect(state().total).toBe(2539);
  });
  it("keeps simultaneous personalised versions separately editable and removable", () => {
    vi.spyOn(Date, "now").mockReturnValue(1);
    render(<StoreProvider><Probe /></StoreProvider>);
    act(() => screen.getByText("Two versions").click());
    expect(new Set(state().cart.map((i: { key: string }) => i.key)).size).toBe(2);
    act(() => screen.getByText("Remove first").click());
    expect(state().cart[0].personalisation.recipient).toBe("Kabir");
    expect(state().subtotal).toBe(349); expect(state().total).toBe(398);
  });
  it("ignores malformed saved cart shapes and unknown products", () => {
    expect(restoreCart({})).toEqual([]);
    expect(restoreCart([{ key: "x", productId: "missing", qty: 1 }])).toEqual([]);
  });
  it("retains saved photo data when restoring a cart", () => {
    const cart = [{ key: "x", productId: "polaroid-five", qty: 2, personalisation: { photoDataUrl: "data:image/jpeg;base64,abc", photoName: "photo.jpg" } }];
    expect(restoreCart(cart)).toEqual(cart);
  });
  it("continues shopping when browser storage writes fail", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
    render(<StoreProvider><Probe /></StoreProvider>);
    act(() => screen.getByText("Repeat add").click());
    expect(state().cart[0].qty).toBe(10);
  });
});