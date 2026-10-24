import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/occasions")({
  head: () => seo("Shop by occasion", "Birthdays, farewells, apologies and every little milestone in between."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="Shop by occasion" sub="Birthdays, farewells, apologies and every little milestone in between." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
