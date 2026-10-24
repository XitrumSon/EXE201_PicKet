import assert from "node:assert/strict";
import { test } from "node:test";
import { createScheduleSyncStore } from "./schedule-sync-store";
const row={id:"44444444-1234-4321-8123-123456789011",startDay:"2026-10-24",frequency:"monthly" as const,amount:-19000,currency:"VND",active:true};
const empty={schemaVersion:1 as const,revision:0,schedules:[]};
test("offline schedule writes and request keys survive restart and failed transmission",async()=>{
  let value:unknown;let key=0;
  const storage={read:async()=>value,write:async(_:string,next:unknown)=>{value=next;}};
  const store=createScheduleSyncStore(storage,()=>`schedule-key-${++key}`);
  await store.save("ownerA",0,row);
  const keys:string[]=[];
  await assert.rejects(store.sync("ownerA",async()=>empty,async operation=>{keys.push(operation.key);throw new Error("offline");}));
  const restarted=createScheduleSyncStore(storage,()=>`schedule-key-${++key}`);
  const result=await restarted.sync("ownerA",async()=>empty,async operation=>{
    keys.push(operation.key);return{schemaVersion:1,revision:1,appliedRevision:1,schedules:[row]};
  });
  assert.equal(result.schedules.length,1);assert.equal(keys.length,2);assert.equal(keys[0],keys[1]);
});
test("different cloud schedules never overwrite unlinked local data",async()=>{
  let value:unknown;const store=createScheduleSyncStore({read:async()=>value,write:async(_,next)=>{value=next;}},()=>"schedule-stable-key");
  await store.save("ownerA",0,row);
  await assert.rejects(store.sync("ownerA",async()=>({...empty,revision:1,schedules:[{...row,amount:-49000}]}),async()=>{throw new Error("Must not send");}));
  assert.equal((await store.load("ownerA")).schedules[0].amount,-19000);
});
