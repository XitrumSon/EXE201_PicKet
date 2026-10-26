import { parseReceiptText, type ReceiptDraft } from "./receipt-parser";
import { receiptHasTableColumns } from "./receipt-table-layout";

/** Re-parse OCR evidence; user edits never turn an unrelated image into a receipt. */
export function canAttachReceipt(value: { rawText: string | null; amount?: number | null; merchant?: string | null }): boolean {
  if (!value.rawText) return false;
  const draft = parseReceiptText(value.rawText);
  return canAttachParsedReceipt(draft);
}

/** Internal OCR already has a parsed draft; do not parse the same evidence twice. */
export function canAttachParsedReceipt(draft: ReceiptDraft): boolean {
  const evidence = draft.rawText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
  const explicitVat = /\bhoa don\b/.test(evidence) && /tien hang/.test(evidence) && /tien thue/.test(evidence) &&
    /^tien thanh toan: \d+$/m.test(evidence);
  if(draft.recognizedLineCount<3||draft.merchant===null)return false;
  if(draft.amount!==null)return draft.lineItems.length>0||draft.date!==null||explicitVat;
  // A proven, incomplete invoice can request a manual total. This does not
  // authorize arbitrary text/photos or treat a user-entered amount as OCR proof.
  return /\b(?:hoa don|receipt|invoice|bien lai)\b/.test(evidence)&&draft.date!==null&&
    receiptHasTableColumns(draft.rawText.split(/\r?\n/).map(text=>({text})))&&
    draft.lineItems.filter(item=>item.total>0&&Math.abs(item.quantity*item.unitPrice-item.total)<=1).length>=2;
}
