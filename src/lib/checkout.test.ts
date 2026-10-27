import { expect, it } from "vitest";
import { validPhone } from "./checkout";

it("requires 10 phone digits or 10 digits with the Indian country code", () => {
  for (const value of ["98765 43210", "+91 98765 43210", "919876543210"]) expect(validPhone(value)).toBe(true);
  for (const value of ["1234567890123", "123", "98765432101", "98765x43210"]) expect(validPhone(value)).toBe(false);
});