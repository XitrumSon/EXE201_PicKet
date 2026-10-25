import assert from "node:assert/strict";
import test from "node:test";
import {emptyGuestFinance} from "../local/guest-finance";
import {validateGuestBackupPayload} from "./guest-backup-model";
const bill={id:"bill",title:"Rent",amount:100,dueAt:"2026-10-01",status:"pending",paidTransactionId:null};
const subscription={id:"sub",title:"Rent",amount:100,nextDueAt:"2026-10-01",cadence:"monthly",cycleMonths:1,active:true,note:"",alertDays:0,walletId:null,categoryId:null};
function payload(key:string,row:unknown){return {finance:{...emptyGuestFinance(),[key]:[row]},keepsakes:[],receipts:[],media:{}};}
test("restore rejects invalid bill amounts dates and status",()=>{
 for(const patch of [{amount:0},{amount:-1},{amount:0.5},{amount:9_000_000_000_001},{title:" "},{dueAt:"invalid"},{status:"unknown"}]) assert.throws(()=>validateGuestBackupPayload(payload("bills",{...bill,...patch})));
 assert.ok(validateGuestBackupPayload(payload("bills",bill)));
});
test("restore rejects invalid recurring schedule fields and retains custom legacy cadence",()=>{
 for(const patch of [{amount:0},{nextDueAt:"invalid"},{cadence:"unknown"},{cycleMonths:0},{cycleMonths:121},{alertDays:-1},{alertDays:366},{active:"yes"},{note:null},{walletId:"missing"},{categoryId:"missing"}]) assert.throws(()=>validateGuestBackupPayload(payload("subscriptions",{...subscription,...patch})));
 assert.ok(validateGuestBackupPayload(payload("subscriptions",{...subscription,cadence:"custom",cycleMonths:120,alertDays:365})));
});
