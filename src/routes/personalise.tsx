import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/ProductCard";
import { Personaliser } from "@/components/Personaliser";
import { inr, PRODUCTS } from "@/lib/products";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/personalise")({
  head: () => seo("Personalise a gift", "Add a name, a note, a memory or a photo — and preview it before it goes in your cart."),
  component: Personalise,
});

function Personalise() {
  const options = PRODUCTS.filter((p) => p.personalisable);
  const [id, setId] = useState(options[0].id);
  const p = options.find((x) => x.id === id)!;
  const { add } = useStore();
  return (
    <>
      <PageHero eyebrow="Personalised gifts" title="Say it in your own words." sub="Pick a gift, write your note, choose a card — and see exactly how it'll look." />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl">1. Choose a gift</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
          {options.map((o) => (
            <button key={o.id} onClick={() => setId(o.id)} aria-pressed={o.id === id}
              className={cn("w-40 shrink-0 overflow-hidden rounded-2xl border-2 bg-card text-left transition", o.id === id ? "border-primary" : "border-transparent")}>
              <img src={o.image} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              <div className="p-3"><p className="line-clamp-1 text-sm font-semibold">{o.name}</p><p className="text-xs text-muted-foreground">{inr(o.price)}{o.photoUpload ? " · photo" : ""}</p></div>
            </button>
          ))}
        </div>
        <h2 className="mt-10 text-2xl">2. Make it theirs</h2>
        <div className="mt-6 rounded-[2rem] bg-card p-6 sm:p-10">
          <Personaliser key={p.id} photo={p.photoUpload} onSubmit={(v) => add(p.id, v)} cta={`Add ${p.name} — ${inr(p.price)}`} />
        </div>
      </div>
    </>
  );
}
