import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/wishlist")({
  head: () => seo("Your wishlist", "Saved in this browser only, as part of the demo."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="Your wishlist" sub="Saved in this browser only, as part of the demo." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
