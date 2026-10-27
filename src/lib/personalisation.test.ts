import { describe, expect, it } from "vitest";
import { validatePersonalisation, validatePhoto } from "./personalisation";

describe("personalisation validation", () => {
  it("accepts memory-only personalisation", () => {
    expect(validatePersonalisation({ memory: "Our first college fest" })).toBeUndefined();
  });
  it("rejects blank personalisation", () => {
    expect(validatePersonalisation({ recipient: " ", note: " " })).toBeDefined();
  });
  it("enforces a 40-character recipient name", () => {
    expect(validatePersonalisation({ recipient: "a".repeat(40) })).toBeUndefined();
    expect(validatePersonalisation({ recipient: "a".repeat(41) })).toBeDefined();
  });
  it("enforces a 240-character note", () => {
    expect(validatePersonalisation({ note: "a".repeat(240) })).toBeUndefined();
    expect(validatePersonalisation({ note: "a".repeat(241) })).toBeDefined();
  });
  it("enforces a 300-character memory", () => {
    expect(validatePersonalisation({ memory: "a".repeat(300) })).toBeUndefined();
    expect(validatePersonalisation({ memory: "a".repeat(301) })).toBeDefined();
  });
  it("allows JPG, PNG and WebP, rejects unsupported types", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) expect(validatePhoto({ type, size: 100 })).toBeUndefined();
    expect(validatePhoto({ type: "image/svg+xml", size: 100 })).toBeDefined();
  });
  it("enforces the 5 MB image limit", () => {
    expect(validatePhoto({ type: "image/png", size: 5 * 1024 * 1024 })).toBeUndefined();
    expect(validatePhoto({ type: "image/png", size: 5 * 1024 * 1024 + 1 })).toBeDefined();
  });
});