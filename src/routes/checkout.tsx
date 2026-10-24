import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { field } from "@/components/ProductCard";
import { CITIES } from "@/lib/delivery";
import { inr } from "@/lib/products";
import { seo } from "@/lib/seo";
import { DELIVERY_FEE, useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Demo checkout", "A demonstration checkout. No payment is taken and no order is placed."),
  component: Checkout,
});

const SAMPLE = { name: "Aarav Sharma", phone: "98765 43210", email: "aarav.demo@example.com", recipient: "Ananya", address: "Room 214, Girls' Hostel B, Koramangala", city: "Bengaluru", pin: "560034" };

function Checkout() {
  const { cart, subtotal, clear } = useStore();
  const [f, setF] = useState(SAMPLE);
  const [err, setErr] = useState<string>();
  const [order, setOrder] = useState<{ id: string; total: number }>();

  if (order)
    return (
      <div className="bg-blush">
        <div className="animate-reveal mx-auto max-w-xl px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto size-14 text-primary" />
          <p className="eyebrow mt-6">Demo order confirmed</p>
          <h1 className="mt-3 text-5xl">Your feeling is all wrapped up.</h1>
          <p className="mt-6 rounded-2xl bg-card p-5 text-sm">Demo order ID <b className="font-mono">{order.id}</b> · {inr(order.total)}</p>
          <p className="mt-6 text-muted-foreground">This is a prototype. No real purchase was made, no payment was taken and nothing will be delivered.</p>
          <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground">Back to home</Link>
        </div>
      </div>
    );

  if (!cart.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">Nothing to check out yet</h1>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Shop gifts</Link>
      </div>
    );

  const total = subtotal + DELIVERY_FEE;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(f.pin.trim())) return setErr("Please enter a 6-digit PIN code.");
    if (!f.name.trim() || !f.address.trim()) return setErr("Please fill in your name and address.");
    setOrder({ id: `MOM-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, total });
    clear();
  };
  const In = ({ k, label, type = "text" }: { k: keyof typeof SAMPLE; label: string; type?: string }) => (
    <label className="block text-sm font-medium">{label}<input type={type} className={`${field} mt-1.5`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold tracking-widest text-primary-foreground">DEMO CHECKOUT</span>
      <h1 className="mt-4 text-4xl">Almost there</h1>
      <p className="mt-2 text-muted-foreground">Sample details are pre-filled. No card details are collected and no payment is processed.</p>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 rounded-2xl bg-card p-6 sm:grid-cols-2">
          {In({ k: "name", label: "Your name" })}
          {In({ k: "phone", label: "Phone", type: "tel" })}
          {In({ k: "email", label: "Email", type: "email" })}
          {In({ k: "recipient", label: "Recipient's name" })}
          <div className="sm:col-span-2">{In({ k: "address", label: "Delivery address" })}</div>
          <label className="block text-sm font-medium">City
            <select className={`${field} mt-1.5`} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}</select>
          </label>
          {In({ k: "pin", label: "PIN code" })}
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground sm:col-span-2">Payment: <b>Demo mode</b> — nothing will be charged.</div>
          {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
        </div>
        <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Demo delivery fee</dt><dd>{inr(DELIVERY_FEE)}</dd></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
          <button className="mt-6 h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground">Confirm demo order</button>
        </aside>
      </form>
    </div>
  );
}
