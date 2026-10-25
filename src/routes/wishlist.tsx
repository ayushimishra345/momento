import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageHero, ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { seo } from "@/lib/seo";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => seo("Your wishlist", "The Momento gifts you've saved, kept in this browser only as part of the demo."),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
  if (!items.length)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Heart className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 text-4xl">No saved gifts yet</h1>
        <p className="mt-3 text-muted-foreground">Tap the heart on any gift to keep it here for later.</p>
        <Link to="/shop" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link>
      </div>
    );
  return (
    <>
      <PageHero eyebrow="Saved in this browser only" title="Your wishlist" sub={`${items.length} gift${items.length === 1 ? "" : "s"} you're keeping for later.`} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </>
  );
}
