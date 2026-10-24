import type { CashflowOccurrence } from "./forecast";
import type { LedgerSnapshot } from "./ledger-snapshot";
export type SettlementLink={occurrenceId:string;day:string;amount:number;currency:string;transactionId:string;transactionUpdatedAt:string};
export function resolveSettlements(snapshot:LedgerSnapshot,accounts:string[],currency:string,occurrences:CashflowOccurrence[],links:SettlementLink[]):string[]{
 void snapshot;void accounts;void currency;void occurrences;void links;
 throw new Error("Settlement verification not implemented");
}
