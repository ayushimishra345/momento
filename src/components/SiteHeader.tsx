import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/find-my-gift", label: "Find My Gift" },
  { to: "/shop", label: "Shop Gifts" },
  { to: "/personalise", label: "Personalise" },
  { to: "/occasions", label: "Occasions" },
  { to: "/mystery", label: "Mystery" },
] as const;

export function SiteHeader() {
  const { count, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(false);
    setOpen(false);
    navigate({ to: "/shop", search: { q: q || undefined } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-primary">
          momento<span className="text-secondary-foreground">.</span>
        </Link>
        <nav className="hidden justify-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary data-[status=active]:text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="col-start-3 flex items-center gap-1">
          <button aria-label="Search" onClick={() => setSearching((s) => !s)} className="rounded-full p-2 hover:bg-muted"><Search className="size-5" /></button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative rounded-full p-2 hover:bg-muted">
            <Heart className="size-5" />
            {wishlist.length > 0 && <Badge n={wishlist.length} />}
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 hover:bg-muted">
            <ShoppingBag className="size-5" />
            {count > 0 && <Badge n={count} />}
          </Link>
          <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="rounded-full p-2 hover:bg-muted lg:hidden">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {searching && (
        <form onSubmit={submit} className="mx-auto flex max-w-7xl gap-2 px-4 pb-3 sm:px-6">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bouquets, journals, hampers…" aria-label="Search gifts"
            className="h-11 flex-1 rounded-full border border-input bg-card px-5 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <button className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">Search</button>
        </form>
      )}
      {open && (
        <nav className="border-t border-border bg-background px-4 py-4 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-display text-lg hover:bg-muted">{n.label}</Link>
          ))}
          <Link to="/delivery" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-display text-lg hover:bg-muted">Local delivery</Link>
        </nav>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{n}</span>;
}
