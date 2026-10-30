import { describe, expect, it } from "vitest";
import { priceCart, toPaise } from "./pricing";
import { hmacSha256Hex, verifyCheckoutSignature } from "./razorpay.server";

describe("pricing", () => {
  it("converts rupees to paise", () => { expect(toPaise(647)).toBe(64700); expect(toPaise(1499)).toBe(149900); });
  it("recalculates totals from catalogue prices plus ₹49 delivery", () => {
    const r = priceCart([{ productId: "pocket-of-sunshine", qty: 2 }]);
    expect(r.subtotalPaise).toBe(29800);
    expect(r.totalPaise).toBe(34700);
  });
  it("rejects unknown products and bad quantities", () => {
    expect(() => priceCart([{ productId: "fake", qty: 1 }])).toThrow();
    expect(() => priceCart([{ productId: "pocket-of-sunshine", qty: 11 }])).toThrow();
    expect(() => priceCart([])).toThrow();
  });
});

describe("razorpay signature", () => {
  it("accepts a correct signature and rejects a tampered one", async () => {
    const good = await hmacSha256Hex("secret", "order_1|pay_1");
    expect(await verifyCheckoutSignature("secret", "order_1", "pay_1", good)).toBe(true);
    expect(await verifyCheckoutSignature("secret", "order_1", "pay_2", good)).toBe(false);
  });
});
