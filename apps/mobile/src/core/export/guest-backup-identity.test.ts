import assert from "node:assert/strict";
import test from "node:test";
import {emptyGuestFinance} from "../local/guest-finance";
import {validateGuestBackupPayload} from "./guest-backup-model";
for(const collection of ["categories","budgets","bills","subscriptions"] as const){
 test("restore rejects duplicate IDs in "+collection,()=>{
  const finance=emptyGuestFinance();
  Object.assign(finance,{[collection]:[{id:"same"},{id:"same"}]});
  assert.throws(()=>validateGuestBackupPayload({finance,keepsakes:[],receipts:[],media:{}}));
 });
}
