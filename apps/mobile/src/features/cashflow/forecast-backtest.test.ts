import assert from "node:assert/strict";
import {test} from "node:test";
import {runForecastBacktest,type BacktestDataset} from "./forecast-backtest";
import {syntheticBacktestOrigin} from "./synthetic-backtest-fixture";
const dataset=():BacktestDataset=>({version:"synthetic-v1",source:{kind:"synthetic",reference:"unit-fixtures-v1"},evaluatedAt:"2026-12-01T00:00:00Z",origins:[syntheticBacktestOrigin()]});
test("frozen F0/F1 share truth and report paired improvement without promoting a model",()=>{
 const input=dataset(),before=structuredClone(input);const result=runForecastBacktest(input);
 assert.equal(result.origins[0].f0?.mae,4000);assert.equal(result.origins[0].f1?.mae,0);
 assert.equal(result.groups[0].relativeImprovement,1);assert.equal(result.groups[0].pairedCount,1);
 assert.equal(result.promotionDecision,"not-evaluated");assert.deepEqual(input,before);
});
test("missing or explicitly incomplete truth is excluded instead of filling zeros",()=>{
 for(const change of ["missing","incomplete"]){const input=dataset();if(change==="missing")input.origins[0].truth.pop();else input.origins[0].truth[0].complete=false;
  const result=runForecastBacktest(input);assert.equal(result.origins[0].status,"excluded");assert.equal(result.origins[0].reason,"incomplete-truth");assert.equal(result.origins[0].f0,null);assert.equal(result.groups.length,0);
 }
});
test("insufficient reviewed history abstains from F1 and never fabricates a paired comparison",()=>{
 const input=dataset();input.origins[0].input.completeDays.pop();const result=runForecastBacktest(input);
 assert.ok(result.origins[0].f0);assert.equal(result.origins[0].f1,null);assert.equal(result.groups[0].pairedCount,0);assert.equal(result.groups[0].f1Unavailable,1);assert.equal(result.groups[0].relativeImprovement,null);
});
test("timestamps and split identities prevent future input and repeated subject leakage",()=>{
 const input=dataset();input.origins[0].schedules.capturedAt="2026-10-02T00:00:00Z";assert.throws(()=>runForecastBacktest(input));
 const leak=dataset();leak.origins.push({...structuredClone(leak.origins[0]),id:"other-origin",split:"holdout"});assert.throws(()=>runForecastBacktest(leak));
 const family=dataset();family.origins.push({...structuredClone(family.origins[0]),id:"other-origin",subjectId:"other-subject",split:"holdout"});assert.throws(()=>runForecastBacktest(family));
 const duplicate=dataset();duplicate.origins.push({...structuredClone(duplicate.origins[0]),id:"duplicated-window"});assert.throws(()=>runForecastBacktest(duplicate));
});
