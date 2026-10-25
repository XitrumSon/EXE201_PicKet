import { parseReceiptText } from "./receipt-parser";

/** Re-parse OCR evidence; user edits never turn an unrelated image into a receipt. */
export function canAttachReceipt(value: { rawText: string | null; amount?: number | null; merchant?: string | null }): boolean {
  if (!value.rawText) return false;
  const draft = parseReceiptText(value.rawText);
  const evidence = value.rawText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const explicitVat = /\bhoa don\b/.test(evidence) && /tien hang/.test(evidence) && /tien thue/.test(evidence) &&
    /^tien thanh toan: \d+$/m.test(evidence);
  return draft.recognizedLineCount >= 3 && draft.amount !== null &&
    draft.merchant !== null && (draft.lineItems.length > 0 || draft.date !== null || explicitVat);
}
