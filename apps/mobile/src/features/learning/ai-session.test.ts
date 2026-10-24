import assert from "node:assert/strict";
import { test } from "node:test";
import { createLearningAiSession, type LearningAiApi } from "./ai-session";

const id="66666666-1234-4321-8123-123456789011";
function setup(overrides:Partial<LearningAiApi>={}){
  const keys:string[]=[];
  const api:LearningAiApi={
    learningAiConsent:async()=>({accepted:true,generation:1,policyVersion:1}),
    setLearningAiConsent:async(_token,accepted)=>({accepted,generation:2,policyVersion:1}),
    enqueueLearningAi:async(_token,_request,key)=>{keys.push(key);return {id,status:"queued"};},
    learningAiJob:async()=>({id,status:"completed",statementIds:["timing"]}),
    deleteLearningAiHistory:async()=>undefined,
    ...overrides,
  };
  let count=0;
  const session=createLearningAiSession(api,"token",()=>`request_${++count}`);
  return {session,keys};
}
test("explicit consent required before generation and only fixed case sent",async()=>{
  const {session,keys}=setup();
  await session.generate("vi");
  assert.equal(keys.length,0);
  await session.load();
  await session.generate("vi");
  assert.equal(keys.length,1);
  await session.poll();
  assert.deepEqual(session.snapshot().job?.statementIds,["timing"]);
});
test("uncertain enqueue retry retains same key; no automatic generation",async()=>{
  const keys:string[]=[];
  const {session}=setup({enqueueLearningAi:async(_token,request,key)=>{
    assert.deepEqual(request,{scenarioId:"cash-gap-v1",locale:"vi"});
    keys.push(key);if(keys.length===1)throw new Error("lost response");return {id,status:"queued"};
  }});
  await session.load();await session.generate("vi");
  assert.equal(session.snapshot().error,"unavailable");
  await session.generate("vi");
  assert.deepEqual(keys,["request_1","request_1"]);
});
test("revocation suppresses late model result even if transport ignores abort",async()=>{
  let complete!:(value:unknown)=>void;
  const {session}=setup({learningAiJob:()=>new Promise(resolve=>{complete=resolve;})});
  await session.load();await session.generate("vi");
  const pending=session.poll();
  await session.setConsent(false);
  complete({id,status:"completed",statementIds:["buffer"]});
  await pending;
  assert.equal(session.snapshot().job,null);
  assert.equal(session.snapshot().consent?.accepted,false);
});
test("dispose suppresses old account results and aborts its requests",async()=>{
  let complete!:(value:unknown)=>void;let signal:AbortSignal|undefined;
  const {session}=setup({learningAiConsent:(_token,current)=>{signal=current;return new Promise(resolve=>{complete=resolve;});}});
  const pending=session.load();session.dispose();
  complete({accepted:true,generation:1,policyVersion:1});await pending;
  assert.equal(signal?.aborted,true);
  assert.equal(session.snapshot().consent,null);
});
test("history deletion cancels displayed result without revoking consent",async()=>{
  const {session}=setup();await session.load();await session.generate("vi");await session.poll();
  await session.clearHistory();
  assert.equal(session.snapshot().job,null);
  assert.equal(session.snapshot().consent?.accepted,true);
});
test("malformed model prose and mismatched job IDs never display",async()=>{
  for(const result of [{id,status:"completed",statementIds:["raw prose"]},{id:"other",status:"completed",statementIds:["timing"]}]){
    const {session}=setup({learningAiJob:async()=>result});
    await session.load();await session.generate("vi");await session.poll();
    assert.equal(session.snapshot().error,"unavailable");
    assert.notEqual(session.snapshot().job?.status,"completed");
  }
});
test("quota errors preserve retry key and show dedicated status",async()=>{
  const {session}=setup({enqueueLearningAi:async()=>{throw {status:429};}});
  await session.load();await session.generate("en");
  assert.equal(session.snapshot().error,"quota");
});
