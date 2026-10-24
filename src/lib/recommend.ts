import { BUDGETS, PRODUCTS, type Product } from "./products";

export type QuizAnswers = {
  recipient?: string;
  occasion?: string;
  feeling?: string;
  interests: string[];
  budget?: string;
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
  return s;
}

export function inBudget(p: Product, budgetId?: string) {
  const b = BUDGETS.find((x) => x.id === budgetId);
  return !b || (p.price >= b.min && p.price <= b.max);
}

function reasons(p: Product, a: QuizAnswers) {
  const r: string[] = [];
  if (a.feeling && p.feelings.includes(a.feeling)) r.push(`Made to help them feel ${a.feeling.toLowerCase()}.`);
  if (a.recipient && p.recipients.includes(a.recipient)) r.push(`A natural fit for a ${a.recipient.toLowerCase()}.`);
  if (a.occasion && p.occasions.includes(a.occasion)) r.push(`Suits a ${a.occasion.toLowerCase()} moment.`);
  const hit = p.interests.filter((i) => a.interests.includes(i));
  if (hit.length) r.push(`Matches their love of ${hit.join(", ").toLowerCase()}.`);
  if (a.urgency === "Today" && p.sameDay) r.push("Eligible for demo same-day delivery.");
  if (!r.length) r.push("A well-loved pick within your budget.");
  return r;
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
