import assert from "node:assert/strict";
import test from "node:test";
import {parseReceiptLines} from "./receipt-parser";

test("a payable amount in a separate OCR column is matched by its visual row",()=>{
 const result=parseReceiptLines([
  {text:"PICKET DEMO STORE",top:10,bottom:30,left:10,right:180},
  {text:"25/10/2026",top:40,bottom:60,left:10,right:100},
  {text:"Tổng thanh toán",top:300,bottom:320,left:150,right:260},
  {text:"Phí vận chuyển",top:230,bottom:250,left:150,right:260},
  {text:"0 đ",top:230,bottom:250,left:300,right:370},
  {text:"145.000 đ",top:301,bottom:321,left:300,right:390},
 ]);
 assert.equal(result.amount,145000);
});

test("a nearby amount on another row is not treated as the payable total",()=>{
 const result=parseReceiptLines([
  {text:"PICKET DEMO STORE",top:10,bottom:30,left:10,right:180},
  {text:"25/10/2026",top:40,bottom:60,left:10,right:100},
  {text:"Tổng thanh toán",top:300,bottom:320,left:150,right:260},
  {text:"Thông tin khác",top:340,bottom:360,left:150,right:260},
  {text:"145.000 đ",top:340,bottom:360,left:300,right:390},
 ]);
 assert.equal(result.amount,null);
});
