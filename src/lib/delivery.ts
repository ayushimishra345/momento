// CONFIGURABLE EXHIBITION DEMO ONLY: illustrative areas and estimates, not logistics data.
// A match means only that an entry exists here. It is not a delivery promise,
// inventory check, partner integration, rider tracker or real-time fulfilment signal.
export const CITIES: Record<string, { covered: string[]; estimate: string }> = {
  Bengaluru: { covered: ["560001", "560034", "560095", "Koramangala", "Indiranagar", "HSR Layout"], estimate: "2–4 hours (demo estimate)" },
  Mumbai: { covered: ["400050", "400058", "Bandra", "Andheri"], estimate: "3–5 hours (demo estimate)" },
  Delhi: { covered: ["110016", "110017", "Hauz Khas", "Saket", "North Campus"], estimate: "3–5 hours (demo estimate)" },
  Pune: { covered: ["411007", "Kothrud", "Viman Nagar"], estimate: "Same day (demo estimate)" },
  Kolkata: { covered: [], estimate: "" },
};

export function checkCoverage(city: string, area: string) {
  const c = CITIES[city];
  if (!c) return null;
  const q = area.trim().replace(/\s+/g, " ").toLowerCase();
  const hit = q && c.covered.some((x) => x.toLowerCase() === q);
  return hit ? c.estimate : null;
}
