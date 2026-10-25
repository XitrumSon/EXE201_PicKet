import assert from "node:assert/strict";
import test from "node:test";
import { parseReceiptLines, parseReceiptText, type ReceiptTextLine } from "./receipt-parser";
import { canAttachReceipt } from "./receipt-eligibility";

const cell = (text: string, left: number, top: number, width = 95): ReceiptTextLine =>
  ({ text, left, right: left + width, top, bottom: top + 16 });
function invoice(): ReceiptTextLine[] {
  return [
    cell("PICKET DEMO STORE", 20, 10, 250), cell("07/05/2026", 750, 50),
    cell("Tiền hàng:", 20, 900), cell("Tiền thuế:", 20, 925),
    cell("Tiền thanh toán:", 20, 950, 150),
    cell("Thuế suất 8%", 500, 890), cell("Tổng cộng", 900, 880),
    cell("150.000", 920, 925), cell("12.000", 920, 950), cell("162.000", 920, 975),
  ];
}

test("a skewed VAT summary uses the total column and checked subtotal plus tax", () => {
  const result = parseReceiptLines(invoice());
  assert.equal(result.amount, 162000);
  assert.equal(canAttachReceipt(result), true);
  assert.equal(parseReceiptText(result.rawText).amount, 162000);
  assert.equal(canAttachReceipt(parseReceiptText(result.rawText)), true);
});

test("an inconsistent VAT summary cannot authorize a guessed total", () => {
  const lines = invoice().map(line => line.text === "162.000" ? {...line, text: "172.000"} : line);
  assert.equal(parseReceiptLines(lines).amount, null);
});

test("an extra amount in the VAT total column requires review", () => {
  assert.equal(parseReceiptLines([...invoice(), cell("99.000", 920, 1000)]).amount, null);
});

test("VAT amount association requires the explicit summary total column", () => {
  assert.equal(parseReceiptLines(invoice().filter(line => line.text !== "Tổng cộng")).amount, null);
});
