import { describe, expect, it } from "vitest";
import { BUDGETS, FEELINGS, RECIPIENTS } from "./products";
import { recommend, skipOptionalAnswer } from "./recommend";

describe("recommend", () => {
  it("never exceeds the chosen budget, for every combination", () => {
    for (const b of BUDGETS) for (const f of FEELINGS) for (const r of RECIPIENTS)
      for (const p of recommend({ budget: b.id, feeling: f, recipient: r, interests: [] }))
        expect(p.product.price).toBeLessThanOrEqual(b.max);
  });
  it("returns three distinct labelled picks", () => {
    const picks = recommend({ recipient: "Best friend", feeling: "Loved", budget: "500-999", interests: [] });
    expect(picks.map((p) => p.label)).toEqual(["The Safe Choice", "The Thoughtful Choice", "The Unexpected Choice"]);
    expect(new Set(picks.map((p) => p.product.id)).size).toBe(3);
  });
  it("under ₹199 only offers items priced ₹199 or less", () => {
    const picks = recommend({ budget: "u199", interests: [] });
    expect(picks.length).toBeGreaterThan(0);
    picks.forEach((p) => expect(p.product.price).toBeLessThanOrEqual(199));
  });
  it("is deterministic", () => {
    const a = { recipient: "Parent", occasion: "Thank You", feeling: "Appreciated", budget: "500-999", interests: ["Food & treats"] };
    expect(recommend(a).map((p) => p.product.id)).toEqual(recommend(a).map((p) => p.product.id));
  });
  it("prefers same-day gifts when needed today", () => {
    recommend({ budget: "300-499", urgency: "Today", interests: [] }).forEach((p) => expect(p.product.sameDay).toBe(true));
  });
  it("returns no match rather than a non-same-day gift for Today at ₹1,000+", () => {
    expect(recommend({ budget: "1000+", urgency: "Today", interests: [] })).toEqual([]);
  });
  it("clears a previously answered relationship when skipped without losing other answers", () => {
    expect(skipOptionalAnswer({ recipient: "Parent", closeness: "Inseparable", interests: ["Self-care"] }, "closeness"))
      .toEqual({ recipient: "Parent", closeness: undefined, interests: ["Self-care"] });
  });
  it("clears interests when explicitly skipped", () => {
    expect(skipOptionalAnswer({ recipient: "Friend", interests: ["Self-care"] }, "interests").interests).toEqual([]);
  });
});
