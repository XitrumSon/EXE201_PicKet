import assert from "node:assert/strict";
import test from "node:test";
import {parseReceiptLines,parseReceiptText,type ReceiptTextLine} from "./receipt-parser";

test("Vietnamese written calendar date is extracted rather than replaced by today",()=>{
 const result=parseReceiptText("PICKET DEMO\nNgày 06 Tháng 10 Năm 2026\nSan pham 145000\nTổng thanh toán 145000");
 assert.equal(result.date,"2026-10-06T00:00:00.000Z");
});
test("purchase document headings and websites are not merchant names",()=>{
 const result=parseReceiptText("PHIẾU MUA HÀNG\nwww.example.test\nPICKET DEMO STORE\nNgày 06 tháng 10 năm 2026\nSan pham 145000\nTổng thanh toán 145000");
 assert.equal(result.merchant,"PICKET DEMO STORE");
});
const cell=(text:string,left:number,top:number,width=70):ReceiptTextLine=>({text,left,right:left+width,top,bottom:top+15});
function table(){return [
 cell("PICKET DEMO STORE",10,10,200),cell("Ngày 06 tháng 10 năm 2026",10,35,240),
 cell("Tên sản phẩm",10,80,180),cell("SL",220,80,25),cell("Đơn giá",270,80),cell("BH",370,80,25),cell("Thành tiền",430,80,100),
 cell("Bàn phím demo",10,110,180),cell("Chuột demo",10,145,180),
 cell("2",220,110,25),cell("1",220,145,25),
 cell("120.000 đ",270,110),cell("85.000 đ",270,145),
 cell("24",370,110,25),cell("12",370,145,25),
 cell("240.000 đ",430,110,100),cell("85.000 đ",430,145,100),
 cell("Tổng thanh toán",270,200,130),cell("325.000 đ",430,200,100),
];}
test("separate OCR columns preserve each product quantity unit price and total",()=>{
 const result=parseReceiptLines(table());
 assert.equal(result.amount,325000);
 assert.deepEqual(result.lineItems.map(({name,quantity,unitPrice,total})=>({name,quantity,unitPrice,total})),[
  {name:"Bàn phím demo",quantity:2,unitPrice:120000,total:240000},
  {name:"Chuột demo",quantity:1,unitPrice:85000,total:85000},
 ]);
 assert.deepEqual(parseReceiptText(result.rawText).lineItems,result.lineItems);
});
test("inconsistent table quantity and prices are not silently accepted",()=>{
 const lines=table().map(line=>line.text==="240.000 đ"?{...line,text:"230.000 đ"}:line);
 assert.ok(!parseReceiptLines(lines).lineItems.some(line=>line.name==="Bàn phím demo"));
});
