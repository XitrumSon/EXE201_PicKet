import assert from "node:assert/strict";
import test from "node:test";
import {applyGuestMutation,emptyGuestFinance,type GuestFinance,type GuestMutation} from "./guest-finance";
const timestamp="2026-10-01T12:00:00Z";
const request:Extract<GuestMutation,{type:"reconcile.apply"}>={type:"reconcile.apply",id:"r1",accountId:"cash",statementDate:"2026-10-01",statementBalance:80,selectedTransactionIds:["spent"],reason:"Reviewed",occurredAt:timestamp};
function initial():GuestFinance{return {...emptyGuestFinance(),accounts:[{id:"cash",name:"Cash",kind:"cash" as const,currencyCode:"VND",openingBalance:100,archived:false,version:1,createdAt:timestamp,updatedAt:timestamp,deletedAt:null}],transactions:[{id:"spent",title:"Meal",amount:20,kind:"expense" as const,accountId:"cash",destinationAccountId:null,categoryId:null,occurredAt:timestamp,note:"",refundOfTransactionId:null,version:1,createdAt:timestamp,updatedAt:timestamp,deletedAt:null}]};}

test("zero-adjustment reconciliation replay after restart does not touch transaction versions",()=>{
 const saved=applyGuestMutation(initial(),request),restarted=JSON.parse(JSON.stringify(saved));
 assert.equal(applyGuestMutation(restarted,{...request,occurredAt:"2026-10-02T00:00:00Z"}),restarted);
 assert.equal(restarted.transactions[0].version,2);
});
test("completed reconciliation replay cannot undo a later reconciliation",()=>{
 const first=applyGuestMutation(initial(),request);
 const second=applyGuestMutation(first,{...request,id:"r2",selectedTransactionIds:[],statementBalance:100});
 assert.deepEqual(second.transactions[0].reconciledAccountIds,[]);
 assert.equal(applyGuestMutation(second,request),second);
});
test("reconciliation request identity rejects changed canonical details",()=>{
 const saved=applyGuestMutation(initial(),{...request,statementBalance:90});
 for(const change of [{statementBalance:91},{accountId:"other"},{statementDate:"2026-10-02"},{reason:"Changed"},{selectedTransactionIds:[]}])assert.throws(()=>applyGuestMutation(saved,{...request,statementBalance:90,...change}));
});
test("deleted adjustment cannot be recreated by retrying its completed request",()=>{
 const saved=applyGuestMutation(initial(),{...request,statementBalance:90});
 const removed=applyGuestMutation(saved,{type:"transaction.archive",id:request.id});
 assert.equal(applyGuestMutation(JSON.parse(JSON.stringify(removed)),{...request,statementBalance:90}).transactions.length,1);
});
test("invalid calendar dates, deleted rows and oversized adjustments reject before mutation",()=>{
 assert.throws(()=>applyGuestMutation(initial(),{...request,statementDate:"2026-02-31"}));
 assert.throws(()=>applyGuestMutation(initial(),{...request,statementBalance:-9_000_000_000_000}));
 const deleted=initial();deleted.transactions[0]={...deleted.transactions[0],deletedAt:timestamp};
 assert.throws(()=>applyGuestMutation(deleted,request));
});
