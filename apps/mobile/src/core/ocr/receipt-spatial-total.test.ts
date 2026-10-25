import assert from "node:assert/strict";
import test from "node:test";
import {parseReceiptLines,parseReceiptText} from "./receipt-parser";
import {canAttachReceipt} from "./receipt-eligibility";

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
 assert.equal(canAttachReceipt(result),true);
 const restored=parseReceiptText(result.rawText);
 assert.equal(restored.amount,145000);
 assert.equal(restored.date,result.date);
 assert.equal(canAttachReceipt(restored),true);
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

test("two different amounts beside the total label require review",()=>{
 const result=parseReceiptLines([
  {text:"PICKET DEMO STORE",top:10,bottom:30,left:10,right:180},
  {text:"Tổng thanh toán",top:300,bottom:320,left:150,right:260},
  {text:"145.000 đ",top:301,bottom:321,left:300,right:390},
  {text:"160.000 đ",top:301,bottom:321,left:400,right:490},
 ]);
 assert.equal(result.amount,null);
 assert.equal(result.needsReview,true);
});

test("an invalid or left-hand coordinate does not authorize a spatial total",()=>{
 for(const left of [20,NaN]){
  const result=parseReceiptLines([
   {text:"PICKET DEMO STORE",top:10,bottom:30,left:10,right:180},
   {text:"Tổng thanh toán",top:300,bottom:320,left:150,right:260},
   {text:"Thông tin khác",top:340,bottom:360,left:150,right:260},
   {text:"145.000 đ",top:301,bottom:321,left,right:left+90},
  ]);
  assert.equal(result.amount,null);
 }
});
