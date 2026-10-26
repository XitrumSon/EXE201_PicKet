import assert from "node:assert/strict";
import test from "node:test";
import {scanReceiptSession,type ReceiptOcrSession,type OcrSample} from "./receipt-scan-session";
import type {ReceiptTextLine} from "./receipt-parser";
const cell=(text:string,left:number,top:number,width=70):ReceiptTextLine=>({text,left,right:left+width,top,bottom:top+15});
function vat():OcrSample{return {width:1000,height:1400,lines:[
 cell('PICKET DEMO',10,10,200),cell('HÓA ĐƠN',10,35,200),cell('Tên hàng hoá, dịch vụ',80,100,220),cell('Số lượng',440,100),cell('Đơn giá',590,100),cell('Thành tiền',780,100,110),
 cell('Bánh mẫu',60,160,200),cell('2',460,160,20),cell('25.000',620,160),cell('50.000',820,160),
 cell('Tiền hàng:',10,1000,130),cell('Tiền thuế:',10,1030,130),cell('Tiền thanh toán:',10,1060,160),cell('Tổng cộng',780,960,120),cell('50.000',820,1000),cell('4.000',820,1030),cell('54.000',820,1060),
 ]};}
function harness(options:{strongAt?:number;slow?:boolean;throwPreview?:boolean}={}){
 let clock=0;let selected=false;const events:string[]=[];
 const native:ReceiptOcrSession={open:async()=>{events.push('open');return {id:'test',width:3000,height:4200};},
 inspect:async()=>{events.push('inspect');if(options.slow)clock=25000;if(options.throwPreview)throw new Error('failed');return {...vat(),lines:vat().lines.map(line=>options.strongAt===180&&!selected?{...line,left:1000-line.right!,right:1000-line.left!,top:1400-line.bottom!,bottom:1400-line.top!,angle:180,confidence:0.95}:{...line,angle:0,confidence:0.95})};},
 select:async(_id,angle)=>{events.push(`select:${angle}`);selected=true;return {width:3000,height:4200};},
crop:async()=>{events.push('crop');return {width:3000,height:600,lines:[]};},close:async()=>{events.push('close');}};
 return {native,events,now:()=>clock};
}
test('upright VAT needs one native recognition and at most one detail crop',async()=>{
 const app=harness();const result=await scanReceiptSession('file:///sample.jpg',app.native,app.now);
 assert.equal(result.draft.amount,54000);assert.equal(app.events.filter(e=>e==='inspect').length,1);assert.equal(app.events.filter(e=>e.startsWith('preview:')).length,0);
 assert.equal(app.events.filter(e=>e==='full').length,0);assert.equal(app.events.filter(e=>e==='crop').length,1);assert.equal(app.events[0],'open');assert.equal(app.events.at(-1),'close');
});
test('upside-down VAT re-reads only the selected direction before trusting its text',async()=>{
 const app=harness({strongAt:180});const result=await scanReceiptSession('file:///sample.jpg',app.native,app.now);
 assert.equal(result.draft.amount,54000);assert.equal(app.events.filter(e=>e==='inspect').length,2);assert.equal(app.events.filter(e=>e.startsWith('preview:')).length,0);assert.ok(app.events.includes('select:180'));assert.equal(result.stats.fullReads,1);
});
test('no new native OCR or detail work starts after the processing budget expires',async()=>{
 const app=harness({slow:true});const result=await scanReceiptSession('file:///sample.jpg',app.native,app.now);
 assert.equal(result.budgetExceeded,true);assert.deepEqual(app.events,['open','inspect','close']);
});
test('failed native OCR always closes the sole image session',async()=>{
 const app=harness({throwPreview:true});await assert.rejects(()=>scanReceiptSession('file:///sample.jpg',app.native,app.now));assert.equal(app.events.at(-1),'close');
});

test('native direction and the initial full-image reading do not trigger a duplicate full pass',async()=>{
 const app=harness({strongAt:999});const result=await scanReceiptSession('file:///sample.jpg',app.native,app.now);
 assert.equal(result.draft.amount,54000);assert.equal(app.events.filter(e=>e==='full').length,0);
});
test('leaving the scan cancels subsequent OCR work and closes the session',async()=>{
 const app=harness(),controller=new AbortController();const original=app.native.inspect;
 app.native.inspect=async(...args)=>{const result=await original(...args);controller.abort();return result;};
 await assert.rejects(()=>scanReceiptSession('file:///sample.jpg',app.native,app.now,controller.signal),/OCR_CANCELLED/);
 assert.deepEqual(app.events,['open','inspect','close']);
});
