import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import mysteryImg from "@/assets/p-mystery.jpg";
import { chip, PageHero } from "@/components/ProductCard";
import { BUDGETS, inr, OCCASIONS, RECIPIENTS } from "@/lib/products";
import { recommend } from "@/lib/recommend";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

const VIBES = [["Cosy", "Comforted"], ["Sentimental", "Loved"], ["Celebratory", "Celebrated"], ["Playful", "Surprised"]] as const;

export const Route = createFileRoute("/mystery")({
  head: () => seo("Mystery gifts", "Pick who it's for, the occasion, budget and vibe — the gift stays hidden until the reveal."),
  component: Mystery,
});

function Mystery() {
  const [r, setR] = useState<string>();
  const [o, setO] = useState<string>();
  const [b, setB] = useState<string>();
  const [v, setV] = useState<string>();
  const [stage, setStage] = useState<"form" | "shaking" | "revealed">("form");
  const { add } = useStore();
  const ready = r && o && b && v;
  const pick = ready ? recommend({ recipient: r, occasion: o, budget: b, feeling: VIBES.find((x) => x[0] === v)?.[1], interests: [] })[0] : undefined;

  const Row = ({ label, opts, val, set }: { label: string; opts: readonly string[]; val?: string; set: (s: string) => void }) => (
    <fieldset className="mt-6"><legend className="font-semibold">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">{opts.map((x) => <button key={x} className={chip(val === x)} onClick={() => set(x)}>{x}</button>)}</div>
    </fieldset>
  );

  return (
    <>
      <PageHero eyebrow="Mystery gifting · prototype" title="Some feelings are best as a surprise." sub="Tell us a little. We'll choose a sample gift and keep it hidden until you're ready." />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {stage === "form" && (
          <div className="rounded-3xl bg-card p-6 shadow-soft sm:p-10">
            <Row label="Who's it for?" opts={RECIPIENTS} val={r} set={setR} />
            <Row label="Occasion" opts={OCCASIONS} val={o} set={setO} />
            <Row label="Budget" opts={BUDGETS.map((x) => x.label)} val={BUDGETS.find((x) => x.id === b)?.label} set={(l) => setB(BUDGETS.find((x) => x.label === l)!.id)} />
            <Row label="Vibe" opts={VIBES.map((x) => x[0])} val={v} set={setV} />
            <button disabled={!ready} onClick={() => { setStage("shaking"); setTimeout(() => setStage("revealed"), 1600); }}
              className="mt-10 h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground disabled:opacity-40">Seal my mystery</button>
            <p className="mt-3 text-center text-xs text-muted-foreground">This is a prototype experience — no real mystery order is fulfilled.</p>
          </div>
        )}
        {stage === "shaking" && (
          <div className="py-10 text-center">
            <img src={mysteryImg} alt="Sealed mystery box" className="animate-shake mx-auto w-72 rounded-3xl shadow-soft" />
            <p className="mt-6 font-display text-2xl italic">Choosing something just for them…</p>
          </div>
        )}
        {stage === "revealed" && (
          pick ? (
            <div className="animate-reveal mx-auto max-w-md overflow-hidden rounded-3xl bg-card text-center shadow-soft">
              <img src={pick.product.image} alt={pick.product.name} className="aspect-square w-full object-cover" />
              <div className="p-8">
                <p className="eyebrow">It's a…</p>
                <h2 className="mt-2 text-3xl">{pick.product.name}</h2>
                <p className="mt-2 font-semibold">{inr(pick.product.price)} <span className="text-xs font-normal text-muted-foreground">sample price</span></p>
                <p className="mt-3 text-sm text-muted-foreground">{pick.reasons[0]}</p>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => add(pick.product.id)} className="flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground">Add to cart</button>
                  <button onClick={() => setStage("form")} className="rounded-full border border-border px-5 py-3 font-semibold">Try again</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="font-display text-2xl">No sample mystery fits that budget</p>
              <button onClick={() => setStage("form")} className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Change my picks</button>
              <Link to="/shop" className="ml-3 font-semibold text-primary">Browse instead</Link>
            </div>
          )
        )}
      </div>
    </>
  );
}
