import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">momento.</p>
          <p className="mt-3 max-w-sm text-sm opacity-75">Every feeling deserves a little something. Thoughtful, affordable gifting for students and young adults across India.</p>
          <div className="mt-5 flex gap-3">
            {[["Instagram", Instagram, "https://instagram.com"], ["LinkedIn", Linkedin, "https://linkedin.com"], ["YouTube", Youtube, "https://youtube.com"]].map(([l, I, h]: any) => (
              <a key={l} href={h} target="_blank" rel="noreferrer" aria-label={l} className="rounded-full border border-ink-foreground/25 p-2 hover:bg-ink-foreground/10"><I className="size-4" /></a>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow !text-secondary">Explore</p>
          <Link to="/shop" className="block opacity-80 hover:opacity-100">Shop gifts</Link>
          <Link to="/find-my-gift" className="block opacity-80 hover:opacity-100">Find my gift</Link>
          <Link to="/mystery" className="block opacity-80 hover:opacity-100">Mystery gifts</Link>
          <Link to="/reminders" className="block opacity-80 hover:opacity-100">Gift reminders</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow !text-secondary">Momento</p>
          <Link to="/about" className="block opacity-80 hover:opacity-100">About</Link>
          <Link to="/contact" className="block opacity-80 hover:opacity-100">Contact</Link>
          <Link to="/faqs" className="block opacity-80 hover:opacity-100">FAQs</Link>
          <Link to="/delivery" className="block opacity-80 hover:opacity-100">Delivery information</Link>
        </div>
      </div>
      <p className="border-t border-ink-foreground/15 px-4 py-5 text-center text-xs opacity-60">
        Momento is an exhibition prototype. Products, prices and delivery estimates are sample demo data. No real orders are placed.
      </p>
    </footer>
  );
}
