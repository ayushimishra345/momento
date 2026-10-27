import { BUDGETS, PRODUCTS, type Product } from "./products";

export type QuizAnswers = {
  recipient?: string;
  occasion?: string;
  feeling?: string;
  interests: string[];
  budget?: string;
  closeness?: "Just getting close" | "Close" | "Inseparable";
  urgency?: "Today" | "ASAP" | "Planning ahead";
};

export type Pick = { label: string; product: Product; reasons: string[] };

/** Deterministic, rule-based scoring. No AI involved. */
export function score(p: Product, a: QuizAnswers) {
  let s = p.popularity / 10;
  if (a.recipient && p.recipients.includes(a.recipient)) s += 2;
  if (a.occasion && p.occasions.includes(a.occasion)) s += 2;
  if (a.feeling && p.feelings.includes(a.feeling)) s += 3;
  s += p.interests.filter((i) => a.interests.includes(i)).length * 2;
  if (a.closeness === "Inseparable" && p.personalisable) s += 1.5;
  if (a.closeness === "Just getting close" && !p.photoUpload && p.price < 500) s += 1;
  if (a.urgency === "Today" && p.sameDay) s += 1;
  return s;
}

export function inBudget(p: Product, budgetId?: string) {
  const b = BUDGETS.find((x) => x.id === budgetId);
  return !b || (p.price >= b.min && p.price <= b.max);
}

export function reasons(p: Product, a: QuizAnswers) {
  const who = a.recipient ? `your ${a.recipient.toLowerCase()}` : "them";
  const r: string[] = [];
  if (a.feeling && p.feelings.includes(a.feeling)) r.push(`It's chosen to make ${who} feel ${a.feeling.toLowerCase()}.`);
  else if (a.recipient && p.recipients.includes(a.recipient)) r.push(`It's a gift people often pick for ${who}.`);
  if (a.occasion && p.occasions.includes(a.occasion)) r.push(`It suits ${/^[aeiou]/i.test(a.occasion) ? "an" : "a"} ${a.occasion.toLowerCase()} moment without trying too hard.`);
  const hit = p.interests.filter((i) => a.interests.includes(i));
  if (hit.length) r.push(`They love ${hit.join(" and ").toLowerCase()}, and this speaks to that.`);
  if (a.closeness === "Inseparable" && p.personalisable) r.push("You're close, so add a name, memory or inside joke to it.");
  if (a.urgency === "Today" && p.sameDay) r.push("It's tagged as a same-day example in our demo catalogue, not a confirmed delivery slot.");
  const b = BUDGETS.find((x) => x.id === a.budget);
  if (b) r.push(`At ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p.price)} it stays inside your ${b.label} budget.`);
  return r.length ? r : ["A well-loved pick from our sample catalogue."];
}

export function recommend(a: QuizAnswers): Pick[] {
  let pool = PRODUCTS.filter((p) => inBudget(p, a.budget));
  if (a.urgency === "Today") {
    const fast = pool.filter((p) => p.sameDay);
    if (fast.length) pool = fast;
  }
  if (!pool.length) return [];
  const ranked = [...pool].sort((x, y) => score(y, a) - score(x, a) || x.price - y.price);
  const used = new Set<string>();
  const take = (label: string, pred: (p: Product) => boolean) => {
    const p = ranked.find((x) => !used.has(x.id) && pred(x)) ?? ranked.find((x) => !used.has(x.id));
    if (!p) return null;
    used.add(p.id);
    return { label, product: p, reasons: reasons(p, a) };
  };
  const safe = take("The Safe Choice", (p) => p.popularity >= 8);
  const thoughtful = take("The Thoughtful Choice", (p) => p.personalisable);
  const unexpected = take("The Unexpected Choice", (p) => p.category !== safe?.product.category && p.category !== thoughtful?.product.category);
  return [safe, thoughtful, unexpected].filter(Boolean) as Pick[];
}
