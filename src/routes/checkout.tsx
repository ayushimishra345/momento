import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Banknote, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import { field } from "@/components/ProductCard";
import { CITIES } from "@/lib/delivery";
import { getPaymentConfig, reportPaymentFailure, startCheckout, verifyPayment } from "@/lib/payments.functions";
import { getProduct, inr } from "@/lib/products";
import { seo } from "@/lib/seo";
import { DELIVERY_FEE, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Pay securely with Razorpay (test mode) or choose Cash on Delivery for your Momento gift."),
  component: Checkout,
});

const EMPTY = { name: "", phone: "", email: "", recipient: "", address: "", city: "Bengaluru", pin: "" };

declare global { interface Window { Razorpay?: any } }
const loadRazorpay = () => new Promise<boolean>((res) => {
  if (window.Razorpay) return res(true);
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.onload = () => res(true); s.onerror = () => res(false);
  document.body.appendChild(s);
});

function Checkout() {
  const { cart, subtotal, clear } = useStore();
  const nav = useNavigate();
  const cfgFn = useServerFn(getPaymentConfig);
  const startFn = useServerFn(startCheckout);
  const verifyFn = useServerFn(verifyPayment);
  const failFn = useServerFn(reportPaymentFailure);
  const { data: cfg } = useQuery({ queryKey: ["payment-config"], queryFn: () => cfgFn() });
  const [f, setF] = useState(EMPTY);
  const [method, setMethod] = useState<"online" | "cod">("online");
  const [err, setErr] = useState<string>();
  const [busy, setBusy] = useState<string>();

  if (!cart.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">Nothing to check out yet</h1>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Shop gifts</Link>
      </div>
    );

  const total = subtotal + DELIVERY_FEE;
  const onlineReady = !!cfg?.onlineConfigured;

  const validate = () => {
    if (!f.name.trim()) return "Please enter your name.";
    if (!/^[\d\s+-]{10,15}$/.test(f.phone.trim()) || f.phone.replace(/\D/g, "").length < 10) return "Please enter a valid 10-digit phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Please enter a valid email address.";
    if (!f.address.trim()) return "Please enter the delivery address.";
    if (!/^\d{6}$/.test(f.pin.trim())) return "Please enter a 6-digit PIN code.";
    if (method === "online" && !onlineReady) return "Online payment isn't set up yet. Choose Cash on Delivery.";
    if (method === "cod" && !cfg?.codEnabled) return "Cash on Delivery isn't available.";
    return undefined;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(); if (v) return setErr(v);
    setErr(undefined); setBusy("Creating your order…");
    try {
      const r = await startFn({ data: {
        method, customer: f,
        items: cart.map((i) => ({ productId: i.productId, qty: i.qty, personalisation: i.personalisation ? { recipient: i.personalisation.recipient, note: i.personalisation.note, memory: i.personalisation.memory, style: i.personalisation.style } : undefined })),
      } });
      if (r.method === "cod") { clear(); return nav({ to: "/order/$reference", params: { reference: r.reference } }); }
      setBusy("Opening secure payment…");
      if (!(await loadRazorpay())) throw new Error("Couldn't load the payment window. Check your connection and try again.");
      const rzp = new window.Razorpay({
        key: r.keyId, amount: r.amount, currency: "INR", order_id: r.razorpayOrderId,
        name: "Momento", description: `Order ${r.reference}${r.testMode ? " (test mode)" : ""}`,
        prefill: { name: f.name, email: f.email, contact: f.phone.replace(/\D/g, "") },
        theme: { color: "#6e2440" },
        handler: async (resp: any) => {
          setBusy("Confirming your payment…");
          const ok = await verifyFn({ data: { reference: r.reference, ...resp } });
          if (ok.ok) { clear(); nav({ to: "/order/$reference", params: { reference: r.reference } }); }
          else { setBusy(undefined); setErr(`${ok.reason} You have not been charged twice — please try again.`); }
        },
        modal: { ondismiss: () => { setBusy(undefined); setErr("Payment cancelled. Your cart is saved — you can try again."); } },
      });
      rzp.on("payment.failed", async (resp: any) => {
        await failFn({ data: { reference: r.reference, razorpay_order_id: r.razorpayOrderId } });
        setBusy(undefined); setErr(`Payment failed: ${resp?.error?.description ?? "please try another method"}. You can retry.`);
      });
      rzp.open();
    } catch (x: any) { setBusy(undefined); setErr(x?.message ?? "Something went wrong. Please try again."); }
  };

  const In = ({ k, label, type = "text", ac }: { k: keyof typeof EMPTY; label: string; type?: string; ac?: string }) => (
    <label className="block text-sm font-medium">{label}<input type={type} autoComplete={ac} className={`${field} mt-1.5`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>
  );
  const Opt = ({ id, icon: Icon, title, sub, disabled }: { id: "online" | "cod"; icon: any; title: string; sub: string; disabled?: boolean }) => (
    <label className={cn("flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition", method === id ? "border-primary bg-secondary/40" : "border-border", disabled && "cursor-not-allowed opacity-60")}>
      <input type="radio" name="method" className="mt-1 accent-[var(--primary)]" checked={method === id} disabled={disabled} onChange={() => setMethod(id)} />
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
      <span><span className="block font-semibold">{title}</span><span className="block text-sm text-muted-foreground">{sub}</span></span>
    </label>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {cfg && <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold tracking-widest text-primary-foreground">{!onlineReady ? "ONLINE PAYMENT NOT SET UP" : cfg.testMode ? "RAZORPAY TEST MODE" : "SECURE CHECKOUT"}</span>}
      <h1 className="mt-4 text-4xl">Almost there</h1>
      <p className="mt-2 text-muted-foreground">{cfg?.testMode ? "Test mode: use Razorpay test details — no real money moves and test orders are not real purchases." : "Your payment is handled by Razorpay. Momento never sees your card or UPI details."}</p>
      <form noValidate onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="grid gap-4 rounded-2xl bg-card p-6 sm:grid-cols-2">
            {In({ k: "name", label: "Your name", ac: "name" })}
            {In({ k: "phone", label: "Phone", type: "tel", ac: "tel" })}
            {In({ k: "email", label: "Email", type: "email", ac: "email" })}
            {In({ k: "recipient", label: "Recipient's name (optional)" })}
            <div className="sm:col-span-2">{In({ k: "address", label: "Delivery address", ac: "street-address" })}</div>
            <label className="block text-sm font-medium">City
              <select className={`${field} mt-1.5`} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })}>{Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}</select>
            </label>
            {In({ k: "pin", label: "PIN code", ac: "postal-code" })}
          </div>
          <fieldset className="rounded-2xl bg-card p-6">
            <legend className="sr-only">Payment method</legend>
            <p className="eyebrow mb-4">Payment method</p>
            <div className="grid gap-3">
              <Opt id="online" icon={Smartphone} title="Pay online — UPI, cards, net banking, wallets" disabled={!onlineReady}
                sub={onlineReady ? "Choose in the secure Razorpay window. Only methods enabled on our Razorpay account will appear." : "Not set up yet — the store owner needs to add Razorpay keys."} />
              {cfg?.codEnabled && <Opt id="cod" icon={Banknote} title="Cash on Delivery" sub="Pay when your gift arrives. Your order stays unpaid until cash is collected." />}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0 text-primary" />Totals are recalculated on our server and every payment is verified before your order is confirmed.</p>
          </fieldset>
          {err && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{err}</p>}
        </div>
        <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft lg:sticky lg:top-24">
          <ul className="mb-4 space-y-2 border-b border-border pb-4 text-sm">
            {cart.map((i) => { const p = getProduct(i.productId); return p && (
              <li key={i.key} className="flex justify-between gap-3"><span className="min-w-0">{p.name} × {i.qty}{i.personalisation && <span className="block text-xs text-primary">Personalised</span>}</span><span className="tabular-nums">{inr(p.price * i.qty)}</span></li>
            ); })}
          </ul>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{inr(DELIVERY_FEE)}</dd></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd>{inr(total)}</dd></div>
          </dl>
          <button disabled={!!busy || !cfg} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-70">
            {busy ? <><Loader2 className="size-4 animate-spin" />{busy}</> : method === "cod" ? "Place COD order" : `Pay ${inr(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}
