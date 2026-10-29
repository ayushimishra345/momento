// Server-only Razorpay helpers. Uses Web Crypto so it runs on the edge worker.
const enc = new TextEncoder();

export async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Official check: HMAC_SHA256(order_id + "|" + payment_id, key_secret) === razorpay_signature */
export async function verifyCheckoutSignature(secret: string, orderId: string, paymentId: string, signature: string) {
  return safeEqual(await hmacSha256Hex(secret, `${orderId}|${paymentId}`), signature);
}

export function razorpayCreds() {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) return null;
  return { keyId, keySecret, testMode: keyId.startsWith("rzp_test_") };
}

async function rzp(path: string, init: RequestInit, c: { keyId: string; keySecret: string }) {
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: { "content-type": "application/json", authorization: `Basic ${btoa(`${c.keyId}:${c.keySecret}`)}` },
  });
  const body = (await res.json()) as any;
  if (!res.ok) {
    console.error("Razorpay error", res.status, body?.error?.description);
    throw new Error("The payment gateway could not process this request. Please try again.");
  }
  return body;
}

export const createRazorpayOrder = (c: { keyId: string; keySecret: string }, amountPaise: number, receipt: string) =>
  rzp("/orders", { method: "POST", body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt }) }, c) as Promise<{ id: string; amount: number; status: string }>;

export const fetchRazorpayPayment = (c: { keyId: string; keySecret: string }, paymentId: string) =>
  rzp(`/payments/${encodeURIComponent(paymentId)}`, { method: "GET" }, c) as Promise<{ id: string; order_id: string; status: string; amount: number; method: string }>;

export function newReference() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const b = crypto.getRandomValues(new Uint8Array(10));
  return "MOM-" + [...b].map((x) => a[x % a.length]).join("");
}
