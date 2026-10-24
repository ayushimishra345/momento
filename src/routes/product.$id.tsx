import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Truck } from "lucide-react";
import { Personaliser } from "@/components/Personaliser";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, inr, PRODUCTS } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} · Momento` : "Gift not found · Momento" },
      { name: "description", content: loaderData?.description ?? "This gift isn't in our sample catalogue." },
      { property: "og:title", content: loaderData?.name ?? "Momento gift" },
      { property: "og:description", content: loaderData?.description ?? "Momento sample gift" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl">This gift has wandered off</h1>
      <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const p = getProduct(id)!;
  const { add, toggleWish, wishlist } = useStore();
  const wished = wishlist.includes(p.id);
  const related = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category).concat(PRODUCTS.filter((x) => x.category !== p.category)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">← All gifts</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <img src={p.image} alt={p.name} width={816} height={816} className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
        <div>
          <p className="eyebrow">{p.category} · sample product</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{p.name}</h1>
          <p className="mt-4 text-2xl font-semibold">{inr(p.price)} <span className="text-sm font-normal text-muted-foreground">demo price</span></p>
          <p className="mt-5 text-lg text-muted-foreground">{p.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {p.feelings.map((f) => <span key={f} className="rounded-full bg-secondary px-3 py-1 font-semibold text-secondary-foreground">Feels {f.toLowerCase()}</span>)}
            {p.sameDay && <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 font-semibold"><Truck className="size-3" /> Demo same-day eligible</span>}
          </div>
          <div className="mt-8 flex gap-3">
            <button onClick={() => add(p.id)} className="h-12 flex-1 rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">Add to cart{p.personalisable ? " without note" : ""}</button>
            <button onClick={() => toggleWish(p.id)} aria-pressed={wished} aria-label="Toggle wishlist" className="grid size-12 place-items-center rounded-full border border-border bg-card">
              <Heart className={cn("size-5", wished && "fill-primary text-primary")} />
            </button>
          </div>
          {!p.personalisable && <p className="mt-4 text-sm text-muted-foreground">This gift isn't personalisable, but every order includes a short handwritten-style note.</p>}
        </div>
      </div>
      {p.personalisable && (
        <section className="mt-16 rounded-3xl bg-card p-6 sm:p-10">
          <h2 className="mb-6 text-3xl">Make it yours <span className="text-base font-normal text-muted-foreground">(optional)</span></h2>
          <Personaliser photo={p.photoUpload} onSubmit={(v) => add(p.id, v)} cta="Add personalised gift to cart" />
        </section>
      )}
      <section className="mt-16">
        <h2 className="mb-6 text-3xl">You might also love</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </section>
    </div>
  );
}
