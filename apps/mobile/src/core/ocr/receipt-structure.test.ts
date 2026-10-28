import assert from "node:assert/strict";
import test from "node:test";
import {parseReceiptLines,parseReceiptLineItems,parseReceiptText,type ReceiptTextLine} from "./receipt-parser";

test("contact, address, operator and document metadata never become products",()=>{
 const junk=["Đường số 24 KDC An Khánh 700000","Q. Ninh Kiều - TP. Cần Thơ 900000","123 Nguyễn Trãi, P. 7, Q. 5 700000","SĐT khách: 0901234567","Điện thoại 0901234567","Mã thẻ: A 10000001234","Store: HN 2025","Thu ngân: Minh 1234","Số hóa đơn 0000123456","Bàn 05","In lúc 12:30","Cảm ơn quý khách 2026","STK 123456789000","Ngày 28/10/2026"];
 assert.deepEqual(parseReceiptLineItems(junk.map(text=>({text}))),[]);
});

test("metadata does not win merchant selection when the shop name is missing",()=>{
 const parsed=parseReceiptText("THU NGÂN: AN\n123 Nguyễn Trãi, P.7, Q.5\nSĐT 0901234567\nGiá bán (có VAT)\nTổng 45000");
 assert.equal(parsed.merchant,null);
 assert.equal(parsed.lineItems.length,0);
});

test("retail product digits and sizes are preserved",()=>{
 const parsed=parseReceiptLineItems([{text:"7UP 330ml 2 x 12000 | 24000"},{text:"Sữa tươi 1L 1 x 30000 | 30000"}]);
 assert.deepEqual(parsed.map(p=>p.name),["7UP 330ml","Sữa tươi 1L"]);
});

const cell=(text:string,left:number,top:number,width=50):ReceiptTextLine=>({text,left,right:left+width,top,bottom:top+16,confidence:.95});
test("POS aliases and table-border artifacts retain all four product fields",()=>{
 const lines=[cell("PICKET CAFE",10,10,160),cell("Mặt hàng",10,100,100),cell("SL",220,99,25),cell("Giá",270,96),cell("T.Tiền",350,94),
 cell("Cà phê đá",10,130,100),cell("2",225,129,10),cell("10,000",270,127),cell("20,000",350,125),
 cell("Cơm tấm",10,160,100),cell("1",225,159,10),cell("17,000|",270,157),cell("17,000",350,155),cell("Tổng",10,200),cell("37,000",350,200)];
 const r=parseReceiptLines(lines);
 assert.deepEqual(r.lineItems.map(({name,quantity,unitPrice,total})=>({name,quantity,unitPrice,total})),[{name:"Cà phê đá",quantity:2,unitPrice:10000,total:20000},{name:"Cơm tấm",quantity:1,unitPrice:17000,total:17000}]);
 assert.equal(r.amount,37000);
 assert.equal(parseReceiptText(r.rawText).lineItems.length,2);
});

test("product-looking footer is outside a recognized table",()=>{
 const r=parseReceiptText("PICKET SHOP\nMặt hàng SL Đơn giá Thành tiền\nBánh mì 2 x 20000 | 40000\nTổng 40000\nƯu đãi lần sau 100000\nMã thành viên 12345678");
 assert.deepEqual(r.lineItems.map(i=>i.name),["Bánh mì"]);
});
