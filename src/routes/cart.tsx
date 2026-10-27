import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Pencil, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHero, field } from "@/components/ProductCard";
import { STYLES } from "@/components/Personaliser";
import { getProduct, inr } from "@/lib/products";
import { seo } from "@/lib/seo";
import { DELIVERY_FEE, useStore, type CartItem, type Personalisation } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({
  head: () => seo("Your cart", "Review your Momento gifts and personalisation before demo checkout."),
  component: Cart,
});

function Cart() {
  const { cart, setQty, remove, subtotal } = useStore();
  if (!cart.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-4xl">Your cart is waiting for a feeling</h1>
        <p className="mt-3 text-muted-foreground">Nothing here yet. Let's find something lovely.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/find-my-gift" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Find my gift</Link>
          <Link to="/shop" className="rounded-full border border-border px-6 py-3 font-semibold">Shop gifts</Link>
        </div>
      </div>
    );
  return (
    <>
      <PageHero eyebrow="Saved in this browser only" title="Your cart" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ul className="space-y-4">
          {cart.map((i) => (
            <CartRow key={i.key} item={i} onQty={(q) => setQty(i.key, q)} onRemove={() => remove(i.key)} />
          ))}
        </ul>
        <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft">
          <h2 className="text-2xl">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Demo delivery fee</dt><dd>{inr(DELIVERY_FEE)}</dd></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd>{inr(subtotal + DELIVERY_FEE)}</dd></div>
          </dl>
          <Link to="/checkout" className="mt-6 flex h-12 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">Go to demo checkout</Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Prices are sample data. No payment is taken.</p>
        </aside>
      </div>
    </>
  );
}

function CartRow({ item, onQty, onRemove }: { item: CartItem; onQty: (q: number) => void; onRemove: () => void }) {
  const { updatePersonalisation } = useStore();
  const [editing, setEditing] = useState(false);
  const p = getProduct(item.productId);
  if (!p) return null;
  const per = item.personalisation;
  return (
    <li className="rounded-2xl bg-card p-4">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 sm:grid-cols-[120px_minmax(0,1fr)_auto]">
        <img src={p.image} alt={p.name} className="aspect-square w-full rounded-xl object-cover" />
        <div className="min-w-0">
          <Link to="/product/$id" params={{ id: p.id }} className="font-display text-lg hover:text-primary">{p.name}</Link>
          <p className="text-sm text-muted-foreground">{inr(p.price)} each</p>
          {per && (
            <div className="mt-2 rounded-lg bg-muted p-3 text-xs">
              {per.recipient && <p><b>For:</b> {per.recipient}</p>}
              {per.note && <p className="line-clamp-2"><b>Note:</b> {per.note}</p>}
              {per.memory && <p className="line-clamp-2"><b>Memory:</b> {per.memory}</p>}
              {per.style && <p><b>Card:</b> {per.style}</p>}
              {per.photoName && <p><b>Photo:</b> {per.photoName}</p>}
            </div>
          )}
          {p.personalisable && !editing && (
            <button onClick={() => setEditing(true)} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              <Pencil className="size-3" /> {per ? "Edit personalisation" : "Add a note"}
            </button>
          )}
        </div>
        <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:flex-col sm:items-end">
          <div className="flex items-center rounded-full border border-border">
            <button aria-label="Decrease quantity" onClick={() => onQty(item.qty - 1)} className="p-2"><Minus className="size-4" /></button>
            <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
            <button aria-label="Increase quantity" onClick={() => onQty(item.qty + 1)} className="p-2"><Plus className="size-4" /></button>
          </div>
          <p className="font-semibold">{inr(p.price * item.qty)}</p>
          <button onClick={onRemove} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><Trash2 className="size-3" /> Remove</button>
        </div>
      </div>
      {editing && (
        <EditPersonalisation
          initial={per ?? { style: "Ivory Classic" }}
          onSave={(v) => { updatePersonalisation(item.key, v); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      )}
    </li>
  );
}

function EditPersonalisation({ initial, onSave, onCancel }: { initial: Personalisation; onSave: (p: Personalisation) => void; onCancel: () => void }) {
  const [v, setV] = useState<Personalisation>(initial);
  const [err, setErr] = useState<string>();
  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.recipient?.trim() && !v.note?.trim()) return setErr("Add at least a name or a note.");
        onSave(v);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">Recipient's name
          <input className={cn(field, "mt-1.5")} maxLength={40} value={v.recipient ?? ""} onChange={(e) => setV({ ...v, recipient: e.target.value })} />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Card style</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button type="button" key={s.id} onClick={() => setV({ ...v, style: s.id })} aria-pressed={v.style === s.id}
                className={cn("rounded-full border-2 px-3 py-1 text-xs font-semibold", s.cls, v.style === s.id ? "ring-2 ring-ring ring-offset-2" : "")}>{s.id}</button>
            ))}
          </div>
        </fieldset>
      </div>
      <label className="block text-sm font-medium">Gift note
        <textarea className={cn(field, "mt-1.5 h-20 py-3")} maxLength={240} value={v.note ?? ""} onChange={(e) => setV({ ...v, note: e.target.value })} />
      </label>
      <label className="block text-sm font-medium">A shared memory (optional)
        <textarea className={cn(field, "mt-1.5 h-16 py-3")} maxLength={300} value={v.memory ?? ""} onChange={(e) => setV({ ...v, memory: e.target.value })} />
      </label>
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      <div className="flex gap-2">
        <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Save changes</button>
        <button type="button" onClick={onCancel} className="rounded-full border border-border px-5 py-2 text-sm font-semibold">Cancel</button>
      </div>
    </form>
  );
}
