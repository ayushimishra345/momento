import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { getOrderStatus } from "@/lib/payments.functions";
import { inr } from "@/lib/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/order/$reference")({
  head: () => seo("Your order", "Momento order status and reference."),
  component: OrderPage,
});

function OrderPage() {
  const { reference } = Route.useParams();
  const fn = useServerFn(getOrderStatus);
  const { data: o, isLoading } = useQuery({ queryKey: ["order", reference], queryFn: () => fn({ data: { reference } }), retry: false });

  if (isLoading) return <p className="py-24 text-center text-muted-foreground">Checking your order…</p>;
  if (!o) return <div className="py-24 text-center"><h1 className="text-4xl">Order not found</h1><Link to="/shop" className="mt-6 inline-block font-semibold text-primary underline">Back to shop</Link></div>;

  const paid = o.payment_status === "paid";
  const cod = o.payment_method === "cod";
  const failed = o.payment_status === "failed";
  const Icon = paid || cod ? CheckCircle2 : failed ? XCircle : Clock;
  return (
    <div className="bg-blush">
      <div className="animate-reveal mx-auto max-w-xl px-4 py-20 text-center">
        <Icon className="mx-auto size-14 text-primary" />
        {o.test_mode && <p className="mt-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-widest text-primary-foreground">TEST ORDER — NOT A REAL PURCHASE</p>}
        <h1 className="mt-4 text-5xl">{paid ? "Payment received. Your feeling is on its way." : cod ? "Order placed — pay on delivery." : failed ? "Payment didn't go through." : "Waiting for payment confirmation…"}</h1>
        <p className="mt-6 rounded-2xl bg-card p-5 text-sm">Order <b className="font-mono">{o.reference}</b> · {inr(o.total_paise / 100)} · {cod ? "Cash on Delivery (unpaid)" : paid ? "Paid online" : failed ? "Payment failed" : "Payment pending"}</p>
        <p className="mt-6 text-muted-foreground">{cod ? "Nothing has been charged. You'll pay when the gift is delivered." : failed ? "You weren't charged. Head back to your cart to try again." : paid ? "Keep this reference for any questions." : "This page updates once Razorpay confirms your payment — refresh in a moment."}</p>
        <Link to={failed ? "/cart" : "/"} className="mt-8 inline-block rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground">{failed ? "Back to cart" : "Back to home"}</Link>
      </div>
    </div>
  );
}
