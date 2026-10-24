import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  head: () => seo("Contact us", "Say hello at hello@momento.demo (sample address)."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="Contact us" sub="Say hello at hello@momento.demo (sample address)." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
