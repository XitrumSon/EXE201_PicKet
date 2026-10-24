import type {VariableHistoryInput} from "./variable-history";
import type {CashflowSchedule} from "./schedules";
import type {SettlementLink} from "./settlements";
import type {BalanceDay} from "./forecast-evaluation";
export type BacktestSplit="development"|"validation"|"holdout";
export type BacktestOrigin={id:string;subjectId:string;family:string;cohort:string;split:BacktestSplit;days:7|30;input:VariableHistoryInput;schedules:{capturedAt:string;rows:CashflowSchedule[]};settlements:{capturedAt:string;links:SettlementLink[]};truth:(BalanceDay&{complete:boolean;observedAt:string})[]};
export type BacktestDataset={version:string;source:{kind:"synthetic"|"authorized-observations";reference:string};evaluatedAt:string;origins:BacktestOrigin[]};
export function runForecastBacktest(dataset:BacktestDataset):{origins:{id:string;status:string;f0:{mae:number}|null;f1:{mae:number}|null;reason:string|null}[];groups:{currency:string;days:number;pairedCount:number;f1Unavailable:number;relativeImprovement:number|null}[];promotionDecision:string}{void dataset;throw new Error("Not implemented");}
