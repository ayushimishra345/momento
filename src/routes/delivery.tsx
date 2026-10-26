import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Search, CheckCircle2, CircleHelp } from "lucide-react";
import { useState } from "react";
import { field } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { CITIES, checkCoverage } from "@/lib/delivery";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/delivery")({
  head: () => seo("Demo delivery information", "Check illustrative city, PIN and area coverage with sample estimates. No live delivery service or fulfilment promise."),
  component: Delivery,
});

function Delivery() {
  const [city, setCity] = useState("Bengaluru");
  const [area, setArea] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ city: string; area: string; estimate: string | null } | null>(null);
  const examples = CITIES[city]?.covered ?? [];
  const resetResult = () => { setError(""); setResult(null); };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!area.trim()) {
      setResult(null);
      setError("Enter a PIN code or delivery area to check the demo dataset.");
      return;
    }
    setError("");
    setResult({ city, area: area.trim(), estimate: checkCoverage(city, area) });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Demo delivery information</p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">A little closer to<br /><em className="text-primary">their doorstep.</em></h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">Check a few example neighbourhoods in our exhibition demo. Every area and delivery estimate below is illustrative, not a promise of real-world service.</p>
      </div>

      <div className="mt-10 grid gap-10 border-t border-border pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="flex items-center gap-3 text-2xl"><MapPin className="size-5 text-primary" /> Check your area</h2>
          <form onSubmit={submit} noValidate className="mt-6 space-y-5">
            <div>
              <label htmlFor="delivery-city" className="text-sm font-semibold">City</label>
              <select id="delivery-city" className={`${field} mt-2`} value={city} onChange={(e) => { setCity(e.target.value); setArea(""); resetResult(); }}>
                {Object.keys(CITIES).map((name) => <option key={name}>{name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="delivery-area" className="text-sm font-semibold">PIN code or delivery area</label>
              <input id="delivery-area" className={`${field} mt-2`} value={area} onChange={(e) => { setArea(e.target.value); resetResult(); }} placeholder="e.g. 560034 or Koramangala" maxLength={100} aria-invalid={Boolean(error)} aria-describedby={error ? "delivery-error" : "delivery-examples"} />
              <p id="delivery-examples" className="mt-2 text-xs leading-relaxed text-muted-foreground">{examples.length ? `Illustrative examples in ${city}: ${examples.join(", ")}.` : "No illustrative areas are listed for this city."}</p>
              {error && <p id="delivery-error" role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="h-12 w-full rounded-full px-6 shadow-none sm:w-auto"><Search /> Check demo coverage</Button>
          </form>

          <div role="status" aria-live="polite" aria-atomic="true" className="mt-6">
            {result && <div className={`rounded-lg border border-border p-6 ${result.estimate ? "bg-secondary/40" : "bg-muted"}`}>
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">{result.estimate ? <CheckCircle2 className="size-5 shrink-0" /> : <CircleHelp className="size-5 shrink-0" />} {result.estimate ? "Listed in demo coverage" : "Coverage unavailable in this demo"}</p>
              <p className="mt-2 break-words text-sm text-muted-foreground">{result.area} · {result.city}</p>
              {result.estimate ? <><p className="mt-4 text-xs font-semibold uppercase text-primary">Sample delivery estimate</p><p className="mt-1 font-display text-2xl">{result.estimate}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">This entry is illustrative only. It does not confirm delivery availability or reserve a delivery slot.</p></> : <p className="mt-3 text-sm leading-relaxed text-muted-foreground">This location is not in our sample dataset, so we cannot show an estimate. This is not a check of real delivery availability.</p>}
            </div>}
          </div>
        </div>

        <aside className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <Clock className="size-7 text-primary" />
          <h2 className="mt-4 text-3xl">A last-minute feeling?</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Find gifts with “Today” selected in the demo gift finder. Suggestions use sample catalogue flags, not live stock or confirmed delivery slots.</p>
          <Button asChild variant="outline" className="mt-6 h-12 w-full rounded-full px-6 shadow-none sm:w-auto"><Link to="/find-my-gift" search={{ urgency: "Today" }}><Clock /> Need a gift today?</Link></Button>
          <div className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">An honest exhibition demo</p>
            <p className="mt-2">No live inventory, delivery partners, rider tracking or real-time fulfilment are connected. No real orders or deliveries are arranged here.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
