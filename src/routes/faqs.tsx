import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/faqs")({
  head: () => seo("FAQs", "Momento is a prototype: products, prices and delivery are sample data and no real orders are placed."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="FAQs" sub="Momento is a prototype: products, prices and delivery are sample data and no real orders are placed." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
