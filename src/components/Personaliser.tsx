import { useState } from "react";
import type { Personalisation } from "@/lib/store";
import { cn } from "@/lib/utils";
import { field } from "./ProductCard";

export const STYLES = [
  { id: "Ivory Classic", cls: "bg-card text-foreground border-border" },
  { id: "Blush Bloom", cls: "bg-secondary text-secondary-foreground border-secondary" },
  { id: "Berry Night", cls: "bg-primary text-primary-foreground border-primary" },
  { id: "Kraft Sand", cls: "bg-accent text-accent-foreground border-accent" },
];
const MAX_MB = 5;

export function Personaliser({ photo, onSubmit, cta = "Add to cart" }: { photo?: boolean; onSubmit: (p: Personalisation) => void; cta?: string }) {
  const [v, setV] = useState<Personalisation>({ style: "Ivory Classic" });
  const [preview, setPreview] = useState<string>();
  const [err, setErr] = useState<string>();
  const style = STYLES.find((s) => s.id === v.style) ?? STYLES[0];

  const onFile = (f?: File) => {
    setErr(undefined);
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) return setErr("Please upload a JPG, PNG or WebP image.");
    if (f.size > MAX_MB * 1024 * 1024) return setErr(`Image must be under ${MAX_MB} MB.`);
    setPreview(URL.createObjectURL(f));
    setV((x) => ({ ...x, photoName: f.name }));
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        if (!v.recipient?.trim() && !v.note?.trim()) return setErr("Add at least a name or a note to personalise this gift.");
        setErr(undefined);
        onSubmit(v);
      }}>
        <label className="block text-sm font-medium">Recipient's name
          <input className={cn(field, "mt-1.5")} maxLength={40} value={v.recipient ?? ""} onChange={(e) => setV({ ...v, recipient: e.target.value })} placeholder="e.g. Ananya" />
        </label>
        <label className="block text-sm font-medium">Gift note
          <textarea className={cn(field, "mt-1.5 h-24 py-3")} maxLength={240} value={v.note ?? ""} onChange={(e) => setV({ ...v, note: e.target.value })} placeholder="Thank you for every late-night chai…" />
        </label>
        <label className="block text-sm font-medium">A shared memory (optional)
          <textarea className={cn(field, "mt-1.5 h-20 py-3")} maxLength={300} value={v.memory ?? ""} onChange={(e) => setV({ ...v, memory: e.target.value })} placeholder="That rainy day at the canteen…" />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Card style</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button type="button" key={s.id} onClick={() => setV({ ...v, style: s.id })} aria-pressed={v.style === s.id}
                className={cn("rounded-full border-2 px-3 py-1.5 text-xs font-semibold", s.cls, v.style === s.id ? "ring-2 ring-ring ring-offset-2" : "")}>{s.id}</button>
            ))}
          </div>
        </fieldset>
        {photo && (
          <label className="block text-sm font-medium">Upload a photo (JPG/PNG/WebP, max {MAX_MB} MB)
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onFile(e.target.files?.[0])}
              className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-semibold" />
            <span className="mt-1 block text-xs text-muted-foreground">Demo only — your photo stays in this browser and is never uploaded.</span>
          </label>
        )}
        {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        <button className="h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">{cta}</button>
      </form>
      <div>
        <p className="eyebrow mb-3">Live preview</p>
        <div className={cn("relative min-h-80 rounded-2xl border-2 p-8 shadow-lift transition-colors", style.cls)}>
          {preview && <img src={preview} alt="Your uploaded photo" className="mb-5 h-40 w-full rounded-xl object-cover" />}
          <p className="font-display text-3xl italic">Dear {v.recipient || "you"},</p>
          <p className="mt-4 whitespace-pre-wrap leading-relaxed">{v.note || "Your note will appear here, just as they'll read it."}</p>
          {v.memory && <p className="mt-4 border-l-2 border-current pl-3 text-sm italic opacity-80">“{v.memory}”</p>}
          <p className="mt-8 text-right font-display text-lg">— with love, via momento</p>
        </div>
      </div>
    </div>
  );
}
