import type { ReceiptTextLine } from "./receipt-parser";

type PositionedLine = ReceiptTextLine & {left: number; right: number; top: number; bottom: number};
const normalize = (text: string) => text.toLowerCase().normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ")
  .replace(/^[\s|│┃]+|[\s|│┃]+$/g, "").trim();
const positioned = (line: ReceiptTextLine): line is PositionedLine =>
  [line.left, line.right, line.top, line.bottom].every(value => typeof value === "number" && Number.isFinite(value)) &&
  line.right! > line.left! && line.bottom! > line.top!;
const moneyCell = (line: ReceiptTextLine) => /^\d[\d.,\s]*(?:vnd|đ|d|₫)?$/i.test(line.text.trim());
const moneyValue = (line: ReceiptTextLine) => {
  const digits = line.text.replace(/[^0-9,.]/g, "");
  return Number((/[,.]\d{2}$/.test(digits) ? digits.slice(0, -3) : digits).replace(/\D/g, ""));
};

/** Resolve a VAT summary by column order and checked arithmetic, even on a skewed photo. */
export function receiptVatSummaryRows(lines: ReceiptTextLine[]): ReceiptTextLine[] {
  const removed = new Set<ReceiptTextLine>();
  const replacements = new Map<ReceiptTextLine, ReceiptTextLine>();
  const positionedLines = lines.filter(positioned);
  for (const payable of positionedLines.filter(line => /^(?:tien|tong tien) thanh toan\s*:?$/.test(normalize(line.text)))) {
    const labelHeight = payable.bottom - payable.top;
    const labels = positionedLines.filter(line => Math.abs(line.left - payable.left) <= labelHeight &&
      line.top < payable.top && payable.top - line.top <= labelHeight * 8);
    const subtotals = labels.filter(line => /^tien hang\s*:?$/.test(normalize(line.text)));
    const taxes = labels.filter(line => /^tien thue\s*:?$/.test(normalize(line.text)));
    if (subtotals.length !== 1 || taxes.length !== 1 || subtotals[0].top >= taxes[0].top) continue;
    const subtotal = subtotals[0];
    const rowGap = Math.max(taxes[0].top - subtotal.top, payable.top - taxes[0].top);
    const headers = positionedLines.filter(line => /^tong cong\s*:?$/.test(normalize(line.text)) &&
      line.left > payable.right && line.top < subtotal.bottom && subtotal.top - line.bottom <= rowGap * 4);
    // A bare table heading is not itself a payable amount. Preserve other text,
    // but omit unresolved total labels so raw-text reparse cannot guess a tax cell.
    removed.add(payable);
    headers.forEach(header => removed.add(header));
    if (headers.length !== 1) continue;
    const header = headers[0];
    const width = header.right - header.left;
    const amounts = positionedLines.filter(line => moneyCell(line) && line.left >= header.left - labelHeight &&
      line.left <= header.right + width && line.top > header.bottom &&
      line.bottom <= payable.bottom + rowGap * 2).sort((a, b) => a.top - b.top);
    if (amounts.length !== 3) continue;
    const [base, tax, total] = amounts.map(moneyValue);
    if (![base, tax, total].every(Number.isSafeInteger) || total <= 0 || total > 9_000_000_000_000 ||
      Math.abs(base + tax - total) > 1) continue;
    removed.delete(payable);
    removed.add(amounts[2]);
    replacements.set(payable, {...payable, text: `Tiền thanh toán: ${total}`});
  }
  return lines.filter(line => !removed.has(line)).map(line => replacements.get(line) ?? line);
}
