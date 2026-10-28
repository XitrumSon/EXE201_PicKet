export function parseReceiptMoney(value: string): number | null {
  let digits = value.trim().replace(/\s*(?:vnd|đ|d|₫)\s*$/i, "").trim();
  // Accept one complete amount, never concatenate separate columns or repair
  // malformed grouping. Preserve the existing integer-currency cents policy.
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+|\d{1,3}(?:,\d{3})+|\d{1,4}(?:[ \u00a0]\d{3})+)(?:[.,]\d{2})?$/.test(digits)) return null;
  if (/[,.]\d{2}$/.test(digits)) digits = digits.slice(0, -3);
  digits = digits.replace(/\D/g, "");
  const amount = Number.parseInt(digits, 10);
  return Number.isSafeInteger(amount) && amount > 0 && amount <= 9000000000000
    ? amount
    : null;
}

export function parseReceiptItemMoney(value: string): number | null {
 const digits=value.trim().replace(/\s*(?:vnd|đ|d|₫)\s*$/i, "");
 return /^0(?:[.,]0{2})?$/.test(digits) ? 0 : parseReceiptMoney(digits);
}
