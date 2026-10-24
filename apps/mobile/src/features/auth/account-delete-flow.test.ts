import assert from "node:assert/strict";
import {test} from "node:test";
import {deleteAccountWithLocalRetirement} from "./account-delete-flow";
import {createObservationStore} from "../cashflow/forecast-observation-store";
test("local retirement precedes remote deletion and sign-out failure never reclassifies a confirmed deletion",async()=>{
 const order:string[]=[];
 const result=await deleteAccountWithLocalRetirement({retireLocal:async()=>{order.push("retire");},resumeLocal:async()=>{order.push("resume");},deleteRemote:async()=>{order.push("delete");},signOut:async()=>{order.push("signout");throw Error("storage");},isCurrent:()=>true});
 assert.deepEqual(order,["retire","delete","signout"]);assert.deepEqual(result,{status:"deleted",signedOut:false});
});
test("cleanup failure prevents remote deletion; uncertain remote outcome resumes local use without claiming success",async()=>{
 let remote=0,resumed=0;
 const base={retireLocal:async()=>{},resumeLocal:async()=>{resumed++;},deleteRemote:async()=>{remote++;throw Error("lost response");},signOut:async()=>{throw Error("must not sign out");},isCurrent:()=>true};
 assert.equal((await deleteAccountWithLocalRetirement({...base,retireLocal:async()=>{throw Error("disk full");}})).status,"local-cleanup-failed");assert.equal(remote,0);
 assert.equal((await deleteAccountWithLocalRetirement(base)).status,"remote-unconfirmed");assert.equal(resumed,1);
});
test("a changed session never signs out a newly selected owner",async()=>{
 let current=true,signouts=0;
 const result=await deleteAccountWithLocalRetirement({retireLocal:async()=>{},resumeLocal:async()=>{},deleteRemote:async()=>{current=false;},signOut:async()=>{signouts++;},isCurrent:()=>current});
 assert.deepEqual(result,{status:"deleted",signedOut:true});assert.equal(signouts,0);
});
test("retirement can erase corrupt local capture data and fences queued stale writes across a restart",async()=>{
 const data=new Map<string,unknown>([["a",{broken:true}]]);const source={read:async(o:string)=>structuredClone(data.get(o)),write:async(o:string,d:unknown)=>{data.set(o,structuredClone(d));},newId:()=>"case",now:()=>"2026-10-24T12:00:00Z"};
 const store=createObservationStore(source);await store.retireOwner("a");assert.deepEqual((await store.load("a")).cases,[]);
 const restarted=createObservationStore(source);await assert.rejects(restarted.clear("a",0));
 await restarted.resumeOwner("a");assert.equal((await restarted.load("a")).cases.length,0);
 assert.equal(data.has("b"),false);
});
