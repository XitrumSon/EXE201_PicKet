import type {LedgerSnapshot} from "./ledger-snapshot";
import type {CashflowSchedule} from "./schedules";
import type {SettlementLink} from "./settlements";
import type {calculateCashflow} from "./forecast";
import type {BalanceDay} from "./forecast-evaluation";
export type CaptureInput={snapshot:LedgerSnapshot;accounts:string[];currency:string;days:7|30;schedules:CashflowSchedule[];links:SettlementLink[];pendingCount:number};
export type ClosingObservation={day:string;balance:number;observedAt:string;source:"user-confirmed"};
export type FrozenForecastCase={id:string;revision:number;engineVersion:"f0-schedule-v1";capturedAt:string;sourceAsOf:string;accountIds:string[];includedCount:number;input:Parameters<typeof calculateCashflow>[0];baseline:BalanceDay[];observations:ClosingObservation[];changes:(ClosingObservation&{replacedAt:string})[]};
export function buildCapturedForecast(id:string,input:CaptureInput,now:string):FrozenForecastCase{void id;void input;void now;throw new Error("Not implemented");}
export function parseFrozenForecast(value:unknown):FrozenForecastCase{void value;throw new Error("Not implemented");}
export function evaluateCapturedForecast(value:FrozenForecastCase,now:string):{status:"waiting"|"evaluated";recordedDays:number;closedDays:number;metrics:{mae:number;missedLowBalanceDays:number}|null}{void value;void now;throw new Error("Not implemented");}
