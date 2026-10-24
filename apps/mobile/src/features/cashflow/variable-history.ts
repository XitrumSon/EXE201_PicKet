import type {LedgerSnapshot} from "./ledger-snapshot";
import type {ObservedVariableDay} from "./variable-spending";
export type HistoryReview={transactionId:string;kind:"variable"|"scheduled"|"one-off";reviewedAt:string};
export type CompleteDay={day:string;confirmedAt:string};
export type VariableHistoryInput={snapshot:LedgerSnapshot;accounts:string[];currency:string;startDay:string;completeDays:CompleteDay[];reviews:HistoryReview[]};
export function buildVariableHistory(input:VariableHistoryInput):{history:ObservedVariableDay[];unclassified:string[];completeDays:number;includedVariableTransactionIds:string[]}{void input;throw new Error("Not implemented");}
