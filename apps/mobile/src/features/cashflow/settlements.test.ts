import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveSettlements,type SettlementLink } from "./settlements";
import { parseLedgerSnapshot } from "./ledger-snapshot";
const time="2026-10-24T12:00:00Z";
const snapshot=parseLedgerSnapshot({asOf:time,wallets:[{id:"cash",name:"Cash",currencyCode:"VND",openingBalance:100000,archived:false,deletedAt:null,updatedAt:time}],entries:[{id:"paid",accountId:"cash",destinationAccountId:null,kind:"expense",amount:19000,occurredAt:time,deletedAt:null,updatedAt:time}],confirmations:[{transactionId:"paid",source:"cloud-verified",confirmedAt:time}]});
const occurrence={id:"rent:2026-10-24",day:"2026-10-24",amount:-19000,currency:"VND",settled:false};
const link:SettlementLink={occurrenceId:occurrence.id,day:occurrence.day,amount:occurrence.amount,currency:"VND",transactionId:"paid",transactionUpdatedAt:time};
test("only explicitly linked confirmed movements settle an occurrence without mutating facts",()=>{
 const before=JSON.stringify(snapshot);
 assert.deepEqual(resolveSettlements(snapshot,["cash"],"VND",[occurrence],[]),[]);
 assert.deepEqual(resolveSettlements(snapshot,["cash"],"VND",[occurrence],[link]),[occurrence.id]);
 assert.equal(JSON.stringify(snapshot),before);
});
test("changed schedules or transactions, duplicates, wrong directions and transfers reject",()=>{
 for(const change of [{amount:-18000},{day:"2026-10-25"},{currency:"USD"},{transactionId:"missing"},{transactionUpdatedAt:"2026-10-23T12:00:00Z"}])assert.throws(()=>resolveSettlements(snapshot,["cash"],"VND",[occurrence],[{...link,...change}]));
 assert.throws(()=>resolveSettlements(snapshot,["cash"],"VND",[occurrence],[link,link]));
 const second={...occurrence,id:"second:2026-10-24"};
 assert.throws(()=>resolveSettlements(snapshot,["cash"],"VND",[occurrence,second],[link,{...link,occurrenceId:second.id}]));
 for(const kind of ["income","refund","transfer"]){
  assert.throws(()=>resolveSettlements({...snapshot,entries:[{...snapshot.entries[0],kind}]},["cash"],"VND",[occurrence],[link]));
 }
 assert.throws(()=>resolveSettlements({...snapshot,confirmations:[]},["cash"],"VND",[occurrence],[link]));
 assert.throws(()=>resolveSettlements({...snapshot,entries:[{...snapshot.entries[0],deletedAt:time}]},["cash"],"VND",[occurrence],[link]));
});
