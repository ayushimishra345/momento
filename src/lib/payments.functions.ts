import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COD_ENABLED, priceCart } from "./pricing";
import { createRazorpayOrder, fetchRazorpayPayment, newReference, razorpayCreds, verifyCheckoutSignature } from "./razorpay.server";

const admin = async () => (await import("@/integrations/supabase/client.server")).supabaseAdmin;

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const c = razorpayCreds();
  return { onlineConfigured: !!c, testMode: c ? c.testMode : true, keyId: c?.keyId ?? null, codEnabled: COD_ENABLED };
});

const Checkout = z.object({
  method: z.enum(["online", "cod"]),
  customer: z.object({
    name: z.string().trim().min(1).max(80),
    phone: z.string().trim().refine((v) => /^[\d\s+-]{10,15}$/.test(v) && v.replace(/\D/g, "").length >= 10, "Invalid phone"),
    email: z.string().trim().email().max(120),
    recipient: z.string().trim().max(60).optional().default(""),
    address: z.string().trim().min(1).max(300),
    city: z.string().trim().min(1).max(60),
    pin: z.string().trim().regex(/^\d{6}$/),
  }),
  items: z.array(z.object({
    productId: z.string().max(60),
    qty: z.number().int().min(1).max(10),
    personalisation: z.object({ recipient: z.string().max(40), note: z.string().max(240), memory: z.string().max(300), style: z.string().max(30) }).partial().optional(),
  })).min(1).max(30),
});

export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Checkout.parse(d))
  .handler(async ({ data }) => {
    if (data.method === "cod" && !COD_ENABLED) throw new Error("Cash on Delivery is not available.");
    const creds = razorpayCreds();
    if (data.method === "online" && !creds) throw new Error("Online payment is not set up yet.");
    const priced = priceCart(data.items);
    const reference = newReference();
    const db = await admin();
    const c = data.customer;
    const { data: order, error } = await db.from("orders").insert({
      reference, customer_name: c.name, customer_phone: c.phone, customer_email: c.email, recipient_name: c.recipient || null,
      address: c.address, city: c.city, pin: c.pin,
      subtotal_paise: priced.subtotalPaise, delivery_paise: priced.deliveryPaise, total_paise: priced.totalPaise,
      payment_method: data.method, payment_status: data.method === "cod" ? "unpaid" : "pending", order_status: "pending",
      test_mode: creds ? creds.testMode : true,
    }).select("id").single();
    if (error || !order) { console.error(error); throw new Error("Could not create your order. Please try again."); }
    const { error: e2 } = await db.from("order_items").insert(priced.lines.map((l, i) => ({
      order_id: order.id, product_id: l.productId, product_name: l.name, unit_paise: l.unitPaise, qty: l.qty,
      personalisation: data.items[i].personalisation ?? null,
    })));
    if (e2) { console.error(e2); throw new Error("Could not save your order items."); }
    if (data.method === "cod") return { reference, method: "cod" as const, amount: priced.totalPaise };

    const rz = await createRazorpayOrder(creds!, priced.totalPaise, reference);
    await db.from("orders").update({ gateway_order_id: rz.id, updated_at: new Date().toISOString() }).eq("id", order.id);
    return { reference, method: "online" as const, amount: priced.totalPaise, razorpayOrderId: rz.id, keyId: creds!.keyId, testMode: creds!.testMode };
  });

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ reference: z.string().max(20), razorpay_order_id: z.string().max(60), razorpay_payment_id: z.string().max(60), razorpay_signature: z.string().max(128) }).parse(d))
  .handler(async ({ data }) => {
    const creds = razorpayCreds();
    if (!creds) throw new Error("Online payment is not set up.");
    const db = await admin();
    const { data: o } = await db.from("orders").select("id, gateway_order_id, total_paise, payment_status").eq("reference", data.reference).maybeSingle();
    if (!o || o.gateway_order_id !== data.razorpay_order_id) return { ok: false as const, reason: "Order mismatch." };
    if (o.payment_status === "paid") return { ok: true as const };
    const valid = await verifyCheckoutSignature(creds.keySecret, data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature);
    if (!valid) return { ok: false as const, reason: "Payment signature could not be verified." };
    const pay = await fetchRazorpayPayment(creds, data.razorpay_payment_id);
    if (pay.order_id !== o.gateway_order_id || pay.amount !== o.total_paise || !["captured", "authorized"].includes(pay.status))
      return { ok: false as const, reason: "Payment was not completed." };
    await db.from("orders").update({ payment_status: "paid", order_status: "paid", gateway_payment_id: pay.id, paid_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", o.id).neq("payment_status", "paid");
    return { ok: true as const };
  });

export const reportPaymentFailure = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ reference: z.string().max(20), razorpay_order_id: z.string().max(60) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    await db.from("orders").update({ payment_status: "failed", order_status: "payment_failed", updated_at: new Date().toISOString() })
      .eq("reference", data.reference).eq("gateway_order_id", data.razorpay_order_id).eq("payment_status", "pending");
    return { ok: true };
  });

/** Minimal, non-sensitive status for the confirmation page. References are long random codes. */
export const getOrderStatus = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ reference: z.string().regex(/^MOM-[A-Z0-9]{10}$/) }).parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: o } = await db.from("orders").select("reference, total_paise, payment_method, payment_status, order_status, test_mode, created_at").eq("reference", data.reference).maybeSingle();
    return o ?? null;
  });
