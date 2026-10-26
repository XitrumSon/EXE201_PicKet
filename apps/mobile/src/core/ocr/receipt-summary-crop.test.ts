import assert from "node:assert/strict";
import test from "node:test";
import { receiptSummaryCrop } from "./receipt-summary-crop";

test("a skewed VAT summary crop includes labels, total heading and three amount rows", () => {
  const region = receiptSummaryCrop([
    {text:"Tiền hàng:",left:10,right:100,top:1000,bottom:1020},
    {text:"Tiền thuế:",left:10,right:100,top:1030,bottom:1050},
    {text:"Tiền thanh toán:",left:10,right:150,top:1060,bottom:1080},
    {text:"Tổng cộng",left:800,right:900,top:960,bottom:980},
  ], 1000, 1400);
  assert.ok(region);
  assert.equal(region.originX,0);assert.equal(region.width,1000);
  assert.ok(region.originY<=960);
  assert.ok(region.originY+region.height>=1120);
  assert.ok(region.height<=1400/2);
});

test("payment-method/contact text alone never authorizes a summary crop", () => {
  assert.equal(receiptSummaryCrop([{text:"Hình thức thanh toán: CK / TM ĐT: 0901234567",left:10,right:900,top:100,bottom:120}],1000,1400),null);
});
