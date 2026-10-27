import { paperShape, paperSpace } from "../theme/paper-foundations";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { prepareCapture } from "../ocr/capture-work";
import { restoreCaptureSnapshot } from "../ocr/capture-journal";

type Element={type:unknown;props:Record<string,unknown>};
function harness() {
  const slots:unknown[]=[];let cursor=0;
  const effects:(()=>unknown)[]=[];let focusEffect:(()=>unknown)|undefined;
  const calls={load:0,imageRestore:0,recognize:0,persist:0};
  let finishPersist!:(value:{id:string;imageRef:string})=>void;
  const persistence=new Promise<{id:string;imageRef:string}>(resolve=>{finishPersist=resolve;});
  const saved={version:1 as const,id:"old",imageRef:"file:///old.enc",title:"Old store",amount:"1000",purchasedAt:"2026-10-26T00:00:00.000Z",explicitDate:null,attachReceipt:true,provider:"manual" as const,localConfidence:0,needsFallback:false,rawText:null,lineItems:[],fallbackStoragePath:null};
  const hooks={
    useState(initial:unknown){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==="function"?(initial as ()=>unknown)():initial;return [slots[i],(value:unknown)=>{slots[i]=typeof value==="function"?(value as (previous:unknown)=>unknown)(slots[i]):value;}];},
    useRef(initial:unknown){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
    useMemo(fn:()=>unknown){cursor++;return fn();},
    useEffect(fn:()=>unknown,deps:unknown[]){const i=cursor++;const old=slots[i] as unknown[]|undefined;if(!old||deps.some((value,index)=>!Object.is(value,old[index]))){slots[i]=deps;effects.push(fn);}},
    useCallback(fn:unknown){cursor++;return fn;},
  };
  const element=(type:unknown,props:Record<string,unknown>):Element=>({type,props});
  const fallback=new Proxy({}, {get:(_target,key)=>String(key)});
  const modules:Record<string,unknown>={
    "@/core/ui/picket-text": { PicketText: "Text" },
    "@/core/ui/picket-scroll-view": { PicketScrollView: "ScrollView" },
    "@/core/theme/paper-foundations": { paperShape, paperSpace },
    react:hooks,"react/jsx-runtime":{jsx:element,jsxs:element},
    "react-native":{...Object.fromEntries(["ActivityIndicator","Image","ScrollView","Text","View"].map(name=>[name,name])),StyleSheet:{create:(value:unknown)=>value},Alert:{}},
    "react-native-safe-area-context":{SafeAreaView:"SafeAreaView"},
    "expo-crypto":{randomUUID:()=>"operation"},
    "expo-router":{router:{back(){},replace(){},push(){}},useLocalSearchParams:()=>({}),useFocusEffect:(fn:()=>unknown)=>{focusEffect=fn;}},
    "@/core/theme/use-mobile-styles":{useMobileStyles:()=>({colors:fallback,styles:fallback})},
    "@/features/auth/auth-context":{useAuth:()=>({session:{user:{id:"owner"}},localMode:false})},
    "@/core/ui/receipt-flow-policy":{receiptCalendarDate:()=>null,receiptCaptureDate:()=>saved.purchasedAt},
    "@/core/ui/receipt-calendar":{calendarReceiptDay:()=>"2026-10-26"},
    "@/core/i18n/formatters":{formatMoney:(amount:number)=>String(amount)},
    "@/core/ocr/capture-work":{prepareCapture},
    "@/core/ocr/capture-journal":{restoreCaptureSnapshot},
    "@/core/ocr/capture-storage":{
      captureJournal:{load:async()=>{calls.load++;return saved;},save:async()=>true},
      cleanupCaptureImages:async()=>{},pickerRecovery:{pending:async()=>false},
      restoreCaptureImage:async()=>{calls.imageRestore++;return "file:///old.jpg";},
      persistCaptureImage:()=>{calls.persist++;return persistence;},
    },
    "@/core/ocr/receipt-eligibility":{canAttachReceipt:()=>true},
    "@/core/ocr/mlkit-receipt-ocr":{recognizeReceipt:async()=>{calls.recognize++;return {durationMs:10,draft:{rawText:"sample",amount:1000,merchant:"Store",date:saved.purchasedAt,lineItems:[],needsReview:false,recognizedLineCount:4,amountConfidence:1}};}},
  };
  const source=readFileSync(new URL("../../app/capture/index.tsx",import.meta.url),"utf8");
  const exports:{default?:()=>Element}={};
  vm.runInNewContext(ts.transpileModule(source,{fileName:"capture.tsx",compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,
    {exports,require:(name:string)=>modules[name]??fallback,process:{env:{}},AbortController,__DEV__:false,console:{info(){}}});
  const render=()=>{cursor=0;return exports.default!();};
  const flush=async()=>{for(const effect of effects.splice(0))effect();await new Promise(resolve=>setImmediate(resolve));};
  return {render,flush,calls,focus:()=>focusEffect?.(),finishPersist:()=>finishPersist({id:"new",imageRef:"file:///new.enc"})};
}

test("entering capture opens camera without reading or decrypting the old draft",async()=>{
  const app=harness();let tree=app.render();await app.flush();tree=app.render();
  assert.equal(tree.type,"ReceiptCamera");
  assert.deepEqual(app.calls,{load:0,imageRestore:0,recognize:0,persist:0});
  assert.equal(tree.props.onResumeDraft,undefined);
});

test("a new capture starts recognition and displays processing before photo persistence completes",async()=>{
  const app=harness();app.render();await app.flush();const camera=app.render();
  (camera.props.onCapture as (uri:string)=>void)("file:///new.jpg");
  await app.flush();const tree=app.render();
  assert.equal(app.calls.recognize,1);assert.equal(app.calls.persist,1);
  assert.notEqual(tree.type,"ReceiptCamera");
  assert.match(JSON.stringify(tree),/Đang đọc hóa đơn/);
  assert.doesNotMatch(JSON.stringify(tree),/Kiểm tra và tạo giao dịch/);
  app.finishPersist();await app.flush();
});

test("returning to the capture route opens camera while preserving explicit draft recovery",async()=>{
  const app=harness();app.render();await app.flush();const camera=app.render();
  (camera.props.onCapture as (uri:string)=>void)("file:///new.jpg");
  await app.flush();app.finishPersist();await app.flush();app.render();
  app.focus();const tree=app.render();
  assert.equal(tree.type,"ReceiptCamera");assert.equal(app.calls.load,0);
});
