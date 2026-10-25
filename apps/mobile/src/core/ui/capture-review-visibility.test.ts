import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

type Node = {type: string; props: Record<string,unknown>; children: unknown[]};
function render(eligible: boolean, recognizing = false) {
 const source=readFileSync(new URL("../../app/capture/index.tsx",import.meta.url),"utf8").replace(/\r\n/g,"\n");
 const start=source.indexOf("  return (\n    <SafeAreaView",source.indexOf("if (!hydrated)"));
 const end=source.indexOf("\n}",start);
 const exports:{render?:()=>Node}={};
 const noop=()=>{};
 const context:Record<string,unknown>={exports,element:(type:string,props:Record<string,unknown>,...children:unknown[])=>({type,props:props??{},children}),Fragment:"Fragment",
  styles:{},colors:{},imageUri:"file:///receipt.jpg",receiptEligible:eligible,isRecognizing:recognizing,isContinuing:false,isQueueingFallback:false,
  message:"Không nhận diện được hóa đơn hợp lệ.",ocrDurationMs:null,__DEV__:false,lineItems:[],serverFallbackEnabled:false,localMode:false,needsFallback:false,fallbackStatus:null,attachReceipt:false,
  title:"",amount:"",purchasedAt:"2026-10-26",calendarReceiptDay:()=>"2026-10-26",setTitle:noop,setAmount:noop,
 };
 for(const name of ["SafeAreaView","ScrollView","TopAppBar","Text","Image","View","AppIcon","Pressable","ActivityIndicator","TextInput"])context[name]=name;
 vm.runInNewContext(ts.transpileModule(`exports.render=()=>{${source.slice(start,end)}};`,{fileName:"capture.tsx",compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,jsxFactory:"element",jsxFragmentFactory:"Fragment"}}).outputText,context);
 const tree=exports.render!();const nodes:Node[]=[];const text:string[]=[];
 const visit=(value:unknown)=>{if(Array.isArray(value)){value.forEach(visit);return;}if(typeof value==="string"){text.push(value);return;}if(value&&typeof value==="object"&&"type" in value){const node=value as Node;nodes.push(node);node.children.forEach(visit);}};visit(tree);
 return {nodes,text:text.join(" ")};
}
test("unrecognized receipt shows recovery actions and alert without transaction inputs",()=>{
 const result=render(false);
 assert.equal(result.nodes.filter(node=>node.type==="TextInput").length,0);
 assert.doesNotMatch(result.text,/Kiểm tra và tạo giao dịch|Đính kèm ảnh vào giao dịch/);
 assert.doesNotMatch(result.text,/Xoay ảnh/);
 assert.match(result.text,/Chụp (?:ảnh|lại)/);assert.match(result.text,/Chọn từ thư viện/);
 assert.ok(result.nodes.some(node=>node.props.role==="alert"));
});
test("recognized receipt exposes the review fields and handoff",()=>{
 const result=render(true);assert.equal(result.nodes.filter(node=>node.type==="TextInput").length,3);
 assert.match(result.text,/Kiểm tra và tạo giao dịch/);
});
test("recognition in progress does not expose editable transaction fields",()=>{
 const result=render(false,true);assert.equal(result.nodes.filter(node=>node.type==="TextInput").length,0);
 assert.match(result.text,/Đang đọc hóa đơn/);
});
