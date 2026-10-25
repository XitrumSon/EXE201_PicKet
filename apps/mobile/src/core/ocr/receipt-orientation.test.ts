import assert from "node:assert/strict";
import test from "node:test";
import {recognizeReceiptOrientations,type ReceiptAngle} from "./receipt-orientation";
import {parseReceiptText} from "./receipt-parser";
const invalid=()=>parseReceiptText("Không đọc được");
const valid=()=>parseReceiptText("PICKET DEMO\n26/10/2026\nCa phe 25000\nTong cong 25000");
for(const target of [0,90,180,270] as const) test(`automatically reads a receipt at ${target} degrees and releases every temporary image`,async()=>{
 const attempts:ReceiptAngle[]=[],disposed:ReceiptAngle[]=[];
 const result=await recognizeReceiptOrientations({
  prepare:async angle=>{attempts.push(angle);return {uri:String(angle),dispose:()=>{disposed.push(angle);}};},
  recognize:async uri=>Number(uri)===target?valid():invalid(),
 });
 assert.equal(result.amount,25000);
 assert.deepEqual(attempts,[0,90,180,270].slice(0,[0,90,180,270].indexOf(target)+1));
 assert.deepEqual(disposed,attempts);
});
test("all unreadable orientations stay unaccepted and stop after four attempts",async()=>{
 const attempts:number[]=[];const result=await recognizeReceiptOrientations({prepare:async angle=>{attempts.push(angle);return {uri:String(angle),dispose:()=>{}};},recognize:async()=>invalid()});
 assert.equal(result.amount,null);assert.equal(attempts.length,4);
});
test("failed recognition releases its temporary image and may recover at another angle",async()=>{
 const disposed:number[]=[];const result=await recognizeReceiptOrientations({prepare:async angle=>({uri:String(angle),dispose:()=>{disposed.push(angle);}}),recognize:async uri=>{if(uri==='0')throw new Error('native failure');return valid();}});
 assert.equal(result.amount,25000);assert.deepEqual(disposed,[0,90]);
});
