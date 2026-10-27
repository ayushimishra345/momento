export function validPhone(phone: string) {
  if (!/^[\d\s()+-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return /^\d{10}$/.test(digits) || /^91\d{10}$/.test(digits);
}