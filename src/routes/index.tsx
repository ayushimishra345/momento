import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Gift, MapPin, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import mysteryImg from "@/assets/p-mystery.jpg";
import photosImg from "@/assets/p-photos.jpg";
import { ProductCard, SectionHead } from "@/components/ProductCard";
import { OCCASIONS, PRODUCTS } from "@/lib/products";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("You feel it. We help you gift it.", "Momento helps students and young adults in India find meaningful, personalised, affordable gifts by feeling, occasion and budget."),
  component: Home,
});

const FEELINGS = [
  ["I miss you", "Loved"], ["I'm proud of you", "Celebrated"], ["Thank you for being there", "Appreciated"],
  ["I'm sorry", "Understood"], ["You deserve this", "Comforted"], ["Just because", "Surprised"],
] as const;
const PRICE_TIERS = [["Under ₹199", "u199"], ["Under ₹299", "200-299"], ["Under ₹499", "300-499"], ["Under ₹999", "500-999"]] as const;
const PEOPLE = [
  ["Friends", "Friend", "Small things that say 'I see you'."],
  ["Partners", "Partner", "Romance without the clichés."],
  ["Roommates", "Roommate", "For the one who shares your chai."],
  ["Family", "Parent", "Thank-yous that are long overdue."],
] as const;

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-12 md:items-end md:pb-24 md:pt-16">
          <div className="animate-fade-up md:col-span-6 md:pb-10">
            <p className="eyebrow">Every feeling deserves a little something</p>
            <h1 className="mt-5 text-[3.25rem] leading-[0.95] sm:text-7xl lg:text-[5.75rem]">
              You feel it.<br /><em className="font-normal text-primary">We help you</em><br /><em className="font-normal text-primary">gift it.</em>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">From tiny surprises to unforgettable moments, find a gift that says what words sometimes can't.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/find-my-gift" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition hover:bg-primary/90">Find My Gift <ArrowRight className="size-4" /></Link>
              <Link to="/shop" className="inline-flex h-14 items-center justify-center rounded-full border border-foreground/20 px-8 py-4 font-semibold transition hover:border-primary hover:text-primary">Explore Gifts</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
              <div><dt className="text-muted-foreground">Gifts from</dt><dd className="font-display text-2xl">₹149</dd></div>
              <div><dt className="text-muted-foreground">Feelings</dt><dd className="font-display text-2xl">6</dd></div>
              <div><dt className="text-muted-foreground">Handwritten</dt><dd className="font-display text-2xl">notes</dd></div>
            </dl>
          </div>
          <div className="relative md:col-span-6">
            <img src={hero} alt="A gift wrapped in ivory paper with a berry ribbon and handwritten note" width={1280} height={1280} className="aspect-[4/5] w-full rounded-3xl object-cover" />
            <Link to="/find-my-gift" search={{ urgency: "Today" }} className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-card/95 px-4 py-2 text-sm font-semibold text-primary backdrop-blur transition hover:bg-card">
              <Clock className="size-4" /> Need a gift today?
            </Link>
            <figure className="absolute -bottom-6 right-4 max-w-[15rem] rounded-2xl border border-border bg-card p-5 sm:right-8">
              <blockquote className="font-display text-lg italic leading-snug">“For every late-night chai and every exam-week pep talk.”</blockquote>
              <figcaption className="mt-2 text-xs text-muted-foreground">Sample note · Letter Sealed in Wax, ₹349</figcaption>
            </figure>
          </div>
        </div>
        <div className="overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground" aria-hidden>
          <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-xl italic">
            {[0, 1].flatMap((k) => ["I miss you", "I'm proud of you", "Thank you for being there", "I'm sorry", "You deserve this", "Just because"].map((t) => <span key={k + t}>{t} <span className="not-italic text-secondary">✦</span></span>))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <p className="eyebrow">How Momento works</p>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {[["01", "Start with a feeling", "Proud, sorry, grateful — tell us what you want them to feel."], ["02", "Pick the moment", "A birthday, a farewell, results day, or just a Tuesday."], ["03", "Make it theirs", "Add their name, a memory or a photo. Preview it before it goes."]].map(([n, t, d]) => (
            <li key={n} className="bg-background p-7">
              <span className="font-display text-sm text-primary">{n}</span>
              <p className="mt-3 font-display text-2xl">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-4 pt-20 sm:px-6">
        <section>
          <SectionHead eyebrow="Shop by occasion" title="For every little milestone" action={<Link to="/occasions" className="text-sm font-semibold text-primary">All occasions →</Link>} />
          <div className="flex flex-wrap gap-3">
            {OCCASIONS.map((o) => (
              <Link key={o} to="/shop" search={{ occasion: o }} className="rounded-full border border-border px-6 py-3 font-display text-lg transition hover:border-primary hover:text-primary">{o}</Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead eyebrow="Shop by feeling" title="Start with what you want to say" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEELINGS.map(([say, feel], i) => (
              <Link key={say} to="/shop" search={{ feeling: feel }}
                className={`group flex min-h-44 flex-col justify-between rounded-2xl p-7 transition hover:-translate-y-0.5 ${i % 3 === 1 ? "bg-primary text-primary-foreground" : i % 3 === 2 ? "bg-accent" : "bg-secondary"}`}>
                <p className="font-display text-2xl italic">“{say}”</p>
                <p className="mt-6 text-sm font-semibold opacity-80 group-hover:underline">See gifts →</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead eyebrow="Student favourites" title="Big feelings, small budgets" sub="Sample demo prices." />
          <div className="mb-6 flex flex-wrap gap-2">
            {PRICE_TIERS.map(([l, b]) => (
              <Link key={b} to="/shop" search={{ budget: b }} className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-ink-foreground hover:opacity-90">{l}</Link>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {PRODUCTS.filter((p) => p.price < 500).slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        <section className="grid items-center gap-10 overflow-hidden rounded-3xl bg-card md:grid-cols-2">
          <img src={photosImg} alt="Polaroid photos on twine with fairy lights" loading="lazy" width={816} height={816} className="h-full w-full object-cover" />
          <div className="p-8 md:p-12">
            <p className="eyebrow">Personalised gifts</p>
            <h2 className="mt-3 text-4xl">Made meaningful, by you.</h2>
            <p className="mt-4 text-muted-foreground">Add their name, a note in your words, a memory only you two share — and see it before you send it.</p>
            <Link to="/personalise" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground">Start personalising <Sparkles className="size-4" /></Link>
          </div>
        </section>

        <section className="grid items-center gap-10 overflow-hidden rounded-3xl bg-primary text-primary-foreground md:grid-cols-[1.1fr_1fr]">
          <div className="order-2 p-8 md:order-1 md:p-12">
            <p className="eyebrow !text-secondary">Mystery gifts</p>
            <h2 className="mt-3 text-4xl">Pick the vibe. We'll keep the secret.</h2>
            <p className="mt-4 opacity-80">Choose who it's for, the occasion and a budget. The gift stays hidden until the big reveal.</p>
            <Link to="/mystery" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary-foreground px-7 font-semibold text-primary">Try a mystery <Gift className="size-4" /></Link>
          </div>
          <img src={mysteryImg} alt="Berry mystery gift box with a gold question-mark seal" loading="lazy" width={816} height={816} className="order-1 h-full w-full object-cover md:order-2" />
        </section>

        <section>
          <SectionHead eyebrow="For your people" title="Thoughtful gifts for everyone you love" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PEOPLE.map(([t, r, d]) => (
              <Link key={t} to="/shop" search={{ recipient: r }} className="rounded-2xl border border-border bg-card p-6 hover:border-primary">
                <p className="font-display text-2xl">{t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-accent p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <p className="eyebrow">Demo delivery information</p>
              <h2 className="mt-3 text-4xl">Forgot it's today? Breathe.</h2>
              <p className="mt-4 max-w-lg text-foreground/75">Explore a few illustrative city and campus-area examples. Sample estimates only — not a promise of delivery or a live availability check.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link to="/delivery" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 font-semibold text-ink-foreground"><MapPin className="size-4" /> Check my area</Link>
              <Link to="/find-my-gift" search={{ urgency: "Today" }} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-foreground/25 px-6 font-semibold"><Clock className="size-4" /> Need a gift today?</Link>
            </div>
          </div>
        </section>

        <section>
          <SectionHead eyebrow="Kind words" title="Little somethings, big reactions" sub="Illustrative demo testimonials — not real customer reviews." />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["My roommate cried at the polaroid line. Worth every rupee of my ₹649.", "Riya, 20 · Pune"],
              ["The gift finder picked a wax-sealed letter for my apology. It worked.", "Kabir, 22 · Delhi"],
              ["Mystery box for my sister's results day — she's still talking about it.", "Sneha, 19 · Bengaluru"],
            ].map(([q, a]) => (
              <figure key={a} className="rounded-2xl border border-border bg-card p-7">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Demo testimonial</span>
                <blockquote className="mt-4 font-display text-xl leading-snug">“{q}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">{a}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
