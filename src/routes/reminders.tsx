import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/ProductCard";
import { seo } from "@/lib/seo";
export const Route = createFileRoute("/reminders")({
  head: () => seo("Gift reminders", "Never forget a birthday again. Reminder sign-up is coming to this prototype soon."),
  component: () => (
    <>
      <PageHero eyebrow="Momento" title="Gift reminders" sub="Never forget a birthday again. Reminder sign-up is coming to this prototype soon." />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><Link to="/shop" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore gifts</Link></div>
    </>
  ),
});
