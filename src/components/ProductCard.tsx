import { Link } from "@tanstack/react-router";
import { Heart, Sparkles } from "lucide-react";
import { inr, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ p }: { p: Product }) {
  const { add, toggleWish, wishlist } = useStore();
  const wished = wishlist.includes(p.id);
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <Link to="/product/$id" params={{ id: p.id }} aria-label={p.name}>
          <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]" />
        </Link>
        <button onClick={() => toggleWish(p.id)} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-card/90 backdrop-blur transition hover:bg-card focus-visible:ring-2 focus-visible:ring-ring">
          <Heart className={cn("size-4", wished && "fill-primary text-primary")} />
        </button>
        {p.personalisable && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-primary"><Sparkles className="size-3" /> Personalisable</span>
        )}
        <button onClick={() => add(p.id)}
          className="absolute inset-x-3 bottom-3 h-11 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100">
          Add to cart
        </button>
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <Link to="/product/$id" params={{ id: p.id }} className="min-w-0 font-display text-lg leading-snug transition-colors hover:text-primary">{p.name}</Link>
          <span className="shrink-0 font-semibold tabular-nums">{inr(p.price)}</span>
        </div>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.category}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
      </div>
    </article>
  );
}

export function SectionHead({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-3xl leading-tight sm:text-5xl">{title}</h2>
        {sub && <p className="mt-2 max-w-xl text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="bg-blush">
      <div className="mx-auto max-w-7xl border-b border-border px-4 py-12 sm:px-6 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}

export const field = "h-11 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring";
export const chip = (on: boolean) =>
  cn("rounded-full border px-4 py-2 text-sm font-medium transition", on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50");
