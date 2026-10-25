import { parseReceiptText } from "./receipt-parser";

/** Re-parse OCR evidence; user edits never turn an unrelated image into a receipt. */
export function canAttachReceipt(value: { rawText: string | null; amount?: number | null; merchant?: string | null }): boolean {
  if (!value.rawText) return false;
  const draft = parseReceiptText(value.rawText);
  return draft.recognizedLineCount >= 3 && draft.amount !== null &&
    draft.merchant !== null && (draft.lineItems.length > 0 || draft.date !== null);
}
