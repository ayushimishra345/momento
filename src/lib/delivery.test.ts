import { describe, expect, it } from "vitest";
import { CITIES, checkCoverage } from "./delivery";

describe("illustrative delivery coverage", () => {
  it("returns the configured sample estimate for a listed PIN", () => {
    expect(checkCoverage("Bengaluru", "560034")).toBe("2–4 hours (demo estimate)");
  });
  it("matches listed areas without case or surrounding-space sensitivity", () => {
    expect(checkCoverage("Bengaluru", "  hSr   Layout  ")).toBe("2–4 hours (demo estimate)");
  });
  it("reports unavailable coverage for an unlisted area", () => {
    expect(checkCoverage("Bengaluru", "560999")).toBeNull();
  });
  it("does not match another city's listed PIN", () => {
    expect(checkCoverage("Mumbai", "560034")).toBeNull();
  });
  it("reports unavailable coverage for a city with no sample areas", () => {
    expect(checkCoverage("Kolkata", "700001")).toBeNull();
  });
  it("does not treat empty, partial or unknown locations as coverage", () => {
    for (const area of ["", "   ", "560", "HSR"]) expect(checkCoverage("Bengaluru", area)).toBeNull();
    expect(checkCoverage("Chennai", "600001")).toBeNull();
  });
  it("returns each entry's own illustrative estimate", () => {
    for (const [city, config] of Object.entries(CITIES)) {
      for (const area of config.covered) expect(checkCoverage(city, area)).toBe(config.estimate);
    }
  });
});