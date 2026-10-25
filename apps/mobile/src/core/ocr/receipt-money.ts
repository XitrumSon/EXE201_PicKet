export function parseReceiptMoney(value: string): number | null {
  let digits = value.replace(/[^0-9,.]/g, "");
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
