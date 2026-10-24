import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/delivery")({
  head: () => seo("Delivery information", "Demo delivery estimates for sample covered areas only. Coverage not yet available elsewhere."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="Delivery information" sub="Demo delivery estimates for sample covered areas only. Coverage not yet available elsewhere." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
