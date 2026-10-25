import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import ts from "typescript";
type Node={type:unknown;props:Record<string,unknown>};
function all(node:unknown):Node[]{if(Array.isArray(node))return node.flatMap(all);if(!node||typeof node!=="object"||!("props" in node))return [];const n=node as Node;return [n,...all(n.props.children)];}
function harness(){
 const slots:unknown[]=[];let cursor=0,owner="A",writes=0,schedules=0,release!:()=>void;
 const held=new Promise<void>(done=>{release=done;});
 const state=(initial:unknown)=>{const i=cursor++;if(!(i in slots))slots[i]=typeof initial==="function"?initial():initial;return [slots[i],(v:unknown)=>{slots[i]=typeof v==="function"?v(slots[i]):v;}];};
 const ref=(v:unknown)=>{const i=cursor++;return slots[i]??(slots[i]={current:v});};
 const effect=(fn:()=>unknown,deps:unknown[]=[])=>{const i=cursor++,old=slots[i] as {deps:unknown[];cleanup?:()=>void}|undefined;if(!old||deps.some((d,j)=>!Object.is(d,old.deps[j]))){old?.cleanup?.();slots[i]={deps,cleanup:fn()};}};
 const useCallback=(fn:unknown,deps:unknown[])=>{const i=cursor++,old=slots[i] as {deps:unknown[];fn:unknown}|undefined;if(!old||deps.some((d,j)=>!Object.is(d,old.deps[j])))slots[i]={deps,fn};return (slots[i] as {fn:unknown}).fn;};
 const adapters:Record<string,unknown>={
 "@/features/notifications/use-reminder-calendar":{useReminderCalendar:()=>({month:"2026-10",day:"2026-10-25",offset:-420,now:Date.now()})},
 react:{useState:state,useRef:ref,useEffect:effect,useLayoutEffect:effect,useMemo:(fn:()=>unknown)=>fn(),useCallback},
 "react/jsx-runtime":{jsx:(type:unknown,props:unknown)=>({type,props}),jsxs:(type:unknown,props:unknown)=>({type,props})},
 "react-i18next":{useTranslation:()=>({t:(key:string)=>key})},
 "expo-router":{useFocusEffect:(fn:()=>unknown)=>effect(fn,[fn])},
 "react-native":{Switch:"Switch",Text:"Text",StyleSheet:{create:(v:unknown)=>v}},
 "@/features/settings/appearance-provider":{useAppTheme:()=>({language:"vi"})},
 "@/core/theme/use-mobile-styles":{useMobileStyles:()=>({styles:{}})},
 "@/features/auth/auth-context":{useAuth:()=>({session:{user:{id:owner},access_token:owner},localMode:false})},
 "@/features/bills/bills-context":{useBills:()=>({bills:[]})},"@/features/budgets/budgets-context":{useBudgets:()=>({budgets:[]})},"@/features/subscriptions/subscriptions-context":{useSubscriptions:()=>({subscriptions:[]})},
 "@/features/transactions/use-transaction-history":{useTransactionHistory:()=>({transactions:[],loading:false})},"@/features/transactions/use-spending-splits":{useSpendingSplits:()=>({splits:[]})},"@/features/notifications/use-reminder-periods":{useReminderPeriods:()=>({periodsReady:true})},
 "@/features/notifications/keepsake-source":{loadReminderKeepsakes:async()=>[]},
 "@/features/notifications/reminders":{collectReminders:()=>[],remindersEnabled:async()=>false,readReminderIds:async()=>[],setRemindersEnabled:async()=>{writes++;await held;return true;},scheduleUserReminders:async()=>{schedules++;}},
 "@/core/ui/picket-ui":{PicketScreen:"Screen"},
 };
 const exports:{default?:()=>unknown}={};vm.runInNewContext(ts.transpileModule(readFileSync("src/app/notifications.tsx","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:(key:string)=>adapters[key]??{},Date});
 const render=()=>{cursor=0;return exports.default!();};
 const control=()=>{const n=all(render()).find(n=>n.type==="Switch");assert.ok(n);return n;};
 return {render,control,release,switchOwner:(next="B")=>{owner=next;render();},counts:()=>({writes,schedules})};
}
async function settle(){for(let i=0;i<5;i++)await new Promise(done=>setImmediate(done));}
test("rapid notification toggle callbacks dispatch one preference write",async()=>{const app=harness();app.render();await settle();const callback=app.control().props.onValueChange as (v:boolean)=>void;callback(true);callback(true);assert.equal(app.counts().writes,1);app.release();await settle();});
test("old owner toggle completion cannot enable or reschedule the new owner's reminders",async()=>{const app=harness();app.render();await settle();(app.control().props.onValueChange as (v:boolean)=>void)(true);app.switchOwner();await settle();app.release();await settle();assert.equal(app.control().props.value,false);assert.equal(app.counts().schedules,0);});

test("returning to the same owner cannot revive a retired screen operation",async()=>{const app=harness();app.render();await settle();(app.control().props.onValueChange as (v:boolean)=>void)(true);app.switchOwner("B");app.switchOwner("A");await settle();app.release();await settle();assert.equal(app.control().props.value,false);assert.equal(app.counts().schedules,0);});
