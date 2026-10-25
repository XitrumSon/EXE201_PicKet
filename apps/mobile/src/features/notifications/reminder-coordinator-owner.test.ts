import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import ts from "typescript";
test("new owner never calculates reminders from the previous owner's loaded keepsakes",async()=>{
 let owner="A",cursor=0;const slots:unknown[]=[],seen:string[][]=[];
 const state=(initial:unknown)=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],(value:unknown)=>{slots[i]=value;}];};
 const effect=(fn:()=>unknown,deps:unknown[])=>{const i=cursor++,old=slots[i] as {deps:unknown[];cleanup?:()=>void}|undefined;if(!old||deps.some((d,j)=>!Object.is(d,old.deps[j]))){old?.cleanup?.();slots[i]={deps,cleanup:fn()};}};
 const exports:{ReminderCoordinator?:()=>unknown}={};const empty:unknown[]=[];
 const adapters:Record<string,unknown>={
 react:{useState:state,useEffect:effect,useMemo:(fn:()=>unknown)=>fn()},
 "@/features/auth/auth-context":{useAuth:()=>({session:{user:{id:owner},access_token:owner}})},
 "@/features/settings/appearance-provider":{useAppTheme:()=>({language:"vi"})},
 "@/features/notifications/use-reminder-calendar":{useReminderCalendar:()=>({month:"2026-10",now:Date.now()})},
 "@/features/bills/bills-context":{useBills:()=>({bills:empty})},"@/features/budgets/budgets-context":{useBudgets:()=>({budgets:empty})},"@/features/subscriptions/subscriptions-context":{useSubscriptions:()=>({subscriptions:empty})},
 "@/features/transactions/use-transaction-history":{useTransactionHistory:()=>({transactions:empty,refresh:async()=>{}})},"@/features/transactions/use-spending-splits":{useSpendingSplits:()=>({splits:empty})},"./use-reminder-periods":{useReminderPeriods:()=>({periodsReady:true})},
 "@/core/api/client":{picketApi:{listKeepsakes:async(token:string)=>token==="A"?{keepsakes:[{id:"private-A",title:"A's item",purchasedAt:"2026-10-01"}]}:new Promise(()=>{})}},
 "@/features/keepsakes/keepsake-store":{listKeepsakes:async()=>[],onKeepsakesChanged:()=>()=>{}},"@/features/keepsakes/cloud-keepsakes":{onCloudKeepsakesChanged:()=>()=>{}},
 "@/features/notifications/reminders":{cancelUserReminders:async()=>{},scheduleUserReminders:async()=>{},collectReminders:(input:{keepsakes:{id:string}[]})=>{seen.push(input.keepsakes.map(item=>item.id));return []; }},
 };
 vm.runInNewContext(ts.transpileModule(readFileSync(new URL("./reminder-coordinator.tsx",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:(key:string)=>adapters[key]??{},Date});
 const render=()=>{cursor=0;exports.ReminderCoordinator!();};render();for(let i=0;i<5;i++)await new Promise(done=>setImmediate(done));render();assert.equal(seen.at(-1)?.join(","),"private-A");
 owner="B";render();assert.equal(seen.at(-1)?.length,0);
});
