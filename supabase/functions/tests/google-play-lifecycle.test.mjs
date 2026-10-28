import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {createHash} from "node:crypto";
import vm from "node:vm";
const require=createRequire(new URL("../../../apps/mobile/package.json",import.meta.url));
const ts=require("typescript");
const digest=value=>createHash("sha256").update(value).digest("hex");
function harness(state="SUBSCRIPTION_STATE_ACTIVE"){
 const owner="synthetic-owner",token="synthetic-test-purchase";const records=[],metadata=[],requests=[];
 let now=Date.parse("2026-10-28T00:00:00Z"),ack="ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",mismatch=false,testPurchase=false,callback;
 let current=state,expired=false;
 const client={rpc:async(_name,value)=>{(_name==="record_play_purchase_metadata"?metadata:records).push(value);return {error:null};},from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{user_id:owner},error:null})})})})};
 class SignJWT{setProtectedHeader(){return this;}setIssuer(){return this;}setAudience(){return this;}setIssuedAt(){return this;}setExpirationTime(){return this;}async sign(){return "synthetic-google-assertion";}}
 const auth={admin:()=>client,json:(value,status=200)=>Response.json(value,{status}),sha256:async value=>digest(value)};
 const exports={};
 const context={URLSearchParams,URL,Request,Response,TextDecoder,atob,exports,require:key=>key.includes("jose")?{importPKCS8:async()=>({}),SignJWT}:auth,Deno:{env:{get:()=>JSON.stringify({client_email:"test@example.test",private_key:"synthetic"})}},AbortSignal,Date:class extends Date{static now(){return now;}},fetch:async(url,options)=>{
  requests.push({url:String(url),method:options?.method??"GET"});
  if(String(url).includes("oauth2.googleapis.com"))return Response.json({access_token:"synthetic-access"});
  if(String(url).endsWith(":acknowledge"))return new Response(null,{status:204});
  return Response.json({...(testPurchase?{testPurchase:{}}:{}),subscriptionState:current,acknowledgementState:ack,externalAccountIdentifiers:{obfuscatedExternalAccountId:digest(mismatch?"foreign-owner":owner)},lineItems:[{productId:"picket_plus_monthly",expiryTime:new Date(now+(expired?-60000:60000)).toISOString()}]});
 }};
 const load=(file,target,adapters)=>vm.runInNewContext(ts.transpileModule(readFileSync(new URL(file,import.meta.url),"utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,{...context,exports:target,require:key=>adapters?.[key]??context.require(key)});
 load("../_shared/google_play.ts",exports);
 const startWebhook=()=>{const target={};context.Deno.serve=handler=>{callback=handler;};context.Deno.env.get=name=>name==="GOOGLE_PLAY_RTDN_AUDIENCE"?"https://example.test/rtdn":name==="GOOGLE_PLAY_RTDN_SERVICE_ACCOUNT_EMAIL"?"push@example.test":JSON.stringify({client_email:"test@example.test",private_key:"synthetic"});load("../play-notifications/index.ts",target,{"npm:jose@6.1.0":{createRemoteJWKSet:()=>({}),jwtVerify:async()=>({payload:{email:"push@example.test",email_verified:true}})},"../_shared/auth.ts":auth,"../_shared/google_play.ts":exports});};
 return {records,metadata,setTest:()=>{testPurchase=true;},requests,verify:()=>exports.verifyPlayPurchase(owner,token,"picket_plus_monthly"),setState:v=>{current=v;},expire:()=>{expired=true;},setAck:v=>{ack=v;},wrongOwner:()=>{mismatch=true;},startWebhook,notify:async(type,eventTimeMillis="1")=>callback(new Request("https://example.test/rtdn",{method:"POST",headers:{authorization:"Bearer synthetic-oidc"},body:JSON.stringify({message:{data:Buffer.from(JSON.stringify({packageName:"com.picket.mobile",eventTimeMillis,subscriptionNotification:{purchaseToken:token,notificationType:type}})).toString("base64")}})}))};
}
for(const [state,active] of [["ACTIVE",true],["IN_GRACE_PERIOD",true],["CANCELED",true],["ON_HOLD",false],["PAUSED",false],["PENDING",false],["EXPIRED",false],["PENDING_PURCHASE_CANCELED",false]])test(`Google ${state} controls entitlement and acknowledgement`,async()=>{
 const h=harness("SUBSCRIPTION_STATE_"+state);h.setAck("ACKNOWLEDGEMENT_STATE_PENDING");const value=await h.verify();assert.equal(value.active,active);assert.equal(h.records.at(-1).p_active,active);assert.equal(h.requests.some(r=>r.url.endsWith(":acknowledge")),active);
});
test("another Picket account cannot claim the same Google purchase",async()=>{const h=harness();h.wrongOwner();await assert.rejects(h.verify,/Account mismatch/);assert.equal(h.records.length,0);});
test("RTDN duplicates and stale event types re-query current Google authority",async()=>{
 const h=harness();h.startWebhook();
 for(const type of [2,2,12,3])assert.equal((await h.notify(type)).status,200);
 assert.equal(h.records.length,4);assert.ok(h.records.every(r=>r.p_active));assert.equal(new Set(h.records.map(r=>r.p_hash)).size,1);
 h.setState("SUBSCRIPTION_STATE_EXPIRED");assert.equal((await h.notify(2,"0")).status,200);assert.equal(h.records.at(-1).p_active,false);
});

test("canceled and active subscriptions never grant rights past expiry",async()=>{for(const state of ["ACTIVE","CANCELED"]){const h=harness("SUBSCRIPTION_STATE_"+state);h.expire();const result=await h.verify();assert.equal(result.active,false);assert.equal(result.tier,"free");}});

test("verified Google license tests are separate from paid purchases",async()=>{
 const live=harness();await live.verify();assert.equal(live.metadata[0].p_is_test,false);
 const license=harness();license.setTest();license.setAck("ACKNOWLEDGEMENT_STATE_PENDING");await license.verify();
 assert.equal(license.metadata[0].p_is_test,true);
 assert.equal(license.metadata[0].p_ack,"ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED");
 assert.equal(license.records[0].p_active,true);
});
