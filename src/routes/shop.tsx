import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";
import { chip, field, PageHero, ProductCard } from "@/components/ProductCard";
import { inBudget } from "@/lib/recommend";
import { BUDGETS, CATEGORIES, PRODUCTS } from "@/lib/products";
import { seo } from "@/lib/seo";

type S = { q?: string; category?: string; budget?: string; occasion?: string; feeling?: string; recipient?: string; sort?: string };
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: str(s.q), category: str(s.category), budget: str(s.budget), occasion: str(s.occasion), feeling: str(s.feeling), recipient: str(s.recipient), sort: str(s.sort),
  }),
  head: () => seo("Shop gifts", "Browse sample Momento gifts by category, budget, occasion and feeling."),
  component: Shop,
});

function Shop() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const set = (patch: Partial<S>) => nav({ search: (prev: S) => ({ ...prev, ...patch }), replace: true });

  const q = s.q?.toLowerCase();
  let list = PRODUCTS.filter((p) =>
    (!q || [p.name, p.description, p.category].join(" ").toLowerCase().includes(q)) &&
    (!s.category || p.category === s.category) &&
    inBudget(p, s.budget) &&
    (!s.occasion || p.occasions.includes(s.occasion)) &&
    (!s.feeling || p.feelings.includes(s.feeling)) &&
    (!s.recipient || p.recipients.includes(s.recipient)),
  );
  if (s.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  else if (s.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  else list = [...list].sort((a, b) => b.popularity - a.popularity);

  const extra = [s.occasion && `Occasion: ${s.occasion}`, s.feeling && `Feeling: ${s.feeling}`, s.recipient && `For: ${s.recipient}`].filter(Boolean);

  return (
    <>
      <PageHero eyebrow="Sample demo catalogue" title="Shop gifts" sub="Sixteen little somethings, from ₹149. All prices are sample prices for this prototype." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_200px]">
          <input className={field} placeholder="Search gifts…" aria-label="Search gifts" value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} />
          <select className={field} aria-label="Sort" value={s.sort ?? ""} onChange={(e) => set({ sort: e.target.value || undefined })}>
            <option value="">Most loved</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Category">
          <button className={chip(!s.category)} onClick={() => set({ category: undefined })}>All</button>
          {CATEGORIES.map((c) => <button key={c} className={chip(s.category === c)} onClick={() => set({ category: s.category === c ? undefined : c })}>{c}</button>)}
        </div>
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Budget">
          {BUDGETS.map((b) => <button key={b.id} className={chip(s.budget === b.id)} onClick={() => set({ budget: s.budget === b.id ? undefined : b.id })}>{b.label}</button>)}
        </div>
        {extra.length > 0 && (
          <p className="mb-6 text-sm text-muted-foreground">{extra.join(" · ")} · <button className="font-semibold text-primary underline" onClick={() => set({ occasion: undefined, feeling: undefined, recipient: undefined })}>clear</button></p>
        )}
        <p className="mb-4 text-sm text-muted-foreground">{list.length} gift{list.length === 1 ? "" : "s"}</p>
        {list.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <PackageOpen className="mx-auto size-10 text-primary" />
            <p className="mt-4 font-display text-2xl">Nothing matches just yet</p>
            <p className="mt-2 text-muted-foreground">Try loosening a filter, or let the gift finder help.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/shop" className="rounded-full border border-border px-5 py-2 text-sm font-semibold">Clear filters</Link>
              <Link to="/find-my-gift" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Find my gift</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
