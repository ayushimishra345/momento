import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { chip, field } from "@/components/ProductCard";
import { BUDGETS, FEELINGS, INTERESTS, inr, OCCASIONS, RECIPIENTS } from "@/lib/products";
import { recommend, type QuizAnswers } from "@/lib/recommend";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type S = { urgency?: QuizAnswers["urgency"] };
const URG = ["Today", "ASAP", "Planning ahead"] as const;

export const Route = createFileRoute("/find-my-gift")({
  validateSearch: (s: Record<string, unknown>): S => ({ urgency: URG.includes(s.urgency as any) ? (s.urgency as S["urgency"]) : undefined }),
  head: () => seo("Find my gift", "Answer a few gentle questions and get three gift ideas that fit your feeling and budget."),
  component: Finder,
});

function Finder() {
  const { urgency } = Route.useSearch();
  const [a, setA] = useState<QuizAnswers>({ interests: [], urgency });
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");

  const steps = [
    { title: "Who is the gift for?", key: "recipient", opts: RECIPIENTS },
    { title: "What's the occasion?", key: "occasion", opts: OCCASIONS },
    { title: "What do you want them to feel?", key: "feeling", opts: FEELINGS },
    { title: "What are they into?", key: "interests", opts: INTERESTS, multi: true, optional: true },
    { title: "What's your budget?", key: "budget", opts: BUDGETS.map((b) => b.label) },
    { title: "How soon do you need it?", key: "urgency", opts: URG },
    { title: "Anything personal to add?", key: "message", optional: true },
  ] as const;
  const total = steps.length;
  const done = step >= total;
  const cur = steps[Math.min(step, total - 1)];

  const value = (k: string) => (k === "budget" ? BUDGETS.find((b) => b.id === a.budget)?.label : (a as any)[k]);
  const pick = (k: string, o: string) => {
    if (k === "interests") return setA((x) => ({ ...x, interests: x.interests.includes(o) ? x.interests.filter((i) => i !== o) : [...x.interests, o] }));
    const v = k === "budget" ? BUDGETS.find((b) => b.label === o)!.id : o;
    setA((x) => ({ ...x, [k]: v }));
    setStep((s) => s + 1);
  };

  return (
    <div className="bg-blush min-h-[80vh]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="eyebrow">Gift finder · rule-based, not AI</p>
        <div className="mt-4 flex items-center gap-2" aria-label={`Step ${Math.min(step + 1, total)} of ${total}`}>
          {steps.map((_, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < step || done ? "bg-primary" : i === step ? "bg-primary/50" : "bg-border")} />)}
        </div>
        {!done ? (
          <div key={step} className="animate-fade-up mt-10 rounded-[2rem] bg-card p-6 shadow-soft sm:p-10">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1 text-sm font-semibold disabled:opacity-30"><ArrowLeft className="size-4" /> Back</button>
              <span className="text-sm text-muted-foreground">{step + 1} / {total}</span>
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl">{cur.title}</h1>
            {"opts" in cur ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {cur.opts.map((o) => {
                  const on = cur.key === "interests" ? a.interests.includes(o) : value(cur.key) === o;
                  return <button key={o} className={cn(chip(on), "px-5 py-3 text-base")} onClick={() => pick(cur.key, o)}>{o}</button>;
                })}
              </div>
            ) : (
              <textarea className={cn(field, "mt-8 h-32 py-3")} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A memory, an inside joke, something they said once…" />
            )}
            {("optional" in cur || ("multi" in cur)) && (
              <div className="mt-8 flex gap-3">
                <button onClick={() => setStep((s) => s + 1)} className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">{cur.key === "message" ? "Show my gifts" : "Continue"}</button>
                <button onClick={() => { if (cur.key === "interests") setA((x) => ({ ...x, interests: [] })); setStep((s) => s + 1); }} className="rounded-full px-5 py-3 font-semibold text-muted-foreground hover:text-foreground">Skip</button>
              </div>
            )}
          </div>
        ) : (
          <Results a={a} message={message} reset={() => { setA({ interests: [] }); setStep(0); }} back={() => setStep(total - 1)} />
        )}
      </div>
    </div>
  );
}

function Results({ a, message, reset, back }: { a: QuizAnswers; message: string; reset: () => void; back: () => void }) {
  const picks = recommend(a);
  const { add } = useStore();
  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Three gifts that feel right</h1>
          <p className="mt-2 text-muted-foreground">Matched by simple, transparent rules on our sample catalogue — within your budget.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={back} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold">Back</button>
          <button onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"><RotateCcw className="size-4" /> Start over</button>
        </div>
      </div>
      {picks.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="font-display text-2xl">No sample gifts in that budget yet</p>
          <p className="mt-2 text-muted-foreground">Try a different budget, or browse everything.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Browse all gifts</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {picks.map(({ label, product: p, reasons }, i) => (
            <article key={p.id} className="animate-fade-up flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft" style={{ animationDelay: `${i * 120}ms` }}>
              <img src={p.image} alt={p.name} loading="lazy" width={816} height={816} className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-1 flex-col p-5">
                <p className="eyebrow">{label}</p>
                <Link to="/product/$id" params={{ id: p.id }} className="mt-2 font-display text-xl hover:text-primary">{p.name}</Link>
                <p className="mt-1 font-semibold">{inr(p.price)}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{reasons.map((r) => <li key={r}>· {r}</li>)}</ul>
                <p className="mt-3 text-xs font-semibold text-primary">{p.personalisable ? "Personalise with name, note & card style" + (p.photoUpload ? " + photo" : "") : "Includes a short printed note"}</p>
                <div className="mt-auto flex gap-2 pt-5">
                  <button onClick={() => add(p.id, message ? { memory: message } : undefined)} className="flex-1 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground">Add to cart</button>
                  {p.personalisable && <Link to="/product/$id" params={{ id: p.id }} className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold">Personalise</Link>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
