import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateForecast } from "./forecast-evaluation";
const path=(values:number[])=>values.map((balance,index)=>({day:`2026-10-${String(index+1).padStart(2,"0")}`,balance}));
test("evaluation reports balance MAE and missed/false negative days separately",()=>{
  const result=evaluateForecast(path([100,100,-100,100,100,100,100]),path([100,-100,100,100,100,100,100]));
  assert.equal(result.mae,400/7);
  assert.equal(result.missedNegativeDays,1);
  assert.equal(result.falseNegativeDays,1);
  assert.equal(result.minimumDayError,1);
});
test("unknown or misaligned ground truth cannot silently improve evaluation metrics",()=>{
  assert.throws(()=>evaluateForecast(path([1,2]),path([1,2])));
  assert.throws(()=>evaluateForecast(path(Array(7).fill(1)),path(Array(6).fill(1))));
  const wrong=path(Array(7).fill(1));wrong[1].day=wrong[0].day;
  assert.throws(()=>evaluateForecast(path(Array(7).fill(1)),wrong));
  assert.throws(()=>evaluateForecast(path(Array(7).fill(1)),path([NaN,1,1,1,1,1,1])));
});
