import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  head: () => seo("About Momento", "Every feeling deserves a little something. An exhibition prototype for thoughtful student gifting."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="About Momento" sub="Every feeling deserves a little something. An exhibition prototype for thoughtful student gifting." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
