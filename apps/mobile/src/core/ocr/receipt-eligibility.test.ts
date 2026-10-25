import assert from "node:assert/strict";
import { test } from "node:test";
import { parseReceiptText } from "./receipt-parser";
import { canAttachReceipt } from "./receipt-eligibility";
import { receiptCorpus } from "./fixtures/receipt-corpus";

test("landscape, arbitrary text and amount-only images cannot become receipts", () => {
  for (const text of ["", "SUNSET BEACH\nBeautiful day\n2026", "SALE\nTotal 100000"]) {
    assert.equal(canAttachReceipt(parseReceiptText(text)), false);
  }
});
test("a receipt with merchant, items and total can be reviewed", () => {
  assert.equal(canAttachReceipt(parseReceiptText("CA PHE AN\nCa phe 25000\nTong cong 25000\n23/10/2026")), true);
});
test("typed fields cannot authorize an image with no OCR evidence", () => {
  assert.equal(canAttachReceipt({ rawText: null, amount: 100000, merchant: "Entered by user" }), false);
});
test("supported synthetic receipt layouts retain the review flow", () => {
  for (const receipt of receiptCorpus) assert.equal(canAttachReceipt(parseReceiptText(receipt.rawText)), true, receipt.name);
});
