import { createFileRoute } from "@tanstack/react-router";
import { hmacSha256Hex, safeEqual } from "@/lib/razorpay.server";

export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Webhook not configured", { status: 503 });
        const raw = await request.text();
        const sig = request.headers.get("x-razorpay-signature") ?? "";
        if (!sig || !safeEqual(await hmacSha256Hex(secret, raw), sig)) return new Response("Invalid signature", { status: 401 });

        let evt: any;
        try { evt = JSON.parse(raw); } catch { return new Response("Bad payload", { status: 400 }); }
        const eventId = request.headers.get("x-razorpay-event-id") ?? `${evt.event}:${evt.payload?.payment?.entity?.id ?? evt.created_at}`;
        const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");

        const { error: dup } = await db.from("webhook_events").insert({ event_id: eventId.slice(0, 200), event_type: String(evt.event).slice(0, 60) });
        if (dup) return new Response("Already processed", { status: 200 });

        const pay = evt.payload?.payment?.entity;
        const orderId: string | undefined = pay?.order_id ?? evt.payload?.order?.entity?.id;
        if (!orderId) return new Response("ok");
        const now = new Date().toISOString();
        if (evt.event === "payment.captured" || evt.event === "order.paid") {
          const { data: o } = await db.from("orders").select("id, total_paise").eq("gateway_order_id", orderId).maybeSingle();
          if (o && (!pay || pay.amount === o.total_paise))
            await db.from("orders").update({ payment_status: "paid", order_status: "paid", gateway_payment_id: pay?.id ?? null, paid_at: now, updated_at: now }).eq("id", o.id).neq("payment_status", "paid");
        } else if (evt.event === "payment.failed") {
          await db.from("orders").update({ payment_status: "failed", order_status: "payment_failed", updated_at: now }).eq("gateway_order_id", orderId).eq("payment_status", "pending");
        }
        return new Response("ok");
      },
    },
  },
});
