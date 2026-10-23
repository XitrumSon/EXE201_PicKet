import type { CashflowOccurrence } from "./forecast";
export type ObservedVariableDay={day:string;currency:string;complete:boolean;amount:number};
type Input={startDay:string;days:number;currency:string;history:ObservedVariableDay[]};
type Estimate={kind:"trailing-median-scenario"|"insufficient-history";dailyAmount:number|null;occurrences:CashflowOccurrence[];observedDays:number;limitations:string[]};
export function estimateVariableSpending(_input:Input):Estimate {
  return {kind:"insufficient-history",dailyAmount:null,occurrences:[],observedDays:0,limitations:[]};
}
